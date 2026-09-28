/**
 * Wishlist / Reading Study List Domain Service (ನನ್ನ ಆಯ್ಕೆಯ ಗ್ರಂಥಗಳು)
 * Allows readers, scholars, and mutts to curate book lists with persistence,
 * duplicate prevention, and one-click transition to cart.
 */

import storage from '../utils/storage';

const WISHLIST_STORAGE_KEY = 'jss_granthamale_wishlist';
const listeners = new Set();

function notifyListeners(wishlist) {
  listeners.forEach((listener) => {
    try {
      listener(wishlist);
    } catch (err) {
      console.error('[wishlistService] Listener error:', err);
    }
  });
}

function loadWishlist() {
  const items = storage.get(WISHLIST_STORAGE_KEY, []);
  return Array.isArray(items) ? items : [];
}

function saveWishlist(wishlist) {
  storage.set(WISHLIST_STORAGE_KEY, wishlist);
  notifyListeners(wishlist);
}

export const wishlistService = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  getWishlist() {
    return loadWishlist();
  },

  isInWishlist(productId) {
    if (!productId) return false;
    const list = loadWishlist();
    return list.some((item) => String(item.id) === String(productId));
  },

  addItem(book) {
    if (!book || !book.id) return { success: false, reason: 'Invalid book' };
    const list = loadWishlist();

    if (list.some((item) => String(item.id) === String(book.id))) {
      return { success: true, wishlist: list, alreadyExists: true };
    }

    const itemToAdd = {
      id: book.id,
      slug: book.slug || String(book.id),
      title: book.title,
      titleKannada: book.titleKannada || '',
      author: book.author || 'JSS Publications',
      category: book.category || 'Canonical Works',
      price: book.price,
      specialPrice: book.specialPrice || null,
      cover_image: book.cover_image || book.imageUrl || '',
      webpImage: book.webpImage || '',
      pages: book.pages || null,
      binding: book.binding || 'Paperback',
      addedAt: new Date().toISOString()
    };

    list.unshift(itemToAdd);
    saveWishlist(list);
    return { success: true, wishlist: list, alreadyExists: false };
  },

  removeItem(productId) {
    const list = loadWishlist().filter((item) => String(item.id) !== String(productId));
    saveWishlist(list);
    return { success: true, wishlist: list };
  },

  toggleItem(book) {
    if (!book || !book.id) return { inWishlist: false };
    const isPresent = this.isInWishlist(book.id);
    if (isPresent) {
      this.removeItem(book.id);
      return { inWishlist: false, book };
    } else {
      this.addItem(book);
      return { inWishlist: true, book };
    }
  },

  /**
   * Move a single wishlist item into the active cart
   */
  moveToCart(productId, cartServiceInstance, variant = 'Paperback') {
    const list = loadWishlist();
    const item = list.find((i) => String(i.id) === String(productId));
    if (!item || !cartServiceInstance) return { success: false };

    const addResult = cartServiceInstance.addItem(item, variant, 1);
    if (addResult.success) {
      this.removeItem(productId);
    }
    return { success: true, addedItem: item };
  },

  /**
   * Move all wishlist items to cart
   */
  moveAllToCart(cartServiceInstance) {
    const list = loadWishlist();
    if (!list.length || !cartServiceInstance) return { success: false, count: 0 };

    let count = 0;
    list.forEach((item) => {
      const res = cartServiceInstance.addItem(item, item.binding || 'Paperback', 1);
      if (res.success) count++;
    });

    saveWishlist([]);
    return { success: true, count };
  },

  clearWishlist() {
    saveWishlist([]);
    return { success: true, wishlist: [] };
  }
};

export default wishlistService;
