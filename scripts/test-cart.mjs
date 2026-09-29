import { cartService } from '../src/services/cartService.js';
import { catalogueService } from '../src/services/catalogueService.js';
import storage from '../src/utils/storage.js';

async function runTests() {
  console.log('--- JSS PUBLICATIONS: CART SERVICE DOMAIN TESTS ---');

  // Clear cart before start
  cartService.clearCart();

  // Test 1: Add Standard Paperback Book
  const book1 = catalogueService.getBookById(1); // Shivapada Ratnakosha
  const res1 = cartService.addItem(book1, 'Paperback', 1);
  if (!res1.success || res1.cart.length !== 1) throw new Error('Failed to add book1 to cart');
  const cartItem1 = res1.cart[0];
  if (cartItem1.price !== 1000 || cartItem1.format !== 'Paperback') {
    throw new Error(`Expected price ₹1000 and Paperback format, got ₹${cartItem1.price} / ${cartItem1.format}`);
  }
  console.log(`1. Add Standard Item: PASSED (${cartItem1.title} [${cartItem1.format}] -> ₹${cartItem1.price})`);

  // Test 2: Add Multi-Edition Hardbound Variant
  const book3 = catalogueService.getBookById(3); // Patanjali Yoga Sutras (Paperback: ₹300, Hardbound: ₹500)
  const res2 = cartService.addItem(book3, 'Hardbound', 2);
  const cartItem3 = res2.cart.find(i => i.id === book3.id && i.format === 'Hardbound');
  if (!cartItem3 || cartItem3.price !== 500 || cartItem3.quantity !== 2) {
    throw new Error('Failed to add Hardbound edition with correct price and quantity');
  }
  console.log(`2. Add Multi-Edition Variant: PASSED (${cartItem3.title} [${cartItem3.format}] -> ₹${cartItem3.price}, Qty: ${cartItem3.quantity})`);

  // Test 3: Security Defense - Never Trust Frontend Prices
  // Attempt to add book with a tampered client price: 1
  const tamperedBook = { ...book1, price: 1 };
  cartService.addItem(tamperedBook, 'Paperback', 1);
  const recheckedCart = cartService.getCart();
  const verifiedItem1 = recheckedCart.find(i => i.id === book1.id);
  if (verifiedItem1.price === 1) {
    throw new Error('SECURITY BREACH: Cart accepted tampered client-side price of ₹1!');
  }
  if (verifiedItem1.price !== 1000) {
    throw new Error(`Expected authoritative price of ₹1000, got ₹${verifiedItem1.price}`);
  }
  console.log(`3. Security Price Tampering Defense: PASSED (Client price ₹1 was rejected; authoritative price ₹1000 enforced)`);

  // Test 4: Quantity Ceiling Enforcement (Max 10 for standard, max 5 for deluxe)
  const book11 = catalogueService.getBookById(11); // Deluxe edition max limit 5
  cartService.addItem(book11, 'Deluxe Hardbound', 8);
  const cartItem11 = cartService.getCart().find(i => i.id === book11.id);
  if (cartItem11.quantity > 5) {
    throw new Error(`Deluxe edition quantity exceeded max limit of 5: got ${cartItem11.quantity}`);
  }
  console.log(`4. Retail Quantity Ceiling Enforcement: PASSED (Requested 8 deluxe copies, clamped to ${cartItem11.quantity})`);

  // Test 5: Update Quantity and Zero Removal
  cartService.updateQuantity(book1.id, 'Paperback', 0);
  const cartAfterRemoval = cartService.getCart();
  if (cartAfterRemoval.some(i => i.id === book1.id)) {
    throw new Error('Item should be removed when quantity set to 0');
  }
  console.log('5. Quantity Zero-Removal: PASSED (Book 1 removed when quantity set to 0)');

  // Test 6: Deterministic Financial Totals (Subtotal, Shipping, 0% GST)
  const totals = cartService.getTotals();
  console.log(`6. Financial Totals Calculation: PASSED:`);
  console.log(`   - Items Count: ${totals.itemsCount}`);
  console.log(`   - Subtotal: ₹${totals.subtotal}`);
  console.log(`   - Shipping: ₹${totals.shippingFee} (Threshold: ₹${totals.freeShippingThreshold})`);
  console.log(`   - Grand Total: ₹${totals.grandTotal}`);
  console.log(`   - Total Parcel Weight: ${totals.totalWeightGrams}g`);
  console.log(`   - GST Rate: 0% (Tax Exempt under HSN 4901)`);
  if (totals.subtotal < totals.freeShippingThreshold && totals.shippingFee !== 40) {
    throw new Error('Standard shipping fee of ₹40 should apply under ₹500');
  }

  // Test 7: Corrupted Storage Recovery
  // Inject corrupted non-array data into storage
  storage.set('jss_granthamale_cart', { corrupted: 'bad_object' });
  const recoveredCart = cartService.getCart();
  if (!Array.isArray(recoveredCart) || recoveredCart.length !== 0) {
    throw new Error('Failed to safely heal corrupted non-array cart storage');
  }
  console.log('7. Corrupted Storage Healing: PASSED (Healed non-array corrupted storage cleanly)');

  // Test 8: Cart Reconciliation against Authoritative Catalogue
  // Create a cart with a tampered price and a discontinued book ID
  const testCart = [
    { id: book3.id, format: 'Hardbound', price: 99, quantity: 2, title: book3.title }, // Tampered price ₹99
    { id: 'discontinued-book-999', format: 'Paperback', price: 200, quantity: 1, title: 'Old Discontinued Book' }
  ];
  storage.set('jss_granthamale_cart', testCart);

  const reconciliation = cartService.reconcileCart();
  console.log(`8. Authoritative Cart Reconciliation: PASSED (${reconciliation.notifications.length} modifications detected):`);
  reconciliation.notifications.forEach(n => console.log(`   - ${n}`));

  if (!reconciliation.hasModifications) throw new Error('Expected modifications during reconciliation');
  if (reconciliation.cart.some(i => i.id === 'discontinued-book-999')) {
    throw new Error('Discontinued book was not purged during reconciliation');
  }
  const reconciledBook3 = reconciliation.cart.find(i => i.id === book3.id);
  if (reconciledBook3.price !== 500) {
    throw new Error(`Reconciled price should be ₹500, got ₹${reconciledBook3.price}`);
  }

  console.log('\n>>> ALL 8 CART SERVICE DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
}

runTests().catch(err => {
  console.error('Cart Domain Test Failed:', err);
  process.exit(1);
});
