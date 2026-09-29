/**
 * Phase 7: Pricing & Tax Domain Service Verification Suite
 * Tests:
 * 1. Indian Rupee (INR ₹) Formatting
 * 2. Statutory GST Exemption under HSN 4901
 * 3. Standard Retail Tier Calculation
 * 4. Student & Academic Research 15% Subsidy
 * 5. Institutional Library Bulk 20% Procurement (Qualification & Fallback)
 * 6. Mutt & Study Circle 25% Endowment Tier
 * 7. Comprehensive Order Pricing Integration
 * 8. Zero-Floor Protection (Discounts cannot exceed order subtotal)
 */

import { pricingService, HSN_PRINTED_BOOKS, PRICING_TIERS } from '../src/services/pricingService.js';

console.log('--- JSS PUBLICATIONS: PRICING & TAX DOMAIN TESTS ---');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

// -------------------------------------------------------------
// 1. Indian Rupee Formatting
// -------------------------------------------------------------
assert(pricingService.formatINR(1000) === '₹1,000', '1000 should format as ₹1,000');
assert(pricingService.formatINR(125050) === '₹1,25,050', '125050 should format in Indian numbering style');
assert(pricingService.formatINR(0) === '₹0', '0 should format as ₹0');
assert(pricingService.formatINR(49.85) === '₹50', 'Fractional paise should round deterministically');
console.log('1. Currency Formatting (INR ₹): PASSED (Formatted ₹1,000 and ₹1,25,050 correctly)');

// -------------------------------------------------------------
// 2. Statutory GST Exemption under HSN 4901
// -------------------------------------------------------------
const tax = pricingService.getTaxDetails(2500);
assert(tax.hsnCode === '4901', 'HSN Code must be 4901');
assert(tax.isExempt === true, 'Printed literature must be exempt from GST');
assert(tax.totalTaxAmount === 0, 'Total tax on printed books must be 0');
assert(tax.cgstRatePercent === 0 && tax.sgstRatePercent === 0 && tax.igstRatePercent === 0, 'Tax rates must be 0%');
console.log('2. Statutory GST Exemption: PASSED (HSN 4901 0% CGST/SGST/IGST verified)');

// -------------------------------------------------------------
// 3. Retail Tier Evaluation
// -------------------------------------------------------------
const retailEval = pricingService.evaluateTier(1000, 2, 'RETAIL');
assert(retailEval.discountPercent === 0, 'Retail tier has 0% discount');
assert(retailEval.discountAmount === 0, 'Retail tier discount amount is 0');
assert(retailEval.effectiveSubtotal === 1000, 'Effective subtotal equals gross subtotal');
console.log('3. Retail Counter Tier: PASSED (100% price baseline)');

// -------------------------------------------------------------
// 4. Student & Scholar 15% Subsidy
// -------------------------------------------------------------
const studentEval = pricingService.evaluateTier(1000, 2, 'STUDENT_SCHOLAR');
assert(studentEval.discountPercent === 15, 'Student subsidy should be 15%');
assert(studentEval.discountAmount === 150, 'Discount amount on ₹1000 should be ₹150');
assert(studentEval.effectiveSubtotal === 850, 'Effective subtotal should be ₹850');
console.log('4. Student & Scholar Subsidy: PASSED (₹1000 -> ₹850 with 15% discount)');

// -------------------------------------------------------------
// 5. Library Bulk 20% Procurement (Qualification & Fallback)
// -------------------------------------------------------------
// Unqualified order (only 5 books, subtotal ₹2000)
const unqualifiedLibrary = pricingService.evaluateTier(2000, 5, 'LIBRARY_BULK');
assert(!unqualifiedLibrary.isEligible, 'Should be ineligible for library tier');
assert(unqualifiedLibrary.discountPercent === 0, 'Ineligible fallback must revert to 0% discount');

// Qualified order by volume (20 books)
const qualifiedLibrary = pricingService.evaluateTier(6000, 20, 'LIBRARY_BULK');
assert(qualifiedLibrary.isEligible, '20 books should qualify for Library tier');
assert(qualifiedLibrary.discountPercent === 20, 'Library discount should be 20%');
assert(qualifiedLibrary.discountAmount === 1200, 'Discount on ₹6000 should be ₹1200');
console.log('5. Library Bulk Procurement: PASSED (Verified volume qualification and fallback)');

// -------------------------------------------------------------
// 6. Mutt Endowment 25% Subsidy
// -------------------------------------------------------------
const muttEval = pricingService.evaluateTier(4000, 4, 'MUTT_ENDOWMENT');
assert(muttEval.discountPercent === 25, 'Mutt endowment discount should be 25%');
assert(muttEval.discountAmount === 1000, '25% of ₹4000 should be ₹1000');
assert(muttEval.effectiveSubtotal === 3000, 'Effective subtotal should be ₹3000');
console.log('6. Mutt Endowment Tier: PASSED (₹4000 -> ₹3000 with 25% discount)');

// -------------------------------------------------------------
// 7. Comprehensive Order Pricing Integration
// -------------------------------------------------------------
const sampleItems = [
  { price: 1000, quantity: 1 }, // Shivapada Ratnakosha
  { price: 500, quantity: 2 }   // Patanjali Hardbound (2x)
];
const orderPricing = pricingService.calculateOrderPricing(sampleItems, {
  pricingTier: 'STUDENT_SCHOLAR',
  couponDiscount: 100,
  shippingFee: 0
});

assert(orderPricing.grossSubtotal === 2000, `Expected gross ₹2000, got ${orderPricing.grossSubtotal}`);
assert(orderPricing.tierDiscount === 300, `Expected 15% tier discount ₹300, got ${orderPricing.tierDiscount}`);
assert(orderPricing.couponDiscount === 100, `Expected coupon discount ₹100, got ${orderPricing.couponDiscount}`);
assert(orderPricing.netPublicationsTotal === 1600, `Expected net ₹1600, got ${orderPricing.netPublicationsTotal}`);
assert(orderPricing.grandTotal === 1600, `Expected grand total ₹1600, got ${orderPricing.grandTotal}`);
console.log(`7. Order Pricing Breakdown: PASSED (Gross: ₹${orderPricing.grossSubtotal} -> Grand Total: ₹${orderPricing.grandTotal})`);

// -------------------------------------------------------------
// 8. Zero-Floor Protection
// -------------------------------------------------------------
const massiveCouponOrder = pricingService.calculateOrderPricing(sampleItems, {
  pricingTier: 'RETAIL',
  couponDiscount: 99999, // exceeds subtotal
  shippingFee: 40
});
assert(massiveCouponOrder.netPublicationsTotal === 0, 'Net publications subtotal cannot be negative');
assert(massiveCouponOrder.grandTotal === 40, 'Grand total must equal shipping fee ₹40 without negative leak');
console.log('8. Zero-Floor Protection: PASSED (Total bounded safely; no negative prices possible)');

console.log('\n>>> ALL 8 PRICING DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
