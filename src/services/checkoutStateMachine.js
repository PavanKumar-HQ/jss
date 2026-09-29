/**
 * Checkout State Machine Domain Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Implements strict, server-aligned checkout state transitions:
 * CART → CHECKOUT_INITIATED → ADDRESS_VALIDATED → INVENTORY_RESERVED → PAYMENT_PENDING → ORDER_BOOKED
 *
 * Security & Integrity:
 * - Prevents illegal skips (e.g. attempting to jump to ORDER_BOOKED without INVENTORY_RESERVED)
 * - Releases inventory locks cleanly upon abort or failure
 * - Confirms inventory reservation upon order booking
 */

import storage from '../utils/storage.js';
import { inventoryService } from './inventoryService.js';
import { shippingService } from './shippingService.js';
import { pricingService } from './pricingService.js';
import { orderService } from './orderService.js';

const CHECKOUT_SESSION_KEY = 'jss_granthamale_checkout_session';

export const CHECKOUT_STATES = {
  CART: 'CART',
  CHECKOUT_INITIATED: 'CHECKOUT_INITIATED',
  ADDRESS_VALIDATED: 'ADDRESS_VALIDATED',
  INVENTORY_RESERVED: 'INVENTORY_RESERVED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  ORDER_BOOKED: 'ORDER_BOOKED',
  ABORTED: 'ABORTED'
};

const VALID_TRANSITIONS = {
  [CHECKOUT_STATES.CART]: [CHECKOUT_STATES.CHECKOUT_INITIATED],
  [CHECKOUT_STATES.CHECKOUT_INITIATED]: [CHECKOUT_STATES.ADDRESS_VALIDATED, CHECKOUT_STATES.ABORTED],
  [CHECKOUT_STATES.ADDRESS_VALIDATED]: [CHECKOUT_STATES.INVENTORY_RESERVED, CHECKOUT_STATES.ABORTED],
  [CHECKOUT_STATES.INVENTORY_RESERVED]: [CHECKOUT_STATES.PAYMENT_PENDING, CHECKOUT_STATES.ABORTED],
  [CHECKOUT_STATES.PAYMENT_PENDING]: [CHECKOUT_STATES.ORDER_BOOKED, CHECKOUT_STATES.ABORTED],
  [CHECKOUT_STATES.ORDER_BOOKED]: [],
  [CHECKOUT_STATES.ABORTED]: [CHECKOUT_STATES.CHECKOUT_INITIATED]
};

