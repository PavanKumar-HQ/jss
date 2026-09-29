/**
 * Order Domain Service
 * Manages order creation, internal order ID assignment, local order history,
 * and proforma invoice preparation.
 *
 * NOTE: As per design constraints, actual postal tracking numbers (e.g. India Post EM...IN)
 * are NOT generated here. They are authoritative and only assigned once a physical parcel
 * is booked at the post office by the dispatch counter.
 */

import storage from '../utils/storage.js';
import ids from '../utils/ids.js';

const ORDERS_STORAGE_KEY = 'jss_granthamale_orders';

function loadOrders() {
  const orders = storage.get(ORDERS_STORAGE_KEY, []);
  return Array.isArray(orders) ? orders : [];
}

function saveOrders(orders) {
  storage.set(ORDERS_STORAGE_KEY, orders);
}

export const orderService = {
  /**
   * Assemble and persist a new customer order object.
   * @param {Object} orderPayload
   */
  createOrder({
    customer,
    shippingAddress,
    items,
    totals,
    paymentMethod = 'Online Payment (UPI / NetBanking)',
    notes = '',
    endowment = null
  }) {
    if (!items || !items.length) {
      return { success: false, error: 'Cannot create an order with empty cart.' };
    }

    if (!customer || !customer.fullName || !customer.phone) {
      return { success: false, error: 'Customer contact details are required.' };
    }

    if (!shippingAddress || !shippingAddress.addressLine || !shippingAddress.pincode) {
      return { success: false, error: 'Complete shipping address and PIN code are required.' };
    }

    const orderId = ids.generateOrderId();
    const createdAt = new Date().toISOString();

    const orderRecord = {
      orderId,
      status: 'confirmed',
      createdAt,
      customer: {
        fullName: customer.fullName.trim(),
        email: (customer.email || '').trim().toLowerCase(),
        phone: customer.phone.trim(),
        organization: customer.organization ? customer.organization.trim() : null
      },
      shippingAddress: {
        addressLine: shippingAddress.addressLine.trim(),
        landmark: (shippingAddress.landmark || '').trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim()
      },
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug || String(item.id),
        title: item.title,
        titleKannada: item.titleKannada || '',
        author: item.author || 'JSS Publications',
        category: item.category || 'Canonical Works',
        format: item.format || 'Paperback',
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        hsnCode: '4901' // Printed Books (exempt from GST under Indian Law)
      })),
      totals: {
        itemsCount: totals.itemsCount,
        subtotal: totals.subtotal,
        discount: totals.discount || 0,
        shippingFee: totals.shippingFee || 0,
        grandTotal: totals.grandTotal,
        gstRate: '0%',
        gstAmount: 0,
        currency: 'INR'
      },
      payment: {
        method: paymentMethod,
        status: 'completed',
        timestamp: createdAt
      },
      dispatch: {
        status: 'pending_dispatch',
        origin: 'JSS Book House Counter, Mysuru',
        carrier: 'India Post (Speed Post / Regd. Parcel)',
        trackingNumber: null, // Assigned only after physical parcel booking at India Post
        dispatchMessage: 'Awaiting packing and consignment booking at JSS Book House dispatch desk. Consignment tracking number will be issued on booking.'
      },
      notes: notes ? notes.trim() : '',
      endowment: endowment || null
    };

    const existingOrders = loadOrders();
    existingOrders.unshift(orderRecord);
    saveOrders(existingOrders);

    return {
      success: true,
      order: orderRecord,
      orderId: orderRecord.orderId
    };
  },

  /**
   * Look up an order by its internal reference ID
   */
  getOrderById(orderId) {
    if (!orderId) return null;
    const cleanId = String(orderId).trim().toUpperCase();
    return loadOrders().find((o) => o.orderId.toUpperCase() === cleanId) || null;
  },

  /**
   * Return recent orders
   */
  getRecentOrders(limit = 10) {
    return loadOrders().slice(0, limit);
  },

  /**
   * Prepare structured Proforma Invoice data for printable A4 view or PDF download
   */
  prepareInvoiceData(order) {
    if (!order) return null;

    return {
      invoiceNumber: `INV-${order.orderId}`,
      invoiceDate: new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      orderReference: order.orderId,
      institution: {
        name: 'JAGADGURU SRI SHIVARATHREESHWARA GRANTHAMALE',
        parent: 'JSS Mahavidyapeetha, Mysuru',
        address: 'JSS Book House, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004',
        phone: '0821-2548212',
        email: 'publications@jssonline.org',
        taxStatus: 'HSN 4901 Exempt (0% GST on Printed Publications)'
      },
      billTo: {
        name: order.customer.fullName,
        phone: order.customer.phone,
        email: order.customer.email,
        address: `${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
      },
      lineItems: order.items,
      summary: order.totals,
      paymentMethod: order.payment.method,
      dispatchNote: order.dispatch.dispatchMessage
    };
  }
};

export default orderService;
