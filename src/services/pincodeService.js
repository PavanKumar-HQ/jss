/**
 * Postal Serviceability & Pincode Domain Service
 * Validates Indian postal PIN codes and calculates estimated delivery zones.
 *
 * NOTE: Actual delivery promises, carrier rates, and postal dispatch windows
 * are authoritative from backend logistics APIs (e.g., India Post Speed Post integration).
 * This service provides an abstracted interface for client UI estimation.
 */

import validation from '../utils/validation';

/**
 * Approximate postal circle inference from the first 2 digits of Indian PIN codes.
 */
function inferRegion(pincode) {
  const prefix2 = parseInt(String(pincode).substring(0, 2), 10);
  const prefix3 = parseInt(String(pincode).substring(0, 3), 10);

  if (prefix3 === 570) {
    return {
      circle: 'Karnataka (Mysuru Local District)',
      state: 'Karnataka',
      estimatedDays: '1–2 business days',
      isLocal: true,
      serviceable: true
    };
  }

  if (prefix2 >= 56 && prefix2 <= 59) {
    return {
      circle: 'Karnataka Postal Circle',
      state: 'Karnataka',
      estimatedDays: '2–3 business days',
      isLocal: false,
      serviceable: true
    };
  }

  if (prefix2 >= 50 && prefix2 <= 53) {
    return {
      circle: 'Andhra Pradesh & Telangana Circle',
      state: 'AP / Telangana',
      estimatedDays: '3–4 business days',
      isLocal: false,
      serviceable: true
    };
  }

  if (prefix2 >= 60 && prefix2 <= 64) {
    return {
      circle: 'Tamil Nadu Postal Circle',
      state: 'Tamil Nadu',
      estimatedDays: '3–4 business days',
      isLocal: false,
      serviceable: true
    };
  }

  if (prefix2 >= 67 && prefix2 <= 69) {
    return {
      circle: 'Kerala Postal Circle',
      state: 'Kerala',
      estimatedDays: '3–4 business days',
      isLocal: false,
      serviceable: true
    };
  }

  if (prefix2 >= 11 && prefix2 <= 49 || prefix2 >= 70 && prefix2 <= 85) {
    return {
      circle: 'National Postal Circle',
      state: 'Rest of India',
      estimatedDays: '4–6 business days',
      isLocal: false,
      serviceable: true
    };
  }

  return {
    circle: 'All-India Postal Network',
    state: 'India',
    estimatedDays: '4–7 business days',
    isLocal: false,
    serviceable: true
  };
}

export const pincodeService = {
  /**
   * Validate and estimate delivery for a 6-digit Indian PIN code.
   * Can be swapped with an asynchronous remote API call seamlessly.
   * @param {string|number} pincode
   * @returns {Promise<Object>} serviceability assessment
   */
  async checkServiceability(pincode) {
    const cleanPin = String(pincode || '').trim();

    if (!validation.isValidIndianPin(cleanPin)) {
      return {
        isValid: false,
        serviceable: false,
        error: 'Please enter a valid 6-digit Indian Postal PIN code (e.g. 570004).'
      };
    }

    const region = inferRegion(cleanPin);

    return {
      isValid: true,
      serviceable: region.serviceable,
      pincode: cleanPin,
      regionName: region.circle,
      state: region.state,
      estimatedDeliveryWindow: region.estimatedDays,
      dispatchOrigin: 'JSS Book House Retail Counter, Dr. Shivarathri Rajendra Circle, Mysuru',
      carrier: 'India Post (Speed Post / Registered Book Post)',
      isTaxExempt: true, // Printed books exempt under HSN 4901
      note: 'Direct postal dispatch with registered consignment booking.'
    };
  }
};

export default pincodeService;