export const checkoutStateMachine = {
  /**
   * Get active checkout session
   */
  getSession() {
    return storage.get(CHECKOUT_SESSION_KEY, {
      state: CHECKOUT_STATES.CART,
      reservationId: null,
      address: null,
      items: [],
      totals: null,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Save session
   */
  saveSession(session) {
    storage.set(CHECKOUT_SESSION_KEY, session);
  },

  /**
   * Step 1: Initiate checkout from cart
   * @param {Array} items
   */
  initiateCheckout(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return { success: false, reason: 'Cart is empty' };
    }

    const session = {
      state: CHECKOUT_STATES.CHECKOUT_INITIATED,
      items,
      reservationId: null,
      address: null,
      paymentPreference: null,
      updatedAt: new Date().toISOString()
    };

    this.saveSession(session);
    return { success: true, session, state: CHECKOUT_STATES.CHECKOUT_INITIATED };
  },

  /**
   * Step 2: Validate shipping address and PIN code
   */
  async validateAddress(addressData) {
    const session = this.getSession();
    if (session.state !== CHECKOUT_STATES.CHECKOUT_INITIATED && session.state !== CHECKOUT_STATES.ADDRESS_VALIDATED) {
      return { success: false, reason: `Cannot validate address in state ${session.state}` };
    }

    if (!addressData || !addressData.fullName || !addressData.phone || !addressData.streetAddress || !addressData.pincode) {
      return { success: false, reason: 'Incomplete postal address' };
    }

    const pinCheck = await shippingService.estimateDelivery(addressData.pincode);
    if (!pinCheck.isValid) {
      return { success: false, reason: pinCheck.error };
    }

    session.state = CHECKOUT_STATES.ADDRESS_VALIDATED;
    session.address = {
      ...addressData,
      regionName: pinCheck.regionName,
      estimatedDeliveryWindow: pinCheck.estimatedDeliveryWindow
    };
    session.updatedAt = new Date().toISOString();

    this.saveSession(session);
    return { success: true, session, state: CHECKOUT_STATES.ADDRESS_VALIDATED, pinCheck };
  },

  /**
   * Step 3: Atomically reserve inventory lock
   */
  reserveInventory() {
    const session = this.getSession();
    if (session.state !== CHECKOUT_STATES.ADDRESS_VALIDATED) {
      return { success: false, reason: `Cannot reserve inventory in state ${session.state}` };
    }

    const reservation = inventoryService.reserveStock(session.items, 15);
    if (!reservation.success) {
      return { success: false, reason: reservation.reason, failedItems: reservation.failedItems };
    }

    session.state = CHECKOUT_STATES.INVENTORY_RESERVED;
    session.reservationId = reservation.reservationId;
    session.reservationExpiresAt = reservation.expiresAt;
    session.updatedAt = new Date().toISOString();

    this.saveSession(session);
    return { success: true, session, state: CHECKOUT_STATES.INVENTORY_RESERVED, reservationId: reservation.reservationId };
  },

  /**
   * Step 4: Set Payment Preference
   */
  setPaymentPreference(paymentPreference = 'vpp') {
    const session = this.getSession();
    if (session.state !== CHECKOUT_STATES.INVENTORY_RESERVED) {
      return { success: false, reason: `Cannot set payment in state ${session.state}` };
    }

    session.state = CHECKOUT_STATES.PAYMENT_PENDING;
    session.paymentPreference = paymentPreference;
    session.updatedAt = new Date().toISOString();

    this.saveSession(session);
    return { success: true, session, state: CHECKOUT_STATES.PAYMENT_PENDING };
  },

  /**
   * Step 5: Finalize and Book Order
   */
  finalizeOrder(orderNotes = '') {
    const session = this.getSession();
    if (session.state !== CHECKOUT_STATES.PAYMENT_PENDING) {
      return {
        success: false,
        reason: `Illegal state transition: Cannot book order from state ${session.state}`
      };
    }

    // Calculate authoritative totals
    const shippingResult = shippingService.calculateShippingFee({
      method: session.address.dispatchMethod || 'india-post-speed-post',
      subtotal: session.items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
      weightGrams: session.items.reduce((sum, i) => sum + ((i.weightGrams || 240) * i.quantity), 0)
    });

    const pricing = pricingService.calculateOrderPricing(session.items, {
      pricingTier: 'RETAIL',
      shippingFee: shippingResult.shippingFee
    });

    // Create Order Record in orderService
    const orderResult = orderService.createOrder({
      customer: {
        fullName: session.address.fullName,
        phone: session.address.phone,
        email: session.address.email || 'customer@jssonline.org'
      },
      shippingAddress: {
        addressLine: session.address.streetAddress,
        landmark: session.address.landmark || '',
        city: session.address.city,
        state: session.address.state || 'Karnataka',
        pincode: session.address.pincode
      },
      items: session.items,
      totals: {
        itemsCount: pricing.itemsCount,
        subtotal: pricing.grossSubtotal,
        discount: pricing.totalDiscount,
        shippingFee: pricing.shippingFee,
        grandTotal: pricing.grandTotal
      },
      paymentMethod: session.paymentPreference === 'vpp'
        ? 'Value Payable Post (V.P.P. - Cash on Delivery)'
        : session.paymentPreference === 'bank-transfer'
        ? 'Direct Bank Transfer (NEFT/RTGS to JSS Mahavidyapeetha)'
        : 'Counter Collection at JSS Book House Counter, Mysuru',
      notes: orderNotes
    });

    if (!orderResult.success) {
      return { success: false, reason: orderResult.error };
    }

    // Convert inventory reservation from RESERVED -> SOLD
    if (session.reservationId) {
      inventoryService.confirmReservation(session.reservationId);
    }

    session.state = CHECKOUT_STATES.ORDER_BOOKED;
    session.orderId = orderResult.orderId;
    session.updatedAt = new Date().toISOString();
    this.saveSession(session);

    return {
      success: true,
      order: orderResult.order,
      orderId: orderResult.orderId,
      state: CHECKOUT_STATES.ORDER_BOOKED
    };
  },

  /**
   * Abort checkout session and release inventory hold
   */
  abortCheckout() {
    const session = this.getSession();
    if (session.reservationId) {
      inventoryService.releaseReservation(session.reservationId);
    }

    session.state = CHECKOUT_STATES.ABORTED;
    session.reservationId = null;
    session.updatedAt = new Date().toISOString();
    this.saveSession(session);

    return { success: true, state: CHECKOUT_STATES.ABORTED };
  },

  /**
   * Reset session back to initial CART
   */
  resetSession() {
    storage.remove(CHECKOUT_SESSION_KEY);
    return { success: true, state: CHECKOUT_STATES.CART };
  }
};

export default checkoutStateMachine;
