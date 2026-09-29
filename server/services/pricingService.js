/**
 * Authoritative Server Pricing & Financial Domain Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Implements server-side price verification, coupon validation,
 * statutory GST exemption (HSN 4901 0%), and India Post shipping fees.
 */

import { db } from './db.js';

export const FREE_SHIPPING_THRESHOLD = 500;
export const BASE_SHIPPING_FEE = 40;

export class PricingService {
  /**
   * Recalculate cart totals strictly from database state.
   * Client-provided prices are completely discarded and replaced with authoritative database prices.
   */
  calculateCartTotals(rawItems, couponCode = null, isCounterPickup = false) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return {
        itemsCount: 0,
        subtotal: 0,
        discount: 0,
        shippingFee: 0,
        grandTotal: 0,
        totalWeightGrams: 0,
        gstRate: '0%',
        gstAmount: 0,
        items: []
      };
    }

    let subtotal = 0;
    let totalWeightGrams = 0;
    let itemsCount = 0;
    const verifiedItems = [];

    for (const item of rawItems) {
      const editionId = item.editionId || item.id;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      // Fetch authoritative price from database
      const edition = db.queryOne(`
        SELECT e.*, b.title, b.title_kannada, b.author, b.category
        FROM editions e
        JOIN books b ON e.book_id = b.id
        WHERE e.id = ?
      `, editionId);

      if (!edition) {
        throw new Error(`Catalogue item "${editionId}" not found in authoritative database.`);
      }

      const unitPrice = edition.price;
      const lineTotal = unitPrice * qty;
      const weight = (edition.weight_grams || 450) * qty;

      subtotal += lineTotal;
      totalWeightGrams += weight;
      itemsCount += qty;

      verifiedItems.push({
        editionId: edition.id,
        bookId: edition.book_id,
        title: edition.title,
        titleKannada: edition.title_kannada,
        author: edition.author,
        binding: edition.binding,
        isbn: edition.isbn,
        price: unitPrice,
        quantity: qty,
        lineTotal,
        hsnCode: '4901'
      });
    }

    // Coupon validation
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const codeUpper = String(couponCode).trim().toUpperCase();
      const coupon = db.queryOne(`
        SELECT * FROM coupons
        WHERE code = ? AND is_active = 1
      `, codeUpper);

      if (coupon) {
        const meetsMin = !coupon.min_order_amount || subtotal >= coupon.min_order_amount;
        const withinUsage = !coupon.usage_limit || coupon.times_used < coupon.usage_limit;

        if (meetsMin && withinUsage) {
          if (coupon.discount_type === 'percentage') {
            discount = (subtotal * coupon.discount_value) / 100;
          } else {
            discount = coupon.discount_value;
          }

          if (coupon.max_discount && discount > coupon.max_discount) {
            discount = coupon.max_discount;
          }

          discount = Math.min(discount, subtotal);
          appliedCoupon = {
            code: coupon.code,
            discountType: coupon.discount_type,
            discountValue: coupon.discount_value,
            amount: discount
          };
        }
      }
    }

    // Shipping calculation
    let shippingFee = 0;
    if (!isCounterPickup) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingFee = 0;
      } else {
        // Base rate + weight tier
        shippingFee = BASE_SHIPPING_FEE;
        if (totalWeightGrams > 1000) {
          const extraKg = Math.ceil((totalWeightGrams - 1000) / 500);
          shippingFee += extraKg * 20;
        }
      }
    }

    const grandTotal = Math.max(0, subtotal - discount + shippingFee);

    return {
      itemsCount,
      subtotal,
      discount,
      shippingFee,
      grandTotal,
      totalWeightGrams,
      gstRate: '0%',
      gstAmount: 0,
      hsnCode: '4901',
      appliedCoupon,
      items: verifiedItems
    };
  }

  /**
   * Validate coupon code against database
   */
  validateCoupon(code, subtotal) {
    const codeUpper = String(code).trim().toUpperCase();
    const coupon = db.queryOne(`
      SELECT * FROM coupons
      WHERE code = ? AND is_active = 1
    `, codeUpper);

    if (!coupon) {
      return { isValid: false, reason: 'Invalid or expired coupon code.' };
    }

    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return {
        isValid: false,
        reason: `Minimum order amount of ₹${coupon.min_order_amount} required for this coupon.`
      };
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return { isValid: false, reason: 'Coupon usage limit has been reached.' };
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal * coupon.discount_value) / 100;
    } else {
      discountAmount = coupon.discount_value;
    }

    if (coupon.max_discount && discountAmount > coupon.max_discount) {
      discountAmount = coupon.max_discount;
    }

    return {
      isValid: true,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      discountAmount: Math.min(discountAmount, subtotal)
    };
  }
}

export const pricingService = new PricingService();
export default pricingService;
