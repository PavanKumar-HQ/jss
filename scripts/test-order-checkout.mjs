/**
 * Phase 10: Checkout State Machine & Order Domain Service Verification Suite
 * Tests:
 * 1. Sequential Progression: CART -> CHECKOUT_INITIATED
 * 2. Illegal Transition Prevention: Rejecting direct jump to ORDER_BOOKED
 * 3. Address & PIN Verification: CHECKOUT_INITIATED -> ADDRESS_VALIDATED
 * 4. Atomic Inventory Lock: ADDRESS_VALIDATED -> INVENTORY_RESERVED
 * 5. Payment Preference Assignment: INVENTORY_RESERVED -> PAYMENT_PENDING
 * 6. Order Finalization & Confirmation: PAYMENT_PENDING -> ORDER_BOOKED
 * 7. Proforma Invoice & Statutory HSN 4901 Notice Generation
 * 8. Abort & Inventory Release (Locks returned safely to Available pool)
 */

import { checkoutStateMachine, CHECKOUT_STATES } from '../src/services/checkoutStateMachine.js';
import { orderService } from '../src/services/orderService.js';
import { inventoryService } from '../src/services/inventoryService.js';
import storage from '../src/utils/storage.js';

console.log('--- JSS PUBLICATIONS: CHECKOUT STATE MACHINE & ORDER DOMAIN TESTS ---');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

// Reset clean session
checkoutStateMachine.resetSession();
inventoryService.resetToBaseline();

const sampleItems = [
  { id: 'jss-pub-0001', format: 'Paperback', price: 1000, quantity: 1, weightGrams: 412, title: 'Shivapada Ratnakosha' },
  { id: 'jss-pub-0003', format: 'Paperback', price: 300, quantity: 2, weightGrams: 412, title: 'Patanjali Yoga Sutras' }
];

// -------------------------------------------------------------
// 1. Sequential Progression: CART -> CHECKOUT_INITIATED
// -------------------------------------------------------------
const initRes = checkoutStateMachine.initiateCheckout(sampleItems);
assert(initRes.success === true, 'Initiating checkout should succeed');
assert(initRes.state === CHECKOUT_STATES.CHECKOUT_INITIATED, 'State must be CHECKOUT_INITIATED');
console.log('1. Checkout Initiation: PASSED (CART -> CHECKOUT_INITIATED)');

// -------------------------------------------------------------
// 2. Illegal Transition Prevention
// -------------------------------------------------------------
const illegalBooking = checkoutStateMachine.finalizeOrder('Sneaky note');
assert(illegalBooking.success === false, 'Direct order booking without address and reservation must be blocked');
assert(illegalBooking.reason.includes('Illegal state transition'), 'Must report illegal state transition');
console.log('2. Illegal Transition Guard: PASSED (Blocked illegal jump to ORDER_BOOKED)');

// -------------------------------------------------------------
// 3. Address & PIN Verification
// -------------------------------------------------------------
const addressRes = await checkoutStateMachine.validateAddress({
  fullName: 'Prof. S. N. Mahadevaswamy',
  phone: '9845012345',
  email: 'mahadeva@unimysore.ac.in',
  streetAddress: 'No. 42, 3rd Main, Saraswathipuram',
  city: 'Mysuru',
  state: 'Karnataka',
  pincode: '570009',
  dispatchMethod: 'india-post-speed-post'
});

assert(addressRes.success === true, 'Address validation should succeed');
assert(addressRes.state === CHECKOUT_STATES.ADDRESS_VALIDATED, 'State must be ADDRESS_VALIDATED');
assert(addressRes.pinCheck.regionName.includes('Mysuru'), 'Should identify Mysuru local district');
console.log('3. Address & PIN Verification: PASSED (CHECKOUT_INITIATED -> ADDRESS_VALIDATED)');

// -------------------------------------------------------------
// 4. Atomic Inventory Lock
// -------------------------------------------------------------
const reserveRes = checkoutStateMachine.reserveInventory();
assert(reserveRes.success === true, 'Inventory reservation must succeed');
assert(reserveRes.state === CHECKOUT_STATES.INVENTORY_RESERVED, 'State must be INVENTORY_RESERVED');
assert(reserveRes.reservationId, 'Reservation ID must be returned');

