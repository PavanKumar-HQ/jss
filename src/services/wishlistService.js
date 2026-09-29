/**
 * Wishlist / Study Reading List Domain Service (ನನ್ನ ಆಯ್ಕೆಯ ಗ್ರಂಥಗಳು)
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Responsibilities:
 * - Curate personal study selection of sacred Vachana editions and philosophy treatises
 * - Idempotent bookmarking with multi-binding support (Paperback, Hardbound, Deluxe)
 * - Authoritative catalogue metadata synchronization (Never Trust Frontend Prices)
 * - Safe storage self-healing from corrupted states
 * - Individual and batch migration to Cart Domain Service
 * - Reactive state subscriptions for UI components (Navbar badge, BookDetail, WishlistDrawer)
 */

import storage from '../utils/storage.js';
import ids from '../utils/ids.js';
import { catalogueService } from './catalogueService.js';
import { cartService } from './cartService.js';

const WISHLIST_STORAGE_KEY = 'jss_granthamale_wishlist';
const listeners = new Set();

function notifyListeners(wishlist) {
  listeners.forEach((listener) => {
    try {
      listener(wishlist);
    } catch (err) {
      console.error('[wishlistService] Subscriber listener error:', err);
    }
  });
}

/**
 * Validate that an entry conforms to a valid WishlistItem schema
 */
function isValidWishlistItem(item) {
  return (
    item &&
    typeof item === 'object' &&
    item.id !== undefined &&
    item.id !== null &&
    typeof item.title === 'string' &&
    item.title.trim().length > 0
  );
}

/**
 * Load wishlist from storage with corruption recovery and schema sanitization
 */
function loadWishlist() {
  try {
    const raw = storage.get(WISHLIST_STORAGE_KEY, []);
    if (!Array.isArray(raw)) {
      console.warn('[wishlistService] Corrupted wishlist storage detected (non-array). Resetting to empty list.');
      storage.set(WISHLIST_STORAGE_KEY, []);
      return [];
    }

    const validItems = raw.filter(isValidWishlistItem);
    if (validItems.length !== raw.length) {
      console.warn(`[wishlistService] Purged ${raw.length - validItems.length} corrupted wishlist entries.`);
      storage.set(WISHLIST_STORAGE_KEY, validItems);
    }
    return validItems;
  } catch (err) {
    console.error('[wishlistService] Error reading wishlist storage. Healing storage:', err);
    storage.set(WISHLIST_STORAGE_KEY, []);
    return [];
  }
}

/**
 * Save wishlist to persistent storage and notify all active UI listeners
 */
function saveWishlist(wishlist) {
  const sanitized = Array.isArray(wishlist) ? wishlist.filter(isValidWishlistItem) : [];
  storage.set(WISHLIST_STORAGE_KEY, sanitized);
  notifyListeners(sanitized);
}

