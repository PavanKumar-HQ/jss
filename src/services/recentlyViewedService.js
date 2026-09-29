/**
 * Recently Viewed Products Domain Service
 * Tracks browse history, deduplicates entries, limits memory to the most recent 10 items,
 * and persists locally.
 */

import storage from '../utils/storage.js';
import { catalogueService } from './catalogueService.js';

const RECENTLY_VIEWED_KEY = 'jss_granthamale_recently_viewed';
const MAX_HISTORY_LIMIT = 10;
const listeners = new Set();

function notifyListeners(ids) {
  listeners.forEach((listener) => {
    try {
      listener(ids);
    } catch (err) {
      console.error('[recentlyViewedService] Listener error:', err);
    }
  });
}

function loadHistory() {
  const ids = storage.get(RECENTLY_VIEWED_KEY, []);
  return Array.isArray(ids) ? ids : [];
}

function saveHistory(ids) {
  storage.set(RECENTLY_VIEWED_KEY, ids);
  notifyListeners(ids);
}

export const recentlyViewedService = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  /**
   * Record that a product was viewed by the reader
   * @param {number|string} productId
   */
  recordView(productId) {
    if (!productId) return;
    const cleanId = String(productId).trim();

    const currentList = loadHistory();
    // Remove if already present (to move it to top)
    const filtered = currentList.filter((id) => String(id) !== cleanId);
    filtered.unshift(cleanId);

    // Limit to max history limit
    const trimmed = filtered.slice(0, MAX_HISTORY_LIMIT);
    saveHistory(trimmed);
  },

  /**
   * Return array of recently viewed product IDs
   */
  getRecentlyViewedIds() {
    return loadHistory();
  },

  /**
   * Return array of resolved Book objects for the recently viewed items
   * @param {number} limit
   * @param {string|number} excludeId
   * @returns {Book[]}
   */
  getRecentBooks(limit = 4, excludeId = null) {
    const historyIds = loadHistory();
    const result = [];

    for (const id of historyIds) {
      if (excludeId !== null && (String(id) === String(excludeId) || (typeof excludeId === 'object' && excludeId?.id && String(id) === String(excludeId.id)))) {
        continue;
      }
      const book = catalogueService.getBookById(id) || catalogueService.getBookBySlug(id);
      if (book && !result.some((b) => b.id === book.id)) {
        result.push(book);
      }
      if (result.length >= limit) break;
    }
    return result;
  },

  /**
   * Resolves recently viewed product IDs against a product list
   * @param {Array} allProducts - Full catalogue array
   * @param {number|string} excludeId - Optionally exclude currently opened product
   * @returns {Array} List of matched product objects in chronological view order
   */
  getRecentlyViewedProducts(allProducts = [], excludeId = null) {
    if (!Array.isArray(allProducts) || !allProducts.length) {
      return this.getRecentBooks(MAX_HISTORY_LIMIT, excludeId);
    }
    const historyIds = loadHistory();

    const result = [];
    historyIds.forEach((id) => {
      if (excludeId !== null && String(id) === String(excludeId)) {
        return;
      }
      const match = allProducts.find(
        (p) => String(p.id) === String(id) || (p.slug && p.slug === String(id))
      );
      if (match && !result.some((b) => b.id === match.id)) {
        result.push(match);
      }
    });

    return result;
  },

  clearHistory() {
    saveHistory([]);
  }
};

export default recentlyViewedService;
