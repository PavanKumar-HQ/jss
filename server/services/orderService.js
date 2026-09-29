/**
 * Authoritative Server Order Domain Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Coordinates atomic checkout, transactional order creation,
 * state machine enforcement, and real-time operational broadcasting.
 */

import { db } from './db.js';
import { pricingService } from './pricingService.js';
import { inventoryService } from './inventoryService.js';
import { realtimeService } from './realtimeService.js';

export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUNDED: 'refunded'
};

const VALID_TRANSITIONS = {
  [ORDER_STATUSES.PENDING_PAYMENT]: [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.CONFIRMED]: [ORDER_STATUSES.PROCESSING, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PROCESSING]: [ORDER_STATUSES.PACKED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PACKED]: [ORDER_STATUSES.SHIPPED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.SHIPPED]: [ORDER_STATUSES.DELIVERED, ORDER_STATUSES.RETURNED],
  [ORDER_STATUSES.DELIVERED]: [ORDER_STATUSES.RETURNED],
  [ORDER_STATUSES.RETURNED]: [ORDER_STATUSES.REFUNDED],
  [ORDER_STATUSES.CANCELLED]: [],
  [ORDER_STATUSES.REFUNDED]: []
};

function generateOrderReference() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `JSS-2026-${rand}`;
}

export class OrderService {
  /**
   * Create an authoritative order in an atomic database transaction
   */
  createOrder({
    sessionId = null,
    customer,
    shippingAddress,
    items,
    couponCode = null,
    dispatchMethod = 'india-post-speed-post',
    paymentMethod = 'Online Payment (UPI / NetBanking)',
    paymentReference = null,
    notes = ''
  }) {
    if (!customer || !customer.fullName || !customer.phone) {
      throw new Error('Customer full name and telephone number are required.');
    }

    if (!shippingAddress || !shippingAddress.addressLine || !shippingAddress.pincode) {
      throw new Error('Complete shipping address and postal PIN code are required.');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Cannot create an order with an empty cart.');
    }

    const isCounterPickup = dispatchMethod === 'counter-pickup';

    // Transactionally coordinate: Cart validation -> Authoritative pricing -> Inventory decrement -> Order persistence
    return db.transaction((tx) => {
      // 1. Authoritative price recalculation (all client prices discarded)
      const calculation = pricingService.calculateCartTotals(items, couponCode, isCounterPickup);

      // 2. Validate and decrement inventory
      const nowIso = new Date().toISOString();
      const orderId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const orderRef = generateOrderReference();

      for (const item of calculation.items) {
        const inv = tx.queryOne('SELECT * FROM inventory WHERE edition_id = ?', item.editionId);
        if (!inv) {
          throw new Error(`Edition "${item.editionId}" does not exist in inventory.`);
        }

        // If a prior reservation existed for this session, confirm it; otherwise decrement available directly
        if (inv.available_stock < item.quantity) {
          throw new Error(`Insufficient stock for "${item.title}". Requested: ${item.quantity}, Available: ${inv.available_stock}.`);
        }

        const newAvailable = inv.available_stock - item.quantity;
        const newSold = inv.sold_stock + item.quantity;

        tx.run(`
          UPDATE inventory
          SET available_stock = ?, sold_stock = ?, updated_at = ?
          WHERE edition_id = ?
        `, newAvailable, newSold, nowIso, item.editionId);

        tx.run(`
          INSERT INTO inventory_ledger (id, edition_id, previous_stock, change_amount, new_stock, operation_type, reason, reference_id, actor, created_at)
          VALUES (?, ?, ?, ?, ?, 'SALE_CONFIRMED', 'Order Placed', ?, 'Customer Checkout', ?)
        `, `ledg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, item.editionId, inv.available_stock, -item.quantity, newAvailable, orderRef, nowIso);
      }

      // If coupon was applied, increment times_used
      if (calculation.appliedCoupon) {
        tx.run(`
          UPDATE coupons
          SET times_used = times_used + 1
          WHERE code = ?
        `, calculation.appliedCoupon.code);
      }

      // 3. Persist Order
      const initialStatus = paymentMethod.includes('V.P.P.') || paymentMethod.includes('Counter')
        ? ORDER_STATUSES.CONFIRMED
        : paymentReference
        ? ORDER_STATUSES.CONFIRMED
        : ORDER_STATUSES.PENDING_PAYMENT;

      const initialPaymentStatus = paymentReference ? 'completed' : 'pending';

      tx.run(`
        INSERT INTO orders (
          id, order_reference, customer_name, customer_email, customer_phone, organization,
          address_line, landmark, city, district, state, pincode,
          dispatch_method, status, payment_status, payment_method, payment_reference,
          subtotal, discount, shipping_fee, grand_total, gst_rate, notes,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '0%', ?, ?, ?)
      `,
        orderId, orderRef, customer.fullName.trim(), (customer.email || '').trim().toLowerCase(), customer.phone.trim(), (customer.organization || '').trim() || null,
        shippingAddress.addressLine.trim(), (shippingAddress.landmark || '').trim() || null, (shippingAddress.city || '').trim(), (shippingAddress.district || '').trim() || null, (shippingAddress.state || 'Karnataka').trim(), shippingAddress.pincode.trim(),
        dispatchMethod, initialStatus, initialPaymentStatus, paymentMethod, paymentReference,
        calculation.subtotal, calculation.discount, calculation.shippingFee, calculation.grandTotal, notes,
        nowIso, nowIso
      );

      // 4. Persist Order Items
      for (const item of calculation.items) {
        tx.run(`
          INSERT INTO order_items (
            id, order_id, book_id, edition_id, title, binding, isbn, price, quantity, total, hsn_code
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '4901')
        `, `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, orderId, item.bookId, item.editionId, item.title, item.binding, item.isbn, item.price, item.quantity, item.lineTotal);
      }

      // 5. Persist Initial Order Event
      tx.run(`
        INSERT INTO order_events (id, order_id, event_type, description, actor, created_at)
        VALUES (?, ?, 'ORDER_CREATED', ?, 'System', ?)
      `, `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, orderId, `Order ${orderRef} placed via ${paymentMethod}`, nowIso);

      // Clean up session reservation if present
      if (sessionId) {
        tx.run(`UPDATE stock_reservations SET status = 'CONFIRMED' WHERE session_id = ?`, sessionId);
      }

      const createdOrder = {
        id: orderId,
        orderReference: orderRef,
        customer,
        shippingAddress,
        dispatchMethod,
        status: initialStatus,
        paymentStatus: initialPaymentStatus,
        totals: {
          subtotal: calculation.subtotal,
          discount: calculation.discount,
          shippingFee: calculation.shippingFee,
          grandTotal: calculation.grandTotal
        },
        items: calculation.items,
        createdAt: nowIso
      };

      // Realtime event
      realtimeService.broadcast('ORDER_CREATED', {
        orderId,
        orderReference: orderRef,
        grandTotal: calculation.grandTotal,
        itemsCount: calculation.itemsCount,
        customerName: customer.fullName
      });

      return createdOrder;
    });
  }

  /**
   * Get single order by reference or ID
   */
  getOrder(referenceOrId) {
    const order = db.queryOne(`
      SELECT * FROM orders
      WHERE order_reference = ? OR id = ?
    `, referenceOrId, referenceOrId);

    if (!order) return null;

    const items = db.queryAll(`
      SELECT oi.*, b.cover_image, b.slug
      FROM order_items oi
      JOIN books b ON oi.book_id = b.id
      WHERE oi.order_id = ?
    `, order.id);

    const events = db.queryAll(`
      SELECT * FROM order_events
      WHERE order_id = ?
      ORDER BY created_at ASC
    `, order.id);

    return {
      ...order,
      items,
      events
    };
  }

  /**
   * Get all orders with optional filtering
   */
  getAllOrders({ status = null, search = null, limit = 50, offset = 0 } = {}) {
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ' AND (order_reference LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = db.queryAll(sql, ...params);
    return rows.map((order) => {
      const items = db.queryAll('SELECT * FROM order_items WHERE order_id = ?', order.id);
      return { ...order, items };
    });
  }

  /**
   * Update order status with state machine enforcement and inventory reconciliation on cancellation
   */
  updateOrderStatus(orderId, newStatus, { trackingNumber = null, reason = 'Admin status update', actor = 'Administrator' } = {}) {
    return db.transaction((tx) => {
      const order = tx.queryOne('SELECT * FROM orders WHERE id = ? OR order_reference = ?', orderId, orderId);
      if (!order) {
        throw new Error(`Order "${orderId}" not found.`);
      }

      const allowedTransitions = VALID_TRANSITIONS[order.status] || [];
      if (!allowedTransitions.includes(newStatus) && order.status !== newStatus) {
        throw new Error(`Illegal order state transition from "${order.status}" to "${newStatus}".`);
      }

      const nowIso = new Date().toISOString();

      // If cancelling, restore inventory to available stock!
      if (newStatus === ORDER_STATUSES.CANCELLED && order.status !== ORDER_STATUSES.CANCELLED) {
        const items = tx.queryAll('SELECT * FROM order_items WHERE order_id = ?', order.id);
        for (const item of items) {
          const inv = tx.queryOne('SELECT * FROM inventory WHERE edition_id = ?', item.edition_id);
          if (inv) {
            const newAvailable = inv.available_stock + item.quantity;
            const newSold = Math.max(0, inv.sold_stock - item.quantity);

            tx.run(`
              UPDATE inventory
              SET available_stock = ?, sold_stock = ?, updated_at = ?
              WHERE edition_id = ?
            `, newAvailable, newSold, nowIso, item.edition_id);

            tx.run(`
              INSERT INTO inventory_ledger (id, edition_id, previous_stock, change_amount, new_stock, operation_type, reason, reference_id, actor, created_at)
              VALUES (?, ?, ?, ?, ?, 'RETURN', ?, ?, ?, ?)
            `, `ledg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, item.edition_id, inv.available_stock, item.quantity, newAvailable, `Order ${order.order_reference} Cancelled: ${reason}`, order.order_reference, actor, nowIso);

            realtimeService.broadcast('INVENTORY_UPDATED', {
              editionId: item.edition_id,
              bookId: inv.book_id,
              availableStock: newAvailable,
              changeAmount: item.quantity,
              reason: `Order Cancellation: ${reason}`
            });
          }
        }
      }

      // Update order record
      const finalTracking = trackingNumber || order.tracking_number;
      tx.run(`
        UPDATE orders
        SET status = ?, tracking_number = ?, updated_at = ?
        WHERE id = ?
      `, newStatus, finalTracking, nowIso, order.id);

      // Record timeline event
      tx.run(`
        INSERT INTO order_events (id, order_id, event_type, description, actor, created_at)
        VALUES (?, ?, 'STATUS_CHANGE', ?, ?, ?)
      `, `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, order.id, `Status updated to ${newStatus}. ${reason}`, actor, nowIso);

      realtimeService.broadcast('ORDER_STATUS_CHANGED', {
        orderId: order.id,
        orderReference: order.order_reference,
        status: newStatus,
        trackingNumber: finalTracking
      });

      return {
        success: true,
        orderId: order.id,
        orderReference: order.order_reference,
        status: newStatus,
        trackingNumber: finalTracking
      };
    });
  }
}

export const orderService = new OrderService();
export default orderService;
