/**
 * JSS Publications - Runtime Schema Validation Layer
 *
 * Enforces strict domain validation contracts on all API inputs,
 * form submissions, and administrative mutations. Rejects malformed
 * or invalid data before it reaches the domain logic.
 */

export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.errors = errors;
  }
}

export const validator = {
  /**
   * Validate Indian Postal PIN Code (6 digits, non-zero start)
   */
  validatePin(pin) {
    if (!pin) return { valid: false, message: 'PIN code is required' };
    const clean = String(pin).trim();
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      return { valid: false, message: 'Must be a valid 6-digit Indian Postal PIN code' };
    }
    return { valid: true, value: clean };
  },

  /**
   * Validate Email address
   */
  validateEmail(email, required = true) {
    if (!email || !String(email).trim()) {
      if (required) return { valid: false, message: 'Email address is required' };
      return { valid: true, value: '' };
    }
    const clean = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return { valid: false, message: 'Must be a valid email format' };
    }
    return { valid: true, value: clean };
  },

  /**
   * Validate Indian Phone Number (10 digits starting with 6-9, or 10-11 std digits)
   */
  validatePhone(phone) {
    if (!phone) return { valid: false, message: 'Telephone number is required' };
    const digits = String(phone).replace(/[\s\-\(\)\+]/g, '');
    if (!/^[6-9]\d{9}$/.test(digits) && !/^0\d{9,10}$/.test(digits)) {
      return { valid: false, message: 'Must be a valid 10-digit Indian mobile or landline' };
    }
    return { valid: true, value: digits };
  },

  /**
   * Validate Order Checkout Payload
   */
  validateCheckoutPayload(payload) {
    const errors = [];
    if (!payload || typeof payload !== 'object') {
      throw new ValidationError('Checkout payload must be an object', [{ field: 'root', message: 'Payload missing' }]);
    }

    // 1. Customer
    const customer = payload.customer || {};
    if (!customer.fullName || !String(customer.fullName).trim()) {
      errors.push({ field: 'customer.fullName', message: 'Full name is required' });
    }
    const phoneRes = this.validatePhone(customer.phone);
    if (!phoneRes.valid) {
      errors.push({ field: 'customer.phone', message: phoneRes.message });
    }
    const emailRes = this.validateEmail(customer.email, false);
    if (!emailRes.valid) {
      errors.push({ field: 'customer.email', message: emailRes.message });
    }

    // 2. Shipping Address
    const address = payload.shippingAddress || {};
    if (!address.addressLine || !String(address.addressLine).trim()) {
      errors.push({ field: 'shippingAddress.addressLine', message: 'Street address is required' });
    }
    if (!address.city || !String(address.city).trim()) {
      errors.push({ field: 'shippingAddress.city', message: 'City is required' });
    }
    const pinRes = this.validatePin(address.pincode);
    if (!pinRes.valid) {
      errors.push({ field: 'shippingAddress.pincode', message: pinRes.message });
    }

    // 3. Items
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push({ field: 'items', message: 'Cart items array cannot be empty' });
    } else {
      payload.items.forEach((it, idx) => {
        if (!it.id && !it.editionId) {
          errors.push({ field: `items[${idx}].id`, message: 'Item id or editionId is required' });
        }
        const qty = Number(it.quantity);
        if (isNaN(qty) || qty < 1 || qty > 10) {
          errors.push({ field: `items[${idx}].quantity`, message: 'Quantity must be between 1 and 10' });
        }
      });
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed for checkout order', errors);
    }

    return true;
  },

  /**
   * Validate Admin Book Creation / Update Payload
   */
  validateBookInput(input, isUpdate = false) {
    const errors = [];
    if (!input || typeof input !== 'object') {
      throw new ValidationError('Book input must be an object');
    }

    if (!isUpdate || input.title !== undefined) {
      if (!input.title || !String(input.title).trim()) {
        errors.push({ field: 'title', message: 'Book title is required' });
      }
    }

    if (!isUpdate || input.author !== undefined) {
      if (!input.author || !String(input.author).trim()) {
        errors.push({ field: 'author', message: 'Author or editor name is required' });
      }
    }

    if (!isUpdate || input.price !== undefined) {
      const price = Number(input.price);
      if (isNaN(price) || price < 0) {
        errors.push({ field: 'price', message: 'Price must be a non-negative number' });
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed for publication record', errors);
    }

    return true;
  },

  /**
   * Validate Inventory Adjustment Payload
   */
  validateStockAdjustment(payload) {
    const errors = [];
    if (!payload || typeof payload !== 'object') {
      throw new ValidationError('Stock adjustment payload must be an object');
    }

    if (!payload.editionId) {
      errors.push({ field: 'editionId', message: 'Edition identifier is required' });
    }

    const amount = Number(payload.amount);
    if (isNaN(amount) || amount === 0) {
      errors.push({ field: 'amount', message: 'Adjustment amount must be a non-zero integer' });
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed for inventory adjustment', errors);
    }

    return true;
  }
};

export default validator;
