/**
 * Shipping & Postal Dispatch Domain Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Responsibilities:
 * - Calculate India Post Speed Post and Registered Book Post rates
 * - Free shipping threshold enforcement (Subtotal >= ₹500)
 * - Parcel weight tier calculation (up to 500g, 500g-1000g, and incremental kg slabs)
 * - Counter pickup rate resolution (₹0)
 * - Indian Postal Circle serviceability and transit estimation via PIN code
 * - Zero fake tracking numbers: Consignment numbers are issued only upon physical booking
 */

import validation from '../utils/validation.js';
import pincodeService from './pincodeService.js';

export const FREE_SHIPPING_THRESHOLD = 500;
export const BASE_STANDARD_FEE = 40;

export const DISPATCH_METHODS = {
  INDIA_POST_SPEED_POST: {
    id: 'india-post-speed-post',
    name: 'India Post Speed Post (ವೇಗದ ಅಂಚೆ)',
    carrier: 'India Post',
    description: 'Fastest postal parcel service across India with SMS alerts & doorstep delivery',
    baseFee: 40,
    freeThreshold: 500
  },
  REGISTERED_BOOK_POST: {
    id: 'registered-book-post',
    name: 'Registered Book Post (ಮುದ್ರಿತ ಗ್ರಂಥ ಅಂಚೆ)',
    carrier: 'India Post',
    description: 'Subsidized academic postal parcel dispatch specifically for printed books and journals',
    baseFee: 30,
    freeThreshold: 500
  },
  COUNTER_PICKUP: {
    id: 'counter-pickup',
    name: 'Counter Collection at JSS Book House, Mysuru (ನೇರ ಖರೀದಿ)',
    carrier: 'Direct Collection',
    description: 'Collect your order directly from the JSS Publications retail counter in Mysuru',
    baseFee: 0,
    freeThreshold: 0
  }
};

export const shippingService = {
  /**
   * Get available dispatch options
   */
  getDispatchMethods() {
    return Object.values(DISPATCH_METHODS);
  },

  /**
   * Calculate parcel delivery fee based on method, subtotal, and total weight
   * @param {Object} params
   * @param {string} [params.method='india-post-speed-post']
   * @param {number} [params.subtotal=0]
   * @param {number} [params.weightGrams=240]
   * @param {boolean} [params.hasFreeShippingCoupon=false]
   * @returns {Object}
   */
  calculateShippingFee({
    method = 'india-post-speed-post',
    subtotal = 0,
    weightGrams = 240,
    hasFreeShippingCoupon = false
  }) {
    const cleanSubtotal = Math.max(0, Math.round(subtotal));
    const cleanWeight = Math.max(100, Math.round(weightGrams));

    // 1. Counter pickup is always completely free
    if (method === 'counter-pickup') {
      return {
        method: DISPATCH_METHODS.COUNTER_PICKUP,
        shippingFee: 0,
        isFree: true,
        reason: 'Counter collection at JSS Book House, Mysuru',
        weightGrams: cleanWeight,
        freeShippingThreshold: 0
      };
    }

    const selectedMethod =
      method === 'registered-book-post'
        ? DISPATCH_METHODS.REGISTERED_BOOK_POST
        : DISPATCH_METHODS.INDIA_POST_SPEED_POST;

    // 2. Free shipping threshold or coupon qualification
    if (hasFreeShippingCoupon || cleanSubtotal >= FREE_SHIPPING_THRESHOLD) {
      return {
        method: selectedMethod,
        shippingFee: 0,
        isFree: true,
        reason: hasFreeShippingCoupon
          ? 'Free shipping promotional coupon applied'
          : `Qualified for Free Shipping (Subtotal ₹${cleanSubtotal} >= ₹${FREE_SHIPPING_THRESHOLD})`,
        weightGrams: cleanWeight,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD
      };
    }

    // 3. Weight-tier calculations for parcels below free shipping threshold
    let fee = selectedMethod.baseFee; // First 500g

    if (cleanWeight > 500 && cleanWeight <= 1000) {
      fee += 20; // 500g - 1kg tier
    } else if (cleanWeight > 1000) {
      const additional500gSlabs = Math.ceil((cleanWeight - 1000) / 500);
      fee += 20 + additional500gSlabs * 25; // Tier additions
    }

    const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cleanSubtotal);

    return {
      method: selectedMethod,
      shippingFee: fee,
      isFree: false,
      amountNeededForFreeShipping,
      weightGrams: cleanWeight,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD
    };
  },

  /**
   * Validate destination PIN code and estimate delivery timeframe
   * @param {string|number} pincode
   */
  async estimateDelivery(pincode) {
    return pincodeService.checkServiceability(pincode);
  }
};

export default shippingService;
