/**
 * Pricing & Tax Domain Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Responsibilities:
 * - Authoritative currency formatting and deterministic integer financial calculations (INR ₹)
 * - Statutory GST exemption compliance under HSN Code 4901 (0% CGST, 0% SGST, 0% IGST)
 * - Institutional & scholar discount tier evaluation:
 *   - RETAIL: Standard public counter price
 *   - STUDENT_SCHOLAR: 15% academic research subsidy
 *   - LIBRARY_BULK: 20% institutional library procurement (15+ copies or subtotal >= ₹5,000)
 *   - MUTT_ENDOWMENT: 25% endowment subsidy for affiliated Veerashaiva Mutts & ashrams
 * - Rounding and tamper-proof financial total verification
 */

export const HSN_PRINTED_BOOKS = '4901';
export const GST_EXEMPTION_CITATION = 'GST Exemption Notification No. 2/2017-Central Tax (Rate), HSN 4901';

export const PRICING_TIERS = {
  RETAIL: {
    id: 'RETAIL',
    label: 'Standard Public Counter (ಸಾರ್ವಜನಿಕ ಬೆಲೆ)',
    discountPercent: 0,
    minQty: 1,
    minAmount: 0
  },
  STUDENT_SCHOLAR: {
    id: 'STUDENT_SCHOLAR',
    label: 'University & Mutt Research Scholar (ವಿದ್ಯಾರ್ಥಿ / ಸಂಶೋಧಕ ರಿಯಾಯಿತಿ)',
    discountPercent: 15,
    minQty: 1,
    minAmount: 0
  },
  LIBRARY_BULK: {
    id: 'LIBRARY_BULK',
    label: 'Institutional Library Procurement (ಗ್ರಂಥಾಲಯ ಸಗಟು ಖರೀದಿ)',
    discountPercent: 20,
    minQty: 15,
    minAmount: 5000
  },
  MUTT_ENDOWMENT: {
    id: 'MUTT_ENDOWMENT',
    label: 'Affiliated Mutt & Study Circle Endowment (ಮಠಗಳ ಅಧ್ಯಯನ ಕೇಂದ್ರ)',
    discountPercent: 25,
    minQty: 1,
    minAmount: 0
  }
};

export const pricingService = {
  /**
   * Format any integer or number as standard Indian Rupee notation (e.g., ₹1,25,000)
   * @param {number} amount
   * @param {boolean} [includeSymbol=true]
   * @returns {string}
   */
  formatINR(amount, includeSymbol = true) {
    const safeAmount = typeof amount === 'number' && !isNaN(amount) ? Math.round(amount) : 0;
    const formatted = safeAmount.toLocaleString('en-IN');
    return includeSymbol ? `₹${formatted}` : formatted;
  },

  /**
   * Return formal statutory GST classification under HSN 4901
   * @param {number} subtotal
   * @returns {Object}
   */
  getTaxDetails(subtotal = 0) {
    const safeSubtotal = Math.max(0, Math.round(subtotal));
    return {
      hsnCode: HSN_PRINTED_BOOKS,
      category: 'Printed Books, Sacred Literature, and Scholarly Treatises',
      cgstRatePercent: 0,
      cgstAmount: 0,
      sgstRatePercent: 0,
      sgstAmount: 0,
      igstRatePercent: 0,
      igstAmount: 0,
      totalTaxAmount: 0,
      isExempt: true,
      subtotal: safeSubtotal,
      taxableAmount: 0,
      citation: GST_EXEMPTION_CITATION
    };
  },

  /**
   * Evaluate institutional discount eligibility for a customer order
   * @param {number} subtotal
   * @param {number} totalItemsCount
   * @param {string} [requestedTier='RETAIL']
   * @returns {{ tier: Object, isEligible: boolean, discountAmount: number, effectiveSubtotal: number }}
   */
  evaluateTier(subtotal, totalItemsCount, requestedTier = 'RETAIL') {
    const cleanSubtotal = Math.max(0, Math.round(subtotal));
    const cleanCount = Math.max(0, parseInt(totalItemsCount, 10) || 0);
    const tierConfig = PRICING_TIERS[requestedTier] || PRICING_TIERS.RETAIL;

    let isEligible = true;
    let fallbackReason = null;

    if (tierConfig.minQty && cleanCount < tierConfig.minQty && cleanSubtotal < tierConfig.minAmount) {
      isEligible = false;
      fallbackReason = `Library bulk discount requires at least ${tierConfig.minQty} volumes or order value >= ₹${tierConfig.minAmount}.`;
    }

    const effectiveTier = isEligible ? tierConfig : PRICING_TIERS.RETAIL;
    const discountAmount = Math.round((cleanSubtotal * effectiveTier.discountPercent) / 100);
    const effectiveSubtotal = cleanSubtotal - discountAmount;

    return {
      tier: effectiveTier,
      isEligible,
      fallbackReason,
      discountPercent: effectiveTier.discountPercent,
      discountAmount,
      effectiveSubtotal
    };
  },

  /**
   * Comprehensive order financial breakdown
   * @param {Array<{ price: number, quantity: number }>} items
   * @param {Object} options
   * @param {string} [options.pricingTier='RETAIL']
   * @param {number} [options.couponDiscount=0]
   * @param {number} [options.shippingFee=0]
   */
  calculateOrderPricing(items = [], options = {}) {
    const cleanItems = Array.isArray(items) ? items : [];
    
    // Subtotal
    const itemsCount = cleanItems.reduce((sum, item) => sum + (Math.max(1, parseInt(item.quantity, 10) || 1)), 0);
    const grossSubtotal = cleanItems.reduce((sum, item) => {
      const price = typeof item.price === 'number' && item.price >= 0 ? Math.round(item.price) : 0;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      return sum + (price * qty);
    }, 0);

    // Tier discount
    const tierEvaluation = this.evaluateTier(grossSubtotal, itemsCount, options.pricingTier || 'RETAIL');
    const tierDiscount = tierEvaluation.discountAmount;

    // Additional coupon discount (cannot reduce subtotal below 0)
    const subtotalAfterTier = Math.max(0, grossSubtotal - tierDiscount);
    const cleanCoupon = Math.max(0, Math.min(Math.round(options.couponDiscount || 0), subtotalAfterTier));
    const netPublicationsTotal = subtotalAfterTier - cleanCoupon;

    // Shipping & Delivery
    const cleanShipping = Math.max(0, Math.round(options.shippingFee || 0));

    // Tax
    const tax = this.getTaxDetails(netPublicationsTotal);

    // Final grand total
    const grandTotal = netPublicationsTotal + cleanShipping + tax.totalTaxAmount;

    return {
      itemsCount,
      grossSubtotal,
      tierDiscount,
      appliedTier: tierEvaluation.tier,
      isTierEligible: tierEvaluation.isEligible,
      couponDiscount: cleanCoupon,
      totalDiscount: tierDiscount + cleanCoupon,
      netPublicationsTotal,
      shippingFee: cleanShipping,
      tax,
      grandTotal,
      currency: 'INR',
      formattedGross: this.formatINR(grossSubtotal),
      formattedGrandTotal: this.formatINR(grandTotal)
    };
  }
};

export default pricingService;