export const wishlistService = {
  /**
   * Subscribe to reactive wishlist mutations
   * @param {Function} callback (wishlist: WishlistItem[]) => void
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  /**
   * Return current list of study bookmarks
   * @returns {WishlistItem[]}
   */
  getWishlist() {
    return loadWishlist();
  },

  /**
   * Check if a publication or specific edition is bookmarked
   * @param {string|number} productId
   * @param {string} [variant=null] Optional edition binding
   * @returns {boolean}
   */
  isInWishlist(productId, variant = null) {
    if (!productId) return false;
    const list = loadWishlist();
    const pidStr = String(productId);

    if (variant) {
      const cleanVar = String(variant).trim().toLowerCase();
      return list.some(
        (item) => String(item.id) === pidStr && String(item.binding || 'Paperback').trim().toLowerCase() === cleanVar
      );
    }

    return list.some((item) => String(item.id) === pidStr || (item.slug && item.slug === pidStr));
  },

  /**
   * Add a publication edition to the study reading list with authoritative catalogue data
   * @param {Object} book - Publication or identifier
   * @param {string} [variant='Paperback'] - 'Paperback' | 'Hardbound' | 'Deluxe Hardbound'
   * @returns {{ success: boolean, wishlist: WishlistItem[], alreadyExists: boolean }}
   */
  addItem(book, variant = 'Paperback') {
    if (!book || (!book.id && !book.slug)) {
      return { success: false, reason: 'Invalid publication data' };
    }

    // 1. Authoritative resolution from catalogueService
    const canonicalBook =
      catalogueService.getBookById(book.id) ||
      catalogueService.getBookBySlug(book.slug || book.id) ||
      book;

    const cleanVariant = variant || book.selectedVariant || book.format || book.binding || 'Paperback';
    const edition =
      catalogueService.getEdition(canonicalBook.id, cleanVariant) ||
      catalogueService.getDefaultEdition(canonicalBook);

    const list = loadWishlist();
    const itemKey = ids.getCartItemKey(canonicalBook.id, edition.binding);

    // Prevent duplicate bookmarking of the exact same book & edition
    const existingIndex = list.findIndex(
      (item) =>
        (item.key && item.key === itemKey) ||
        (String(item.id) === String(canonicalBook.id) &&
          String(item.binding || 'Paperback').trim().toLowerCase() === String(edition.binding).trim().toLowerCase())
    );

    if (existingIndex > -1) {
      return { success: true, wishlist: list, alreadyExists: true };
    }

    const itemToAdd = {
      key: itemKey,
      id: canonicalBook.id,
      numericId: canonicalBook.numericId || 1,
      slug: canonicalBook.slug || String(canonicalBook.id),
      title: canonicalBook.title,
      titleKannada: canonicalBook.titleKannada || '',
      author: canonicalBook.author || 'JSS Publications',
      category: canonicalBook.category || 'Canonical Works',
      binding: edition.binding,
      formatLabel: edition.formatLabel || `${edition.binding} Edition`,
      editionId: edition.editionId,
      isbn: edition.isbn,
      weightGrams: edition.weightGrams || 240,
      price: edition.sellingPrice,
      mrp: edition.mrp || edition.sellingPrice,
      cover_image: canonicalBook.coverImage?.local || canonicalBook.cover_image || canonicalBook.imageUrl || '',
      webpImage: canonicalBook.coverImage?.webp || canonicalBook.webpImage || '',
      addedAt: new Date().toISOString()
    };

    list.unshift(itemToAdd);
    saveWishlist(list);
    return { success: true, wishlist: list, alreadyExists: false };
  },

  /**
   * Remove a publication or specific edition from the study reading list
   * @param {string|number} productId
   * @param {string} [variant=null] Optional edition binding
   */
  removeItem(productId, variant = null) {
    const list = loadWishlist();
    const pidStr = String(productId);

    const filtered = list.filter((item) => {
      const matchId = String(item.id) === pidStr || (item.slug && item.slug === pidStr);
      if (!matchId) return true;
      if (variant) {
        return String(item.binding || 'Paperback').trim().toLowerCase() !== String(variant).trim().toLowerCase();
      }
      return false; // Remove all editions of this book if no variant specified
    });

    saveWishlist(filtered);
    return { success: true, wishlist: filtered };
  },

  /**
   * Toggle publication membership in study reading list
   * @param {Object} book
   * @param {string} [variant=null]
   */
  toggleItem(book, variant = null) {
    if (!book || (!book.id && !book.slug)) return { inWishlist: false };
    const cleanVariant = variant || book.selectedVariant || book.format || book.binding || 'Paperback';
    const isPresent = this.isInWishlist(book.id || book.slug, cleanVariant);

    if (isPresent) {
      this.removeItem(book.id || book.slug, cleanVariant);
      return { inWishlist: false, book, variant: cleanVariant };
    } else {
      this.addItem(book, cleanVariant);
      return { inWishlist: true, book, variant: cleanVariant };
    }
  },

  /**
   * Reconcile wishlist items against authoritative catalogue service
   * (updates outdated prices, removes discontinued publications)
   * @returns {{ wishlist: WishlistItem[], notifications: string[], hasModifications: boolean }}
   */
  reconcileWishlist() {
    const currentList = loadWishlist();
    const reconciled = [];
    const notifications = [];
    let hasModifications = false;

    for (const item of currentList) {
      const canonicalBook =
        catalogueService.getBookById(item.id) ||
        catalogueService.getBookBySlug(item.slug || item.id);

      if (!canonicalBook) {
        notifications.push(`"${item.title}" is no longer in the active catalogue and was removed from your Study List.`);
        hasModifications = true;
        continue;
      }

      const format = item.binding || 'Paperback';
      const edition =
        catalogueService.getEdition(canonicalBook.id, format) ||
        catalogueService.getDefaultEdition(canonicalBook);

      if (item.price !== edition.sellingPrice) {
        notifications.push(
          `Price for "${canonicalBook.title} (${edition.binding})" was updated from ₹${item.price} to ₹${edition.sellingPrice}.`
        );
        hasModifications = true;
      }

      reconciled.push({
        ...item,
        id: canonicalBook.id,
        numericId: canonicalBook.numericId,
        slug: canonicalBook.slug,
        title: canonicalBook.title,
        titleKannada: canonicalBook.titleKannada || item.titleKannada || '',
        author: canonicalBook.author,
        category: canonicalBook.category,
        binding: edition.binding,
        formatLabel: edition.formatLabel || `${edition.binding} Edition`,
        editionId: edition.editionId,
        isbn: edition.isbn,
        weightGrams: edition.weightGrams || 240,
        mrp: edition.mrp || edition.sellingPrice,
        price: edition.sellingPrice
      });
    }

    if (hasModifications) {
      saveWishlist(reconciled);
    }

    return {
      wishlist: reconciled,
      notifications,
      hasModifications
    };
  },

  /**
   * Move a single study bookmark into the active shopping cart
   * @param {string|number} productId
   * @param {Object} [cartServiceInstance=null]
   * @param {string} [variant='Paperback']
   */
  moveToCart(productId, cartServiceInstance = null, variant = 'Paperback') {
    const list = loadWishlist();
    const pidStr = String(productId);
    const targetService = cartServiceInstance || cartService;

    const item = list.find(
      (i) =>
        String(i.id) === pidStr &&
        (!variant || String(i.binding || 'Paperback').trim().toLowerCase() === String(variant).trim().toLowerCase())
    ) || list.find((i) => String(i.id) === pidStr);

    if (!item || !targetService) return { success: false, reason: 'Item not found in wishlist' };

    const selectedVariant = variant || item.binding || 'Paperback';
    const addResult = targetService.addItem(item, selectedVariant, 1);

    if (addResult.success) {
      this.removeItem(productId, selectedVariant);
    }
    return { success: addResult.success, addedItem: item, addResult };
  },

  /**
   * Move all bookmarked study publications to the active cart in a single batch
   * @param {Object} [cartServiceInstance=null]
   */
  moveAllToCart(cartServiceInstance = null) {
    const list = loadWishlist();
    const targetService = cartServiceInstance || cartService;

    if (!list.length || !targetService) return { success: false, count: 0 };

    let count = 0;
    const remainingItems = [];

    list.forEach((item) => {
      const res = targetService.addItem(item, item.binding || 'Paperback', 1);
      if (res.success) {
        count++;
      } else {
        remainingItems.push(item);
      }
    });

    saveWishlist(remainingItems);
    return { success: true, count, remainingCount: remainingItems.length };
  },

  /**
   * Empty all study bookmarks
   */
  clearWishlist() {
    saveWishlist([]);
    return { success: true, wishlist: [] };
  }
};

export default wishlistService;

