/**
 * Authoritative Server Inventory Domain Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Implements atomic stock mutations, reservation holds with TTL,
 * immutable ledger tracking, and real-time event broadcasting.
 */

import { db } from './db.js';
import { realtimeService } from './realtimeService.js';

export const RESERVATION_TTL_MINUTES = 15;

export class InventoryService {
  constructor() {
    this.startCleanupTimer();
  }

  /**
   * Get stock for all catalogued editions
   */
  getAllStock() {
    return db.queryAll(`
      SELECT
        i.edition_id,
        i.book_id,
        b.title,
        b.title_kannada,
        e.binding,
        e.isbn,
        e.price,
        i.available_stock,
        i.reserved_stock,
        i.sold_stock,
        i.damaged_stock,
        i.low_stock_threshold,
        (i.available_stock <= i.low_stock_threshold) as is_low_stock,
        i.updated_at
      FROM inventory i
      JOIN editions e ON i.edition_id = e.id
      JOIN books b ON i.book_id = b.id
      ORDER BY b.title ASC, e.binding ASC
    `);
  }

  /**
   * Get single stock record
   */
  getStock(editionId) {
    return db.queryOne(`
      SELECT
        i.*,
        e.binding,
        e.price,
        b.title
      FROM inventory i
      JOIN editions e ON i.edition_id = e.id
      JOIN books b ON i.book_id = b.id
      WHERE i.edition_id = ?
    `, editionId);
  }

  /**
   * Reserve stock during checkout initiation (Atomic Transaction)
   */
  reserveStock(sessionId, items) {
    if (!sessionId || !Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid reservation parameters.');
    }

    return db.transaction((tx) => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MINUTES * 60 * 1000).toISOString();
      const nowIso = now.toISOString();

      const reservationIds = [];

      for (const item of items) {
        const editionId = item.editionId || item.id;
        const requestedQty = parseInt(item.quantity, 10);
        if (isNaN(requestedQty) || requestedQty <= 0) {
          throw new Error(`Invalid requested quantity for edition ${editionId}.`);
        }

        // Query authoritative available stock with row-level transaction isolation
        const inv = tx.queryOne('SELECT * FROM inventory WHERE edition_id = ?', editionId);
        if (!inv) {
          throw new Error(`Edition "${editionId}" does not exist in inventory.`);
        }

        if (inv.available_stock < requestedQty) {
          throw new Error(`Insufficient physical stock for "${item.title || editionId}". Requested: ${requestedQty}, Available: ${inv.available_stock}.`);
        }

        // Decrement available, increment reserved
        const newAvailable = inv.available_stock - requestedQty;
        const newReserved = inv.reserved_stock + requestedQty;

        tx.run(`
          UPDATE inventory
          SET available_stock = ?, reserved_stock = ?, updated_at = ?
          WHERE edition_id = ?
        `, newAvailable, newReserved, nowIso, editionId);

        // Record reservation
        const resId = `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        tx.run(`
          INSERT INTO stock_reservations (id, session_id, edition_id, quantity, status, reserved_at, expires_at)
          VALUES (?, ?, ?, ?, 'ACTIVE', ?, ?)
        `, resId, sessionId, editionId, requestedQty, nowIso, expiresAt);

        // Log to ledger
        tx.run(`
          INSERT INTO inventory_ledger (id, edition_id, previous_stock, change_amount, new_stock, operation_type, reason, reference_id, actor, created_at)
          VALUES (?, ?, ?, ?, ?, 'RESERVE', 'Checkout Hold', ?, 'Checkout System', ?)
        `, `ledg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, editionId, inv.available_stock, -requestedQty, newAvailable, sessionId, nowIso);

        reservationIds.push(resId);

        // Emit real-time stock update
        realtimeService.broadcast('INVENTORY_UPDATED', {
          editionId,
          bookId: inv.book_id,
          availableStock: newAvailable,
          reservedStock: newReserved,
          changeAmount: -requestedQty,
          reason: 'Checkout Reservation Hold'
        });
      }