const currentStock = inventoryService.getStock('jss-pub-0001', 'Paperback');
assert(currentStock.reserved >= 1, 'Stock record must reflect active hold');
console.log(`4. Atomic Inventory Lock: PASSED (Hold ID: ${reserveRes.reservationId})`);

// -------------------------------------------------------------
// 5. Payment Preference Assignment
// -------------------------------------------------------------
const paymentRes = checkoutStateMachine.setPaymentPreference('vpp');
assert(paymentRes.success === true, 'Setting payment should succeed');
assert(paymentRes.state === CHECKOUT_STATES.PAYMENT_PENDING, 'State must be PAYMENT_PENDING');
console.log('5. Payment Assignment: PASSED (INVENTORY_RESERVED -> PAYMENT_PENDING)');

// -------------------------------------------------------------
// 6. Order Finalization & Confirmation
// -------------------------------------------------------------
const finalizeRes = checkoutStateMachine.finalizeOrder('Please pack with waterproof wrapping.');
assert(finalizeRes.success === true, 'Order finalization must succeed');
assert(finalizeRes.state === CHECKOUT_STATES.ORDER_BOOKED, 'State must be ORDER_BOOKED');
assert(finalizeRes.orderId.startsWith('JSS-'), `Expected JSS- formatted orderId, got ${finalizeRes.orderId}`);

const confirmedStock = inventoryService.getStock('jss-pub-0001', 'Paperback');
assert(confirmedStock.sold >= 1, 'Inventory reservation converted to permanent sold count');
console.log(`6. Order Finalization: PASSED (Order Reference: ${finalizeRes.orderId})`);

// -------------------------------------------------------------
// 7. Proforma Invoice & Statutory HSN 4901 Notice Generation
// -------------------------------------------------------------
const orderRecord = orderService.getOrderById(finalizeRes.orderId);
assert(orderRecord !== null, 'Order should be retrievable from orderService');

const invoice = orderService.prepareInvoiceData(orderRecord);
assert(invoice.invoiceNumber.includes(finalizeRes.orderId), 'Invoice number should match order ID');
assert(invoice.institution.taxStatus.includes('HSN 4901 Exempt'), 'Statutory 0% GST exemption must be printed');
assert(invoice.billTo.name === 'Prof. S. N. Mahadevaswamy', 'Customer name should match');
assert(invoice.lineItems.length === 2, 'Line items should match ordered publications');
console.log('7. Proforma Invoice Generation: PASSED (Tax-Exempt HSN 4901 Proforma Invoice compiled)');

// -------------------------------------------------------------
// 8. Abort & Inventory Release
// -------------------------------------------------------------
// Start a second checkout, lock stock, then abort
checkoutStateMachine.resetSession();
checkoutStateMachine.initiateCheckout([{ id: 'jss-pub-0002', format: 'Paperback', price: 200, quantity: 4 }]);
await checkoutStateMachine.validateAddress({
  fullName: 'Aborting User',
  phone: '9999999999',
  streetAddress: 'Mysuru',
  pincode: '570004'
});
const abortHold = checkoutStateMachine.reserveInventory();
assert(abortHold.success, 'Hold before abort must succeed');

const beforeAbortStock = inventoryService.getStock('jss-pub-0002', 'Paperback');
assert(beforeAbortStock.reserved === 4, 'Stock should show 4 reserved');

const abortRes = checkoutStateMachine.abortCheckout();
assert(abortRes.success, 'Abort should succeed');
assert(abortRes.state === CHECKOUT_STATES.ABORTED, 'State must be ABORTED');

const afterAbortStock = inventoryService.getStock('jss-pub-0002', 'Paperback');
assert(afterAbortStock.reserved === 0, 'Reserved stock should be released to 0 upon abort');
console.log('8. Abort & Release: PASSED (Held units cleanly returned upon checkout cancellation)');

console.log('\n>>> ALL 8 CHECKOUT & ORDER DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
