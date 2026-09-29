/**
 * Inventory Domain Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Responsibilities:
 * - Authoritative lifecycle state management:
 *   AVAILABLE → RESERVED → SOLD → RETURNED → DAMAGED → RESTOCKED
 * - Multi-edition stock counters (Paperback, Hardbound, Deluxe)
 * - Temporary reservation holds with TTL (prevents overselling scarce physical titles during checkout)
 * - Low-stock alerts for retail counter and scholar inquiries
 * - Corrupted storage self-healing
 * - Pub/Sub reactivity for live inventory updates
 */

import storage from '../utils/storage.js';
import ids from '../utils/ids.js';
import { catalogueService } from './catalogueService.js';

const INVENTORY_STORAGE_KEY = 'jss_granthamale_inventory';
const RESERVATIONS_STORAGE_KEY = 'jss_granthamale_reservations';
export const DEFAULT_RESERVATION_TTL_MINUTES = 15;
export const LOW_STOCK_THRESHOLD = 5;

export const INVENTORY_STATES = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  RETURNED: 'RETURNED',
  DAMAGED: 'DAMAGED',
  RESTOCKED: 'RESTOCKED'
};

const listeners = new Set();

function notifyListeners(inventory) {
  listeners.forEach((listener) => {
    try {
      listener(inventory);
    } catch (err) {
      console.error('[inventoryService] Listener error:', err);
    }
  });
}

/**
 * Initializes baseline inventory from catalogue records if storage is empty
 */
function seedInitialInventory() {
  const inventory = {};
  const allBooks = catalogueService.getBooksSync();

  allBooks.forEach((book) => {
    const editions = catalogueService.getEditionsForBook(book.id);
    editions.forEach((edition) => {
      const key = ids.getCartItemKey(book.id, edition.binding);
      // Rare or deluxe editions have smaller print runs at the Mysuru counter
      const isDeluxe = String(edition.binding).toLowerCase().includes('deluxe');
      const isHardbound = String(edition.binding).toLowerCase().includes('hardbound');
      const initialTotal = isDeluxe ? 8 : isHardbound ? 25 : 60;

      inventory[key] = {
        key,
        bookId: book.id,
        binding: edition.binding,
        isbn: edition.isbn,
        title: book.title,
        totalStock: initialTotal,
        reserved: 0,
        sold: 0,
        damaged: 0,
        available: initialTotal,
        isLimitedEdition: isDeluxe,
        lowStockThreshold: isDeluxe ? 3 : LOW_STOCK_THRESHOLD,
        updatedAt: new Date().toISOString()
      };
    });
  });

  storage.set(INVENTORY_STORAGE_KEY, inventory);
  return inventory;
}

/**
 * Loads inventory with corruption recovery
 */
function loadInventory() {
  try {
    const raw = storage.get(INVENTORY_STORAGE_KEY, null);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return seedInitialInventory();
    }
    return raw;
  } catch (err) {
    console.error('[inventoryService] Corrupted inventory storage. Healing:', err);
    return seedInitialInventory();
  }
}

/**
 * Saves inventory to storage and notifies subscribers
 */
function saveInventory(inventory) {
  storage.set(INVENTORY_STORAGE_KEY, inventory);
  notifyListeners(inventory);
}

/**
 * Loads active checkout reservation holds
 */
function loadReservations() {
  try {
    const raw = storage.get(RESERVATIONS_STORAGE_KEY, []);
    return Array.isArray(raw) ? raw : [];
  } catch (err) {
    console.error('[inventoryService] Corrupted reservations storage. Resetting:', err);
    storage.set(RESERVATIONS_STORAGE_KEY, []);
    return [];
  }
}

function saveReservations(reservations) {
  storage.set(RESERVATIONS_STORAGE_KEY, reservations);
}

