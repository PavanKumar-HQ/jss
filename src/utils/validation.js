/**
 * Input validation helpers for retail bookstore e-commerce
 */

export const validation = {
  /**
   * Indian Postal PIN code: 6 numeric digits, starting with 1-9 (never 0).
   */
  isValidIndianPin(pincode) {
    if (!pincode) return false;
    const clean = String(pincode).trim();
    return /^[1-9][0-9]{5}$/.test(clean);
  },

  /**
   * Standard email format check
   */
  isValidEmail(email) {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim().toLowerCase());
  },

  /**
   * Indian 10-digit mobile number or standard landline format
   */
  isValidPhone(phone) {
    if (!phone) return false;
    const digitsOnly = String(phone).replace(/[\s\-\(\)\+]/g, '');
    // 10 digits starting with 6-9 (mobile) or 10-11 digits (std landline)
    return /^[6-9]\d{9}$/.test(digitsOnly) || /^0\d{9,10}$/.test(digitsOnly);
  },

  /**
   * Clamp and validate order item quantities
   * Max 10 per book title for retail orders (bulk orders use separate inquiry flow)
   */
  sanitizeQuantity(qty, min = 1, max = 10) {
    const num = parseInt(qty, 10);
    if (isNaN(num) || num < min) return min;
    if (num > max) return max;
    return num;
  }
};

export default validation;
