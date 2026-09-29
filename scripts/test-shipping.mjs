/**
 * Phase 9: Shipping & Postal Dispatch Domain Service Verification Suite
 * Tests:
 * 1. Available Dispatch Methods
 * 2. Free Postal Dispatch Threshold (Subtotal >= ₹500)
 * 3. Base Speed Post Rate (< ₹500, <= 500g)
 * 4. Parcel Weight Tier Increments (500g - 1000g, > 1000g)
 * 5. Counter Pickup Resolution (₹0)
 * 6. Free Shipping Coupon Override
 * 7. PIN Code Validation & Circle Transit Estimation
 * 8. Invalid PIN Rejection
 */

import { shippingService, DISPATCH_METHODS, FREE_SHIPPING_THRESHOLD } from '../src/services/shippingService.js';
import { pincodeService } from '../src/services/pincodeService.js';

console.log('--- JSS PUBLICATIONS: SHIPPING & POSTAL DISPATCH DOMAIN TESTS ---');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

// -------------------------------------------------------------
// 1. Available Dispatch Methods
// -------------------------------------------------------------
const methods = shippingService.getDispatchMethods();
assert(methods.length === 3, `Expected 3 dispatch methods, got ${methods.length}`);
assert(methods.some((m) => m.id === 'india-post-speed-post'), 'Must include India Post Speed Post');
assert(methods.some((m) => m.id === 'counter-pickup'), 'Must include Counter Collection at Mysuru');
console.log('1. Dispatch Methods: PASSED (Speed Post, Book Post, Counter Pickup available)');

// -------------------------------------------------------------
// 2. Free Postal Dispatch Threshold
// -------------------------------------------------------------
const freeCalc = shippingService.calculateShippingFee({
  method: 'india-post-speed-post',
  subtotal: 550,
  weightGrams: 450
});
assert(freeCalc.isFree === true, 'Subtotal ₹550 must qualify for free shipping');
assert(freeCalc.shippingFee === 0, 'Shipping fee must be ₹0');
console.log(`2. Free Shipping Threshold: PASSED (Subtotal ₹550 >= ₹${FREE_SHIPPING_THRESHOLD} -> ₹0 Shipping)`);

// -------------------------------------------------------------
// 3. Base Speed Post Rate (< ₹500, <= 500g)
// -------------------------------------------------------------
const standardCalc = shippingService.calculateShippingFee({
  method: 'india-post-speed-post',
  subtotal: 300,
  weightGrams: 400
});
assert(standardCalc.isFree === false, 'Subtotal ₹300 must not qualify for free shipping');
assert(standardCalc.shippingFee === 40, `Expected base fee ₹40, got ${standardCalc.shippingFee}`);
assert(standardCalc.amountNeededForFreeShipping === 200, 'Should note ₹200 needed for free shipping');
console.log('3. Base Speed Post Rate: PASSED (₹40 standard delivery on sub-threshold orders)');

// -------------------------------------------------------------
// 4. Parcel Weight Tier Increments
// -------------------------------------------------------------
// Weight tier: 750g (between 500g and 1000g) -> Base 40 + 20 = 60
const tier1Calc = shippingService.calculateShippingFee({
  method: 'india-post-speed-post',
  subtotal: 250,
  weightGrams: 750
});
assert(tier1Calc.shippingFee === 60, `Expected ₹60 for 750g, got ${tier1Calc.shippingFee}`);

// Heavy consignment: 1800g (> 1000g) -> Base 40 + 20 + (2 slabs * 25) = 110
const tier2Calc = shippingService.calculateShippingFee({
  method: 'india-post-speed-post',
  subtotal: 250,
  weightGrams: 1800
});
assert(tier2Calc.shippingFee === 110, `Expected ₹110 for 1.8kg consignment, got ${tier2Calc.shippingFee}`);
console.log('4. Weight Tier Increments: PASSED (750g -> ₹60, 1.8kg -> ₹110)');

// -------------------------------------------------------------
// 5. Counter Pickup Resolution
// -------------------------------------------------------------
const pickupCalc = shippingService.calculateShippingFee({
  method: 'counter-pickup',
  subtotal: 150,
  weightGrams: 2500 // Heavy weight
});
assert(pickupCalc.isFree === true, 'Counter pickup must always be free');
assert(pickupCalc.shippingFee === 0, 'Shipping fee must be ₹0');
console.log('5. Counter Collection: PASSED (Always ₹0 delivery fee)');

// -------------------------------------------------------------
// 6. Free Shipping Coupon Override
// -------------------------------------------------------------
const couponOverrideCalc = shippingService.calculateShippingFee({
  method: 'india-post-speed-post',
  subtotal: 100, // well below ₹500
  weightGrams: 1200,
  hasFreeShippingCoupon: true
});
assert(couponOverrideCalc.isFree === true, 'Coupon must override fee');
assert(couponOverrideCalc.shippingFee === 0, 'Coupon must produce ₹0 shipping fee');
console.log('6. Coupon Override: PASSED (Free shipping coupon honored)');

// -------------------------------------------------------------
// 7. PIN Code Validation & Circle Transit Estimation
// -------------------------------------------------------------
const mysuruLocal = await pincodeService.checkServiceability('570004');
assert(mysuruLocal.isValid === true, '570004 must be valid');
assert(mysuruLocal.regionName.includes('Mysuru Local District'), '570004 must map to Mysuru Local District');
assert(mysuruLocal.estimatedDeliveryWindow === '1–2 business days', 'Mysuru local should estimate 1-2 days');

const bengaluruPin = await pincodeService.checkServiceability('560001');
assert(bengaluruPin.regionName.includes('Karnataka Postal Circle'), '560001 must map to Karnataka Postal Circle');

const delhiPin = await pincodeService.checkServiceability('110001');
assert(delhiPin.regionName.includes('National Postal Circle'), '110001 must map to National Postal Circle');
console.log('7. PIN Code Postal Circle Routing: PASSED (Mysuru Local, Karnataka Circle, National Circle)');

// -------------------------------------------------------------
// 8. Invalid PIN Rejection
// -------------------------------------------------------------
const invalidPin = await pincodeService.checkServiceability('0123');
assert(invalidPin.isValid === false, 'Invalid PIN length must be rejected');
assert(invalidPin.serviceable === false, 'Serviceable must be false');
console.log('8. Invalid PIN Rejection: PASSED (Safely caught non-6-digit input)');

console.log('\n>>> ALL 8 SHIPPING DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
