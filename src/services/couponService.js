/**
 * Coupon & Promotion Domain Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Responsibilities:
 * - Institutional discount code validation & bounds enforcement
 * - Category eligibility and exclusion checking
 * - Reactive application state (getAppliedCoupon, applyCoupon, removeCoupon)
 * - Anti-tampering discount clamping
 * - Server verification payload formatting (for backend settlement)
 */

import storage from '../utils/storage.js';

const APPLIED_COUPON_STORAGE_KEY = 'jss_granthamale_applied_coupon';
const listeners = new Set();

function notifyListeners(coupon) {
  listeners.forEach((listener) => {
    try {
      listener(coupon);
    } catch (err) {
      console.error('[couponService] Listener error:', err);
    }
  });
}

// Configurable client catalog of institutional discount codes & reader offers
export const DEFAULT_COUPONS = [
  {
    code: 'JSSSTUDENT15',
    description: '15% Academic Subsidy for Registered University & Mutt Research Scholars',
    type: 'percentage',
    value: 15,
    minSubtotal: 300,
    maxDiscount: 250,
    validUntil: '2027-12-31',
    freeShipping: false,
    eligibleCategories: ['Vachana Literature', 'Veerashaiva Philosophy', 'Spirituality & Yoga', 'Biographies & Heritage', 'Education & Science']
  },
  {
    code: 'JNANA10',
    description: '10% Reader Welcome Discount on Sacred Vachana & Philosophy Series',
    type: 'percentage',
    value: 10,
    minSubtotal: 400,
    maxDiscount: 200,
    validUntil: '2027-12-31',
    freeShipping: false,
    eligibleCategories: ['Vachana Literature', 'Veerashaiva Philosophy']
  },
  {
    code: 'FREESHIP',
    description: 'Free Pan-India India Post Speed Post Delivery on orders above ₹200',
    type: 'shipping',
    value: 0,
    minSubtotal: 200,
    maxDiscount: 40,
    validUntil: '2027-12-31',
    freeShipping: true,
    eligibleCategories: []
  },
  {
    code: 'SUTTURMATH20',
    description: '20% Institutional Endowment for Mutts, Pathashalas & Study Circles',
    type: 'percentage',
    value: 20,
    minSubtotal: 1000,
    maxDiscount: 600,
    validUntil: '2027-12-31',
    freeShipping: true,
    eligibleCategories: []
  }
];

export const couponService = {
  /**
   * Subscribe to coupon application changes
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  /**
   * Returns list of visible public coupon suggestions for the UI
   */
  getAvailableOffers() {
    return DEFAULT_COUPONS.map((c) => ({
      code: c.code,
      description: c.description,
      minSubtotal: c.minSubtotal,
      type: c.type,
      freeShipping: c.freeShipping
    }));
  },

  /**
   * Retrieve currently applied coupon from persistent storage
   */
  getAppliedCoupon() {
    try {
      const raw = storage.get(APPLIED_COUPON_STORAGE_KEY, null);
      if (raw && typeof raw === 'object' && raw.code && raw.isValid) {
        return raw;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Validates a promotional or institutional discount code against current subtotal and items
   * @param {string} rawCode - Entered coupon string
   * @param {number} subtotal - Current cart gross value
   * @param {Array} [cartItems=[]] - Current items
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
        error: `Coupon code "${code}" is not recognized for JSS Publications.`
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
    const cleanSubtotal = Math.max(0, Math.round(subtotal));
    if (cleanSubtotal < coupon.minSubtotal) {
      return {
        isValid: false,
        code,
        error: `Coupon "${code}" requires a minimum order of ₹${coupon.minSubtotal}. Add ₹${coupon.minSubtotal - cleanSubtotal} more.`
      };
    }

    // Category eligibility check (if restricted to specific publishing folios)
    let eligibleSubtotal = cleanSubtotal;
    if (coupon.eligibleCategories && coupon.eligibleCategories.length > 0 && Array.isArray(cartItems) && cartItems.length > 0) {
      const qualifyingItems = cartItems.filter((item) =>
        coupon.eligibleCategories.includes(item.category)
      );
      if (qualifyingItems.length === 0) {
        return {
          isValid: false,
          code,
          error: `Coupon "${code}" is only valid on: ${coupon.eligibleCategories.join(', ')}.`
        };
      }
      eligibleSubtotal = qualifyingItems.reduce(
        (sum, item) => sum + Math.round((item.price || 0) * (item.quantity || 1)),
        0
      );
    }

    // Calculate effective discount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((eligibleSubtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'flat') {
      discountAmount = Math.min(coupon.value, eligibleSubtotal);
    } else if (coupon.type === 'shipping') {
      discountAmount = 0; // Handled via freeShipping flag
    }

    return {
      isValid: true,
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      discountAmount,
      freeShipping: coupon.freeShipping || false,
      message: `Coupon "${coupon.code}" applied successfully! ${discountAmount > 0 ? `You save ₹${discountAmount}.` : 'Free shipping activated.'}`
    };
  },

  /**
   * Apply a coupon and persist it into storage
   */
  applyCoupon(rawCode, subtotal, cartItems = []) {
    const outcome = this.validateCoupon(rawCode, subtotal, cartItems);
    if (outcome.isValid) {
      storage.set(APPLIED_COUPON_STORAGE_KEY, outcome);
      notifyListeners(outcome);
    }
    return outcome;
  },

  /**
   * Remove currently applied coupon
   */
  removeCoupon() {
    storage.remove(APPLIED_COUPON_STORAGE_KEY);
    notifyListeners(null);
    return { success: true };
  },

  /**
   * Generates authoritative server verification payload
   */
  generateVerificationPayload(code, subtotal, items = []) {
    return {
      couponCode: String(code || '').trim().toUpperCase(),
      clientClaimedSubtotal: subtotal,
      itemCount: items.length,
      items: items.map((i) => ({ id: i.id, format: i.format, price: i.price, qty: i.quantity })),
      timestamp: new Date().toISOString()
    };
  }
};

export default couponService;

