/**
 * Recently Viewed Products Domain Service
 * Tracks browse history, deduplicates entries, limits memory to the most recent 10 items,
 * and persists locally.
 */

import storage from '../utils/storage';

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
    const cleanId = typeof productId === 'string' && /^\d+$/.test(productId)
      ? parseInt(productId, 10)
      : productId;

    const currentList = loadHistory();
    // Remove if already present (to move it to top)
    const filtered = currentList.filter((id) => String(id) !== String(cleanId));
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
   * Resolves recently viewed product IDs against a product list
   * @param {Array} allProducts - Full catalogue array
   * @param {number|string} excludeId - Optionally exclude currently opened product
   * @returns {Array} List of matched product objects in chronological view order
   */
  getRecentlyViewedProducts(allProducts = [], excludeId = null) {
    if (!Array.isArray(allProducts) || !allProducts.length) return [];
    const historyIds = loadHistory();

    const result = [];
    historyIds.forEach((id) => {
      if (excludeId !== null && String(id) === String(excludeId)) {
        return;
      }
      const match = allProducts.find(
        (p) => String(p.id) === String(id) || (p.slug && p.slug === String(id))
      );
      if (match) {
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