export const inventoryService = {
  /**
   * Subscribe to inventory mutations
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  /**
   * Get complete inventory registry
   */
  getInventory() {
    this.cleanupExpiredReservations();
    return loadInventory();
  },

  /**
   * Get stock record for a specific book edition
   * @param {string} bookId
   * @param {string} [variant='Paperback']
   */
  getStock(bookId, variant = 'Paperback') {
    this.cleanupExpiredReservations();
    const inventory = loadInventory();
    const key = ids.getCartItemKey(bookId, variant);

    if (inventory[key]) {
      const rec = inventory[key];
      const available = Math.max(0, rec.totalStock - rec.reserved - rec.sold - rec.damaged);
      return {
        ...rec,
        available,
        inStock: available > 0,
        isLowStock: available > 0 && available <= rec.lowStockThreshold
      };
    }

    // Fallback if record does not yet exist
    return {
      key,
      bookId,
      binding: variant,
      totalStock: 30,
      reserved: 0,
      sold: 0,
      damaged: 0,
      available: 30,
      inStock: true,
      isLowStock: false
    };
  },

  /**
   * Atomically reserve stock for checkout session
   * @param {Array<{ id: string, format?: string, binding?: string, quantity: number }>} items
   * @param {number} [ttlMinutes=DEFAULT_RESERVATION_TTL_MINUTES]
   * @returns {{ success: boolean, reservationId?: string, expiresAt?: string, failedItems?: Array }}
   */
  reserveStock(items, ttlMinutes = DEFAULT_RESERVATION_TTL_MINUTES) {
    if (!Array.isArray(items) || items.length === 0) {
      return { success: false, reason: 'Empty item list' };
    }

    this.cleanupExpiredReservations();
    const inventory = loadInventory();
    const reservations = loadReservations();
    const failedItems = [];

    // Step 1: Pre-flight check availability across all requested items
    for (const item of items) {
      const variant = item.format || item.binding || 'Paperback';
      const key = ids.getCartItemKey(item.id, variant);
      const rec = inventory[key] || {
        totalStock: 30,
        reserved: 0,
        sold: 0,
        damaged: 0
      };

      const available = rec.totalStock - rec.reserved - rec.sold - rec.damaged;
      const requestedQty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (available < requestedQty) {
        failedItems.push({
          bookId: item.id,
          variant,
          requested: requestedQty,
          available: Math.max(0, available)
        });
      }
    }

    if (failedItems.length > 0) {
      return {
        success: false,
        reason: 'Insufficient stock for requested publications',
        failedItems
      };
    }

    // Step 2: Atomic reservation lock
    const reservationId = `RES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
    const reservedItems = [];

    for (const item of items) {
      const variant = item.format || item.binding || 'Paperback';
      const key = ids.getCartItemKey(item.id, variant);
      const requestedQty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (!inventory[key]) {
        inventory[key] = {
          key,
          bookId: item.id,
          binding: variant,
          totalStock: 30,
          reserved: 0,
          sold: 0,
          damaged: 0,
          available: 30,
          lowStockThreshold: LOW_STOCK_THRESHOLD,
          updatedAt: new Date().toISOString()
        };
      }

      inventory[key].reserved += requestedQty;
      inventory[key].available = Math.max(0, inventory[key].totalStock - inventory[key].reserved - inventory[key].sold - inventory[key].damaged);
      inventory[key].updatedAt = new Date().toISOString();

      reservedItems.push({ key, bookId: item.id, variant, quantity: requestedQty });
    }

    reservations.push({
      reservationId,
      createdAt: new Date().toISOString(),
      expiresAt,
      items: reservedItems,
      status: INVENTORY_STATES.RESERVED
    });

    saveInventory(inventory);
    saveReservations(reservations);

    return {
      success: true,
      reservationId,
      expiresAt,
      ttlMinutes,
      items: reservedItems
    };
  },

  /**
   * Confirm reservation and convert reserved stock to SOLD state upon order payment
   * @param {string} reservationId
   */
  confirmReservation(reservationId) {
    if (!reservationId) return { success: false, reason: 'Invalid reservation ID' };

    const reservations = loadReservations();
    const resIdx = reservations.findIndex((r) => r.reservationId === reservationId);

    if (resIdx === -1) {
      return { success: false, reason: 'Reservation not found or expired' };
    }

    const reservation = reservations[resIdx];
    const inventory = loadInventory();

    reservation.items.forEach(({ key, quantity }) => {
      if (inventory[key]) {
        inventory[key].reserved = Math.max(0, inventory[key].reserved - quantity);
        inventory[key].sold = (inventory[key].sold || 0) + quantity;
        inventory[key].available = Math.max(0, inventory[key].totalStock - inventory[key].reserved - inventory[key].sold - inventory[key].damaged);
        inventory[key].updatedAt = new Date().toISOString();
      }
    });

    reservation.status = INVENTORY_STATES.SOLD;
    reservations.splice(resIdx, 1); // remove active reservation hold

    saveInventory(inventory);
    saveReservations(reservations);

    return { success: true, reservationId, status: INVENTORY_STATES.SOLD };
  },

  /**
   * Release reservation hold (e.g. cancelled checkout or user navigated away)
   * @param {string} reservationId
   */
  releaseReservation(reservationId) {
    if (!reservationId) return { success: false };

    const reservations = loadReservations();
    const resIdx = reservations.findIndex((r) => r.reservationId === reservationId);

    if (resIdx === -1) return { success: false, reason: 'Reservation not found' };

    const reservation = reservations[resIdx];
    const inventory = loadInventory();

    reservation.items.forEach(({ key, quantity }) => {
      if (inventory[key]) {
        inventory[key].reserved = Math.max(0, inventory[key].reserved - quantity);
        inventory[key].available = Math.max(0, inventory[key].totalStock - inventory[key].reserved - inventory[key].sold - inventory[key].damaged);
        inventory[key].updatedAt = new Date().toISOString();
      }
    });

    reservations.splice(resIdx, 1);
    saveInventory(inventory);
    saveReservations(reservations);

    return { success: true, released: reservationId };
  },

  /**
   * Release all expired reservations whose TTL has elapsed
   */
  cleanupExpiredReservations() {
    const reservations = loadReservations();
    if (reservations.length === 0) return { releasedCount: 0 };

    const now = Date.now();
    const activeReservations = [];
    let releasedCount = 0;
    const inventory = loadInventory();
    let hasModifications = false;

    reservations.forEach((reservation) => {
      const expires = new Date(reservation.expiresAt).getTime();
      if (expires <= now) {
        // Expired hold: release reserved count back to available pool
        reservation.items.forEach(({ key, quantity }) => {
          if (inventory[key]) {
            inventory[key].reserved = Math.max(0, inventory[key].reserved - quantity);
            inventory[key].available = Math.max(0, inventory[key].totalStock - inventory[key].reserved - inventory[key].sold - inventory[key].damaged);
            inventory[key].updatedAt = new Date().toISOString();
            hasModifications = true;
          }
        });
        releasedCount++;
      } else {
        activeReservations.push(reservation);
      }
    });

    if (hasModifications) {
      saveInventory(inventory);
    }
    if (releasedCount > 0) {
      saveReservations(activeReservations);
    }

    return { releasedCount };
  },

  /**
   * Restock units from publisher printing press or return consignment
   * @param {string} bookId
   * @param {string} variant
   * @param {number} quantity
   * @param {string} [source='Press Print Run']
   */
  restock(bookId, variant = 'Paperback', quantity = 10, source = 'Press Print Run') {
    const inventory = loadInventory();
    const key = ids.getCartItemKey(bookId, variant);
    const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);

    if (!inventory[key]) {
      inventory[key] = {
        key,
        bookId,
        binding: variant,
        totalStock: cleanQty,
        reserved: 0,
        sold: 0,
        damaged: 0,
        available: cleanQty,
        lowStockThreshold: LOW_STOCK_THRESHOLD,
        updatedAt: new Date().toISOString()
      };
    } else {
      inventory[key].totalStock += cleanQty;
      inventory[key].available = Math.max(0, inventory[key].totalStock - inventory[key].reserved - inventory[key].sold - inventory[key].damaged);
      inventory[key].updatedAt = new Date().toISOString();
    }

    saveInventory(inventory);
    return {
      success: true,
      key,
      added: cleanQty,
      source,
      newTotal: inventory[key].totalStock,
      newAvailable: inventory[key].available
    };
  },

  /**
   * Record damaged units (water damaged, torn binding) removed from circulation
   */
  recordDamaged(bookId, variant = 'Paperback', quantity = 1, reason = 'Moisture during transit') {
    const inventory = loadInventory();
    const key = ids.getCartItemKey(bookId, variant);
    const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);

    if (!inventory[key]) return { success: false, reason: 'Record not found' };

    inventory[key].damaged = (inventory[key].damaged || 0) + cleanQty;
    inventory[key].available = Math.max(0, inventory[key].totalStock - inventory[key].reserved - inventory[key].sold - inventory[key].damaged);
    inventory[key].updatedAt = new Date().toISOString();

    saveInventory(inventory);
    return {
      success: true,
      key,
      damagedQty: cleanQty,
      reason,
      remainingAvailable: inventory[key].available
    };
  },

  /**
   * Reset inventory back to fresh catalogue baseline
   */
  resetToBaseline() {
    storage.set(RESERVATIONS_STORAGE_KEY, []);
    return seedInitialInventory();
  }
};

export default inventoryService;