      return {
        success: true,
        sessionId,
        reservationIds,
        expiresAt
      };
    });
  }

  /**
   * Confirm reservation and convert reserved units to permanently sold units upon payment confirmation
   */
  confirmReservation(sessionId, orderId) {
    return db.transaction((tx) => {
      const reservations = tx.queryAll(`
        SELECT * FROM stock_reservations
        WHERE session_id = ? AND status = 'ACTIVE'
      `, sessionId);

      const nowIso = new Date().toISOString();

      for (const res of reservations) {
        const inv = tx.queryOne('SELECT * FROM inventory WHERE edition_id = ?', res.edition_id);
        if (inv) {
          const newReserved = Math.max(0, inv.reserved_stock - res.quantity);
          const newSold = inv.sold_stock + res.quantity;

          tx.run(`
            UPDATE inventory
            SET reserved_stock = ?, sold_stock = ?, updated_at = ?
            WHERE edition_id = ?
          `, newReserved, newSold, nowIso, res.edition_id);

          tx.run(`
            UPDATE stock_reservations
            SET status = 'CONFIRMED'
            WHERE id = ?
          `, res.id);

          tx.run(`
            INSERT INTO inventory_ledger (id, edition_id, previous_stock, change_amount, new_stock, operation_type, reason, reference_id, actor, created_at)
            VALUES (?, ?, ?, ?, ?, 'SALE_CONFIRMED', 'Order Confirmed', ?, 'Order System', ?)
          `, `ledg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, res.edition_id, inv.available_stock, 0, inv.available_stock, orderId, nowIso);
        }
      }

      return { success: true, confirmedCount: reservations.length };
    });
  }

  /**
   * Release reservation (manually or upon payment failure)
   */
  releaseReservation(sessionId, reason = 'Checkout Aborted') {
    return db.transaction((tx) => {
      const reservations = tx.queryAll(`
        SELECT * FROM stock_reservations
        WHERE session_id = ? AND status = 'ACTIVE'
      `, sessionId);

      const nowIso = new Date().toISOString();

      for (const res of reservations) {
        const inv = tx.queryOne('SELECT * FROM inventory WHERE edition_id = ?', res.edition_id);
        if (inv) {
          const newAvailable = inv.available_stock + res.quantity;
          const newReserved = Math.max(0, inv.reserved_stock - res.quantity);

          tx.run(`
            UPDATE inventory
            SET available_stock = ?, reserved_stock = ?, updated_at = ?
            WHERE edition_id = ?
          `, newAvailable, newReserved, nowIso, res.edition_id);

          tx.run(`
            UPDATE stock_reservations
            SET status = 'RELEASED'
            WHERE id = ?
          `, res.id);

          tx.run(`
            INSERT INTO inventory_ledger (id, edition_id, previous_stock, change_amount, new_stock, operation_type, reason, reference_id, actor, created_at)
            VALUES (?, ?, ?, ?, ?, 'RELEASE_RESERVATION', ?, ?, 'System', ?)
          `, `ledg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, res.edition_id, inv.available_stock, res.quantity, newAvailable, reason, sessionId, nowIso);

          realtimeService.broadcast('INVENTORY_UPDATED', {
            editionId: res.edition_id,
            bookId: inv.book_id,
            availableStock: newAvailable,
            reservedStock: newReserved,
            changeAmount: res.quantity,
            reason
          });
        }
      }

      return { success: true, releasedCount: reservations.length };
    });
  }

  /**
   * Clean up expired reservations automatically
   */
  releaseExpiredReservations() {
    const nowIso = new Date().toISOString();
    const expiredSessions = db.queryAll(`
      SELECT DISTINCT session_id FROM stock_reservations
      WHERE status = 'ACTIVE' AND expires_at < ?
    `, nowIso);

    for (const row of expiredSessions) {
      this.releaseReservation(row.session_id, 'Reservation TTL Expired (15m elapsed)');
    }
  }

  /**
   * Admin manual stock adjustment
   */
  adjustStock(editionId, amount, reason, actor = 'Administrator') {
    const delta = parseInt(amount, 10);
    if (isNaN(delta) || delta === 0) {
      throw new Error('Adjustment amount must be a non-zero integer.');
    }

    return db.transaction((tx) => {
      const inv = tx.queryOne('SELECT * FROM inventory WHERE edition_id = ?', editionId);
      if (!inv) {
        throw new Error(`Edition "${editionId}" not found.`);
      }

      const newAvailable = inv.available_stock + delta;
      if (newAvailable < 0) {
        throw new Error(`Cannot reduce stock below zero. Current available: ${inv.available_stock}, Requested reduction: ${Math.abs(delta)}.`);
      }

      const nowIso = new Date().toISOString();
      const opType = delta > 0 ? 'RESTOCK' : 'DAMAGE';

      tx.run(`
        UPDATE inventory
        SET available_stock = ?, updated_at = ?
        WHERE edition_id = ?
      `, newAvailable, nowIso, editionId);

      tx.run(`
        INSERT INTO inventory_ledger (id, edition_id, previous_stock, change_amount, new_stock, operation_type, reason, reference_id, actor, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, null, ?, ?)
      `, `ledg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, editionId, inv.available_stock, delta, newAvailable, opType, reason, actor, nowIso);

      realtimeService.broadcast('INVENTORY_UPDATED', {
        editionId,
        bookId: inv.book_id,
        availableStock: newAvailable,
        reservedStock: inv.reserved_stock,
        changeAmount: delta,
        reason
      });

      return {
        success: true,
        editionId,
        previousStock: inv.available_stock,
        newStock: newAvailable
      };
    });
  }

  startCleanupTimer() {
    const timer = setInterval(() => {
      try {
        this.releaseExpiredReservations();
      } catch (err) {
        console.error('[inventoryService] Error running reservation cleanup:', err);
      }
    }, 60000); // Check every minute
    timer.unref?.();
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;
