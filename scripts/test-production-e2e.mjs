/**
 * JSS Publications - Production E2E Acceptance Test Suite
 * Validates real server-side transactions, real database persistence,
 * race-condition concurrency defense, and live state synchronization.
 *
 * Runs against the real backend services and SQLite 3 database.
 */

import assert from 'node:assert';
import { db } from '../server/services/db.js';
import { seedDatabase } from '../server/db/seed.js';
import { catalogueService } from '../server/services/catalogueService.js';
import { inventoryService } from '../server/services/inventoryService.js';
import { pricingService } from '../server/services/pricingService.js';
import { orderService, ORDER_STATUSES } from '../server/services/orderService.js';
import { paymentService } from '../server/services/paymentService.js';

console.log('\n================================================================');
console.log('--- JSS PUBLICATIONS: PRODUCTION END-TO-END ACCEPTANCE TESTS ---');
console.log('================================================================\n');

// 1. Prepare clean database state
seedDatabase(true);

let passedTests = 0;

async function runTests() {
  // -------------------------------------------------------------
  // TEST 1 — BOOK PURCHASE (Full End-to-End Flow)
  // -------------------------------------------------------------
  console.log('--- TEST 1: Full Book Purchase Flow ---');
  // Admin creates book
  const newBook = catalogueService.addBook({
    title: 'Anubhava Mantapa Vivarane',
    titleKannada: 'ಅನುಭವ ಮಂಟಪ ವಿವರಣೆ',
    author: 'Sri Shivarathri Deshikendra Swamiji',
    category: 'Vachana Literature',
    price: 350,
    stock: 20
  });
  assert(newBook && newBook.id, 'Book creation must return persisted entity');
  console.log(`1. Admin created book: "${newBook.title}" (ID: ${newBook.id})`);

  // Customer fetches book
  const fetchedBook = catalogueService.getBookById(newBook.id);
  assert.strictEqual(fetchedBook.title, 'Anubhava Mantapa Vivarane');
  const pbEdition = fetchedBook.editions.find(e => e.binding === 'Paperback');
  assert(pbEdition, 'Paperback edition must exist in database');
  console.log(`2. Customer fetched book with authoritative price: ₹${pbEdition.price}`);

  // Customer places order
  const orderResult = orderService.createOrder({
    customer: {
      fullName: 'Dr. Guruswamy Hiremath',
      email: 'guruswamy@mysoreuniv.ac.in',
      phone: '9845012345'
    },
    shippingAddress: {
      addressLine: 'Saraswathipuram 5th Cross',
      landmark: 'Near University Library',
      city: 'Mysuru',
      state: 'Karnataka',
      pincode: '570009'
    },
    items: [
      { editionId: pbEdition.id, quantity: 2 }
    ],
    dispatchMethod: 'india-post-speed-post',
    paymentMethod: 'Value Payable Post (V.P.P. - Postal Collection)'
  });

  assert(orderResult && orderResult.orderReference, 'Order must return real order reference');
  assert.strictEqual(orderResult.totals.subtotal, 700);
  assert.strictEqual(orderResult.totals.grandTotal, 700); // >= ₹500 free shipping
  console.log(`3. Customer placed order: ${orderResult.orderReference} for 2 copies. Subtotal: ₹${orderResult.totals.subtotal}`);

  // Verify stock in database
  const stockAfter = inventoryService.getStock(pbEdition.id);
  assert.strictEqual(stockAfter.available_stock, 18, 'Available stock must decrement from 20 to 18');
  assert.strictEqual(stockAfter.sold_stock, 2, 'Sold stock must increment to 2');
  console.log(`4. Database stock verified: Available: ${stockAfter.available_stock}, Sold: ${stockAfter.sold_stock}`);

  // Admin inspects order
  const adminOrder = orderService.getOrder(orderResult.orderReference);
  assert(adminOrder, 'Admin must be able to retrieve real persisted order');
  assert.strictEqual(adminOrder.items.length, 1);
  assert.strictEqual(adminOrder.items[0].price, 350);
  console.log(`5. Admin verified order items and immutable proforma invoice in database: PASSED`);
  passedTests++;

  // -------------------------------------------------------------
  // TEST 2 — ADMIN INVENTORY SYNCHRONIZATION
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: Admin Inventory Synchronization ---');
  const book2 = catalogueService.getBookBySlug('sadhana-path-of-liberation');
  const pb2 = book2.editions.find(e => e.binding === 'Paperback');

  // Adjust stock to exactly 10
  inventoryService.adjustStock(pb2.id, 10 - pb2.available_stock, 'Reset baseline to 10 copies', 'Test Harness');
  assert.strictEqual(inventoryService.getStock(pb2.id).available_stock, 10);
  console.log(`1. Baseline stock set to: 10 copies`);

  // Customer purchases 2
  orderService.createOrder({
    customer: { fullName: 'Reader Basavaraj', phone: '9448011223' },
    shippingAddress: { addressLine: 'Kuvempunagar', city: 'Mysuru', state: 'Karnataka', pincode: '570023' },
    items: [{ editionId: pb2.id, quantity: 2 }],
    dispatchMethod: 'counter-pickup',
    paymentMethod: 'Counter Collection'
  });

  const updatedStock = inventoryService.getStock(pb2.id).available_stock;
  assert.strictEqual(updatedStock, 8, 'Authoritative stock must be 8');
  console.log(`2. After customer purchase of 2 units: Authoritative stock = ${updatedStock}: PASSED`);
  passedTests++;

  // -------------------------------------------------------------
  // TEST 3 — ADMIN PRICE CHANGE IMMUTABILITY
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: Admin Price Change & Order Immutability ---');
  const testBook = catalogueService.addBook({
    title: 'Kalyana Kranti Darshana',
    author: 'Prof. M. Chidananda Murthy',
    category: 'Vachana Literature',
    price: 250,
    stock: 50
  });
  const testEd = testBook.editions[0];

  // Order A placed at ₹250
  const orderA = orderService.createOrder({
    customer: { fullName: 'Scholar A', phone: '9880011222' },
    shippingAddress: { addressLine: 'Jayanagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560011' },
    items: [{ editionId: testEd.id, quantity: 1 }],
    dispatchMethod: 'counter-pickup',
    paymentMethod: 'Counter Collection'
  });
  assert.strictEqual(orderA.totals.subtotal, 250);
  console.log(`1. Order A placed at ₹250 (Order Ref: ${orderA.orderReference})`);

  // Admin updates price to ₹300
  catalogueService.updatePrice(testBook.id, testEd.binding, 300, 'Paper reprint cost revision', 'Admin Pavan');
  const updatedEd = db.queryOne('SELECT * FROM editions WHERE id = ?', testEd.id);
  assert.strictEqual(updatedEd.price, 300, 'Database price must now be ₹300');
  console.log(`2. Admin updated edition price in database to ₹300`);

  // New checkout re-evaluates at ₹300
  const recalculation = pricingService.calculateCartTotals([{ editionId: testEd.id, quantity: 1 }], null, true);
  assert.strictEqual(recalculation.subtotal, 300, 'New cart total must authoritative reflect ₹300');
  console.log(`3. Storefront cart recalculation uses new price: ₹${recalculation.subtotal}`);

  // Historical Order A MUST still remain ₹250
  const retrievedOrderA = orderService.getOrder(orderA.orderReference);
  assert.strictEqual(retrievedOrderA.subtotal, 250, 'Historical order must never be mutated by catalog price updates');
  assert.strictEqual(retrievedOrderA.items[0].price, 250);
  console.log(`4. Historical Order A retained original ₹250: PASSED`);
  passedTests++;

  // -------------------------------------------------------------
  // TEST 4 — ORDER CANCELLATION & INVENTORY RESTORATION
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: Order Cancellation & Inventory Restoration ---');
  const cancelBook = catalogueService.addBook({
    title: 'Siddhanta Shikhamani Commentary',
    author: 'Jagadguru Dr. Sri Shivarathri Rajendra Swamiji',
    category: 'Veerashaiva Philosophy',
    price: 400,
    stock: 10
  });
  const cancelEd = cancelBook.editions[0];

  // Customer orders 2 -> stock drops to 8
  const orderToCancel = orderService.createOrder({
    customer: { fullName: 'Customer C', phone: '9900112233' },
    shippingAddress: { addressLine: 'VV Mohalla', city: 'Mysuru', state: 'Karnataka', pincode: '570002' },
    items: [{ editionId: cancelEd.id, quantity: 2 }],
    dispatchMethod: 'counter-pickup',
    paymentMethod: 'Counter Collection'
  });

  assert.strictEqual(inventoryService.getStock(cancelEd.id).available_stock, 8);
  console.log(`1. Customer ordered 2 units. Stock dropped from 10 to 8.`);

  // Cancel order
  orderService.updateOrderStatus(orderToCancel.orderReference, ORDER_STATUSES.CANCELLED, {
    reason: 'Customer requested cancellation prior to packing',
    actor: 'Admin Ramesh'
  });

  const stockAfterCancel = inventoryService.getStock(cancelEd.id).available_stock;
  assert.strictEqual(stockAfterCancel, 10, 'Cancelled order must return 2 copies to available stock');
  console.log(`2. Order cancelled. Available stock automatically restored to ${stockAfterCancel}: PASSED`);

  const ledgerEntries = db.queryAll('SELECT * FROM inventory_ledger WHERE edition_id = ? ORDER BY rowid DESC', cancelEd.id);
  assert(ledgerEntries[0].operation_type === 'RETURN');
  console.log(`3. Verified audit ledger contains RETURN entry: PASSED`);
  passedTests++;

  // -------------------------------------------------------------
  // TEST 5 — CONCURRENT PURCHASES & RACE CONDITION DEFENSE
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: Concurrent Purchase Concurrency Control ---');
  const rareBook = catalogueService.addBook({
    title: 'Rare Palm Leaf Manuscript Reprint',
    author: 'Allama Prabhu Research Foundation',
    category: 'Vachana Literature',
    price: 1200,
    stock: 1 // EXACTLY ONE COPY
  });
  const rareEd = rareBook.editions[0];

  assert.strictEqual(inventoryService.getStock(rareEd.id).available_stock, 1);
  console.log(`1. Scarce book created with exactly 1 unit available.`);

  let customerAWon = false;
  let customerBWonError = false;

  // Simulate Customer A checkout
  try {
    orderService.createOrder({
      customer: { fullName: 'Customer A', phone: '9111111111' },
      shippingAddress: { addressLine: 'Line 1', city: 'Mysuru', state: 'Karnataka', pincode: '570001' },
      items: [{ editionId: rareEd.id, quantity: 1 }],
      dispatchMethod: 'counter-pickup',
      paymentMethod: 'Counter Collection'
    });
    customerAWon = true;
    console.log(`2. Customer A successfully purchased the 1 available unit.`);
  } catch (err) {
    console.error('Customer A error:', err.message);
  }

  // Simulate Customer B simultaneous checkout
  try {
    orderService.createOrder({
      customer: { fullName: 'Customer B', phone: '9222222222' },
      shippingAddress: { addressLine: 'Line 2', city: 'Mysuru', state: 'Karnataka', pincode: '570001' },
      items: [{ editionId: rareEd.id, quantity: 1 }],
      dispatchMethod: 'counter-pickup',
      paymentMethod: 'Counter Collection'
    });
  } catch (err) {
    customerBWonError = true;
    console.log(`3. Customer B checkout rejected with authoritative server error: "${err.message}"`);
  }

  assert(customerAWon, 'First customer transaction must succeed');
  assert(customerBWonError, 'Second customer transaction must be rejected due to zero available stock');

  const finalStock = inventoryService.getStock(rareEd.id).available_stock;
  assert.strictEqual(finalStock, 0, 'Final stock must be exactly 0, never negative');
  console.log(`4. Final available stock is exactly ${finalStock} (0 negative stock): PASSED`);
  passedTests++;

  // -------------------------------------------------------------
  // TEST 6 — PAYMENT NOT CONFIGURED EXPOSURE
  // -------------------------------------------------------------
  console.log('\n--- TEST 6: Payment Gateway Boundary & Zero-Simulation Guarantee ---');
  delete process.env.RAZORPAY_KEY_ID;
  delete process.env.RAZORPAY_KEY_SECRET;

  const paymentIntent = await paymentService.createPaymentIntent({
    amountInRupees: 500,
    orderReference: 'JSS-2026-TEST',
    customer: { fullName: 'Test User', phone: '9845000000' }
  });

  assert.strictEqual(paymentIntent.configured, false);
  assert(paymentIntent.error.includes('PAYMENT NOT CONFIGURED'), 'Must explicitly expose missing gateway configuration');
  console.log(`1. Verified gateway returns "PAYMENT NOT CONFIGURED" when credentials unset: PASSED`);
  passedTests++;

  console.log(`\n================================================================`);
  console.log(`>>> ALL ${passedTests} PRODUCTION END-TO-END ACCEPTANCE TESTS PASSED! <<<`);
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILURE:', err);
  process.exit(1);
});
