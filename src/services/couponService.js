/**
 * Coupon Domain Service
 * Provides client validation and discount calculation interface.
 *
 * NOTE: For production checkout with financial processing, this service delegates to
 * an authoritative backend API endpoint. The default configurations below serve as
 * clean domain representations that can be swapped for remote resolution.
 */

// Configurable client catalog of institutional discount codes & reader offers
const DEFAULT_COUPONS = [
  {
    code: 'JSSSTUDENT15',
    description: '15% Academic Subsidy for Registered University & Mutt Research Scholars',
    type: 'percentage',
    value: 15, // 15%
    minSubtotal: 300,
    maxDiscount: 250,
    validUntil: '2027-12-31',
    freeShipping: false
  },
  {
    code: 'JNANA10',
    description: '10% Reader Welcome Discount on Sacred Vachana & Philosophy Series',
    type: 'percentage',
    value: 10, // 10%
    minSubtotal: 400,
    maxDiscount: 200,
    validUntil: '2027-12-31',
    freeShipping: false
  },
  {
    code: 'FREESHIP',
    description: 'Free Pan-India Postal Delivery (Exempt from standard delivery fee)',
    type: 'shipping',
    value: 0,
    minSubtotal: 200,
    maxDiscount: 40,
    validUntil: '2027-12-31',
    freeShipping: true
  },
  {
    code: 'SUTTURMATH20',
    description: '20% Institutional Endowment for Mutts, Pathashalas & Study Circles',
    type: 'percentage',
    value: 20,
    minSubtotal: 1000,
    maxDiscount: 500,
    validUntil: '2027-12-31',
    freeShipping: true
  }
];

export const couponService = {
  /**
   * Returns list of visible public coupon suggestions for the UI
   */
  getAvailableOffers() {
    return DEFAULT_COUPONS.map((c) => ({
      code: c.code,
      description: c.description,
      minSubtotal: c.minSubtotal
    }));
  },

  /**
   * Validates a promotional or institutional discount code against current subtotal
   * @param {string} rawCode - Entered coupon string
   * @param {number} subtotal - Current cart gross value
   * @param {Array} cartItems - Current items (for category-specific rules if needed)
   * @returns {Object} validation outcome
   */
  validateCoupon(rawCode, subtotal = 0, cartItems = []) {
    if (!rawCode || typeof rawCode !== 'string') {
      return {
        isValid: false,
        error: 'Please enter a coupon code.'
      };
    }

    const code = rawCode.trim().toUpperCase();
    const coupon = DEFAULT_COUPONS.find((c) => c.code === code);

    if (!coupon) {
      return {
        isValid: false,
        code,
        error: `Coupon code "${code}" is not valid for JSS Publications.`
      };
    }

    // Check expiration
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return {
        isValid: false,
        code,
        error: `Coupon "${code}" has expired.`
      };
    }

    // Check minimum spend
    if (subtotal < coupon.minSubtotal) {
      return {
        isValid: false,
        code,
        error: `Coupon "${code}" requires a minimum order of ₹${coupon.minSubtotal}. Add ₹${coupon.minSubtotal - subtotal} more.`
      };
    }

    // Calculate effective discount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'flat') {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return {
      isValid: true,
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      discountAmount,
      freeShipping: coupon.freeShipping || false,
      message: `Coupon "${coupon.code}" applied successfully! You save ₹${discountAmount}.`
    };
  }
};

export default couponService;
