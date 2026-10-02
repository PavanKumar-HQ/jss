/**
 * Server-side Runtime Schema Validation
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 */

export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.errors = errors;
  }
}

export const serverValidator = {
  validatePin(pin) {
    if (!pin) return { valid: false, message: 'PIN code is required' };
    const clean = String(pin).trim();
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      return { valid: false, message: 'Must be a valid 6-digit Indian Postal PIN code' };
    }
    return { valid: true, value: clean };
  },

  validatePhone(phone) {
    if (!phone) return { valid: false, message: 'Telephone number is required' };
    const digits = String(phone).replace(/[\s\-\(\)\+]/g, '');
    if (!/^[6-9]\d{9}$/.test(digits) && !/^0\d{9,10}$/.test(digits)) {
      return { valid: false, message: 'Must be a valid 10-digit Indian phone number' };
    }
    return { valid: true, value: digits };
  },

  validateOrderPayload(payload) {
    const errors = [];
    if (!payload || typeof payload !== 'object') {
      throw new ValidationError('Payload must be an object');
    }

    const { customer, shippingAddress, items } = payload;

    if (!customer?.fullName?.trim()) {
      errors.push({ field: 'customer.fullName', message: 'Customer full name is required' });
    }
    const phoneRes = this.validatePhone(customer?.phone);
    if (!phoneRes.valid) {
      errors.push({ field: 'customer.phone', message: phoneRes.message });
    }

    if (!shippingAddress?.addressLine?.trim()) {
      errors.push({ field: 'shippingAddress.addressLine', message: 'Address line is required' });
    }
    const pinRes = this.validatePin(shippingAddress?.pincode);
    if (!pinRes.valid) {
      errors.push({ field: 'shippingAddress.pincode', message: pinRes.message });
    }

    if (!Array.isArray(items) || items.length === 0) {
      errors.push({ field: 'items', message: 'Order items array cannot be empty' });
    } else {
      items.forEach((it, idx) => {
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
      throw new ValidationError('Validation failed for order submission', errors);
    }
    return true;
  },

  validateStockAdjustment(payload) {
    const errors = [];
    if (!payload?.editionId) {
      errors.push({ field: 'editionId', message: 'Edition ID is required' });
    }
    const amount = Number(payload?.amount);
    if (isNaN(amount) || amount === 0) {
      errors.push({ field: 'amount', message: 'Adjustment amount must be a non-zero integer' });
    }
    if (errors.length > 0) {
      throw new ValidationError('Validation failed for inventory adjustment', errors);
    }
    return true;
  },

  validatePriceAdjustment(payload) {
    const errors = [];
    const newPrice = Number(payload?.newPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      errors.push({ field: 'newPrice', message: 'New price must be a non-negative number' });
    }
    if (!payload?.binding) {
      errors.push({ field: 'binding', message: 'Binding format is required' });
    }
    if (errors.length > 0) {
      throw new ValidationError('Validation failed for price adjustment', errors);
    }
    return true;
  }
};

export default serverValidator;
