/**
 * Phase 8: Coupon & Promotion Domain Service Verification Suite
 * Tests:
 * 1. Valid Promotional Code Lookup & Calculation
 * 2. Minimum Spend Requirement Enforcement
 * 3. Non-Existent Code Rejection
 * 4. Maximum Discount Ceiling Cap
 * 5. Category-Specific Eligibility Filtering
 * 6. Free Shipping Coupon Activation
 * 7. Persistent Coupon Application & Removal
 * 8. Authoritative Verification Payload Formatting
 */

import { couponService, DEFAULT_COUPONS } from '../src/services/couponService.js';
import storage from '../src/utils/storage.js';

console.log('--- JSS PUBLICATIONS: COUPONS & PROMOTIONS DOMAIN TESTS ---');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

// Clean state
couponService.removeCoupon();

// -------------------------------------------------------------
// 1. Valid Promotional Code Lookup & Calculation
// -------------------------------------------------------------
const studentRes = couponService.validateCoupon('JSSSTUDENT15', 1000);
assert(studentRes.isValid === true, 'JSSSTUDENT15 should be valid for ₹1000 subtotal');
assert(studentRes.discountAmount === 150, `Expected ₹150 discount (15% of 1000), got ${studentRes.discountAmount}`);
console.log('1. Valid Coupon Calculation: PASSED (JSSSTUDENT15 -> ₹150 discount)');

// -------------------------------------------------------------
// 2. Minimum Spend Requirement Enforcement
// -------------------------------------------------------------
const belowMinRes = couponService.validateCoupon('JSSSTUDENT15', 200); // min is 300
assert(belowMinRes.isValid === false, 'Should reject when subtotal is below ₹300');
assert(belowMinRes.error.includes('minimum order of ₹300'), 'Error message must note min threshold');
console.log('2. Minimum Spend Enforcement: PASSED (Rejected order below ₹300)');

// -------------------------------------------------------------
// 3. Non-Existent Code Rejection
// -------------------------------------------------------------
const fakeRes = couponService.validateCoupon('FAKEDISCOUNT99', 1000);
assert(fakeRes.isValid === false, 'Fake code should be rejected');
console.log('3. Invalid Code Rejection: PASSED (Unrecognized code rejected)');

// -------------------------------------------------------------
// 4. Maximum Discount Ceiling Cap
// -------------------------------------------------------------
// JSSSTUDENT15 has maxDiscount of ₹250. On a ₹5000 order, 15% would be ₹750, but should be capped at ₹250.
const cappedRes = couponService.validateCoupon('JSSSTUDENT15', 5000);
assert(cappedRes.isValid === true, 'Order should be valid');
assert(cappedRes.discountAmount === 250, `Discount must be capped at ₹250, got ${cappedRes.discountAmount}`);
console.log('4. Maximum Discount Capping: PASSED (Capped at ₹250 ceiling)');

// -------------------------------------------------------------
// 5. Category-Specific Eligibility Filtering
// -------------------------------------------------------------
// JNANA10 is only eligible on 'Vachana Literature' and 'Veerashaiva Philosophy'
const ineligibleItems = [
  { id: 'sci-01', category: 'Education & Science', price: 500, quantity: 1 }
];
const catRejectRes = couponService.validateCoupon('JNANA10', 500, ineligibleItems);
assert(catRejectRes.isValid === false, 'JNANA10 should be rejected on science category books');

const eligibleItems = [
  { id: 'vach-01', category: 'Vachana Literature', price: 600, quantity: 1 }
];
const catAcceptRes = couponService.validateCoupon('JNANA10', 600, eligibleItems);
assert(catAcceptRes.isValid === true, 'JNANA10 should be accepted on Vachana Literature books');
assert(catAcceptRes.discountAmount === 60, '10% of 600 should be ₹60');
console.log('5. Category Eligibility Filtering: PASSED (JNANA10 accepted on sacred literature only)');

// -------------------------------------------------------------
// 6. Free Shipping Coupon Activation
// -------------------------------------------------------------
const freeShipRes = couponService.validateCoupon('FREESHIP', 250);
assert(freeShipRes.isValid === true, 'FREESHIP should be valid on ₹250 order');
assert(freeShipRes.freeShipping === true, 'freeShipping flag must be true');
assert(freeShipRes.discountAmount === 0, 'Shipping coupon should have 0 merchandise discount');
console.log('6. Free Shipping Coupon: PASSED (FREESHIP enables free postal dispatch)');

// -------------------------------------------------------------
// 7. Persistent Coupon Application & Removal
// -------------------------------------------------------------
couponService.applyCoupon('SUTTURMATH20', 1200);
const applied = couponService.getAppliedCoupon();
assert(applied !== null, 'Applied coupon should be retrievable from storage');
assert(applied.code === 'SUTTURMATH20', 'Retrieved code should match applied code');
assert(applied.discountAmount === 240, '20% discount on ₹1200 should be ₹240');

couponService.removeCoupon();
const cleared = couponService.getAppliedCoupon();
assert(cleared === null, 'Coupon should be null after removal');
console.log('7. Persistence & Application State: PASSED (Applied, stored, and cleared cleanly)');

// -------------------------------------------------------------
// 8. Authoritative Verification Payload Formatting
// -------------------------------------------------------------
const payload = couponService.generateVerificationPayload('JSSSTUDENT15', 1000, [
  { id: 'jss-pub-0001', format: 'Paperback', price: 1000, quantity: 1 }
]);
assert(payload.couponCode === 'JSSSTUDENT15', 'Payload couponCode should be normalized uppercase');
assert(payload.clientClaimedSubtotal === 1000, 'Subtotal should be recorded');
assert(payload.itemCount === 1, 'Item count should be recorded');
assert(payload.timestamp, 'Timestamp must be present');
console.log('8. Server Verification Payload: PASSED (Formatted structured payload for backend settlement)');

console.log('\n>>> ALL 8 COUPONS & PROMOTIONS DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
