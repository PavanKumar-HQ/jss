/**
 * Cart Domain Service
 * Authoritative shopping cart manager for JSS Publications.
 *
 * Responsibilities:
 * - Cart item addition, quantity updates, item removal, and clearing
 * - Multi-binding edition snapshots (binding, formatLabel, editionId, ISBN, weight)
 * - Authoritative price reconciliation against CatalogueService (Never Trust Frontend Prices)
 * - Stock limit and retail quantity ceiling enforcement
 * - Corrupted storage healing and validation
 * - Deterministic currency calculations (subtotal, shipping, discount, final payable total)
 * - Safe reactive subscriber notifications
 */

import storage from '../utils/storage.js';
import validation from '../utils/validation.js';
import ids from '../utils/ids.js';
import { catalogueService } from './catalogueService.js';

const CART_STORAGE_KEY = 'jss_granthamale_cart';
export const MAX_RETAIL_QTY_PER_TITLE = 10;
export const FREE_SHIPPING_THRESHOLD = 500;
export const STANDARD_SHIPPING_FEE = 40;

const listeners = new Set();

function notifyListeners(cart) {
  listeners.forEach((listener) => {
    try {
      listener(cart);
    } catch (err) {
      console.error('[cartService] Subscriber listener error:', err);
    }
  });
}

/**
 * Validate that an object conforms to a valid CartItem structure
 */
function isValidCartItem(item) {
  return (
    item &&
    typeof item === 'object' &&
    (item.id !== undefined && item.id !== null) &&
    typeof item.price === 'number' &&
    item.price >= 0 &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
}

/**
 * Load cart from storage with corruption recovery and schema sanitization
 */
function loadCart() {
  try {
    const raw = storage.get(CART_STORAGE_KEY, []);
    if (!Array.isArray(raw)) {
      console.warn('[cartService] Corrupted cart storage detected (non-array). Resetting to empty cart.');
      storage.set(CART_STORAGE_KEY, []);
      return [];
    }

    // Filter out corrupted or malformed item records
    const validItems = raw.filter(isValidCartItem);
    if (validItems.length !== raw.length) {
      console.warn(`[cartService] Purged ${raw.length - validItems.length} corrupted cart entries.`);
      storage.set(CART_STORAGE_KEY, validItems);
    }
    return validItems;
  } catch (err) {
    console.error('[cartService] Error parsing cart storage. Healing storage:', err);
    storage.set(CART_STORAGE_KEY, []);
    return [];
  }
}

/**
 * Save cart to persistent storage and notify all active UI listeners
 */
function saveCart(cart) {
  const sanitized = Array.isArray(cart) ? cart.filter(isValidCartItem) : [];
  storage.set(CART_STORAGE_KEY, sanitized);
  notifyListeners(sanitized);
}

export const cartService = {
  /**
   * Subscribe to reactive cart mutations
   * @param {Function} callback (cart: CartItem[]) => void
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  /**
   * Return current list of cart items
   * @returns {CartItem[]}
   */
  getCart() {
    return loadCart();
  },

  /**
   * Reconciles cart items against authoritative Catalogue Service.
   * Enforces:
   * - Verification of book existence (flags deleted/discontinued items)
   * - Authoritative pricing (replaces any tampered or stale local prices)
   * - Stock and binding verification
   * - Quantity limit clamping
   *
   * @returns {{ cart: CartItem[], notifications: string[], hasModifications: boolean }}
   */
  reconcileCart() {
    const currentCart = loadCart();
    const reconciled = [];
    const notifications = [];
    let hasModifications = false;

    for (const item of currentCart) {
      // 1. Verify that the book still exists in the catalogue
      const canonicalBook = catalogueService.getBookById(item.id) || catalogueService.getBookBySlug(item.slug);

      if (!canonicalBook) {
        notifications.push(`"${item.title}" is no longer available in the catalogue and was removed.`);
        hasModifications = true;
        continue;
      }

      // 2. Resolve the specific edition/binding
      const format = item.format || 'Paperback';
      const edition = catalogueService.getEdition(canonicalBook.id, format) || catalogueService.getDefaultEdition(canonicalBook);

      // 3. Authoritative Price Check (Never Trust Frontend Prices)
      const authoritativePrice = edition.sellingPrice;
      if (item.price !== authoritativePrice) {
        notifications.push(
          `Price for "${canonicalBook.title} (${edition.binding})" was updated from ₹${item.price} to ₹${authoritativePrice}.`
        );
        hasModifications = true;
      }

      // 4. Quantity and limit check
      const maxLimit = edition.maxOrderLimit || MAX_RETAIL_QTY_PER_TITLE;
      let qty = item.quantity;
      if (qty > maxLimit) {
        notifications.push(`Quantity for "${canonicalBook.title}" adjusted to maximum retail limit of ${maxLimit}.`);
        qty = maxLimit;
        hasModifications = true;
      } else if (qty <= 0) {
        qty = 1;
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
        format: edition.binding,
        formatLabel: edition.formatLabel || `${edition.binding} Edition`,
        editionId: edition.editionId,
        isbn: edition.isbn,
        weightGrams: edition.weightGrams || 240,
        mrp: edition.mrp || authoritativePrice,
        price: authoritativePrice,
        quantity: qty,
        maxQuantity: maxLimit,
        inStock: edition.inStock !== false
      });
    }

    if (hasModifications) {
      saveCart(reconciled);
    }

    return {
      cart: reconciled,
      notifications,
      hasModifications
    };
  },

  /**
   * Add a book edition to the cart with authoritative price & bounds enforcement.
   * Even if a compromised client passes price: 1, this method verifies and enforces
   * the authentic sellingPrice from CatalogueService.
   *
   * @param {Object} book - Book object from catalogue
   * @param {string} variant - 'Paperback' | 'Hardbound' | 'Deluxe Hardbound'
   * @param {number} requestedQty - Desired quantity
   */
  addItem(book, variant = 'Paperback', requestedQty = 1) {
    if (!book || !book.id) {
      return { success: false, reason: 'Invalid publication data' };
    }

    // 1. Authoritative resolution from catalogueService
    const canonicalBook = catalogueService.getBookById(book.id) || catalogueService.getBookBySlug(book.slug) || book;
    const cleanVariant = variant || book.selectedVariant || book.format || 'Paperback';
    const edition = catalogueService.getEdition(canonicalBook.id, cleanVariant) || catalogueService.getDefaultEdition(canonicalBook);

    const authoritativePrice = edition.sellingPrice;
    const maxLimit = edition.maxOrderLimit || MAX_RETAIL_QTY_PER_TITLE;
    const cleanQty = validation.sanitizeQuantity(requestedQty, 1, maxLimit);

    const cart = loadCart();
    const itemKey = ids.getCartItemKey(canonicalBook.id, edition.binding);

    const existingIndex = cart.findIndex(
      (item) => (item.key && item.key === itemKey) || (item.id === canonicalBook.id && (item.format || 'Paperback') === edition.binding)
    );

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      const newQty = Math.min(currentQty + cleanQty, maxLimit);
      const addedQty = newQty - currentQty;

      cart[existingIndex] = {
        ...cart[existingIndex],
        price: authoritativePrice,
        mrp: edition.mrp || authoritativePrice,
        isbn: edition.isbn,
        weightGrams: edition.weightGrams || 240,
        quantity: newQty,
        maxQuantity: maxLimit
      };

      saveCart(cart);
      return {
        success: true,
        cart,
        addedQty,
        hitMaxLimit: newQty === maxLimit && currentQty + cleanQty > maxLimit
      };
    }

    // New item entry with verified physical edition attributes
    const newItem = {
      key: itemKey,
      id: canonicalBook.id,
      numericId: canonicalBook.numericId || 1,
      slug: canonicalBook.slug || String(canonicalBook.id),
      title: canonicalBook.title,
      titleKannada: canonicalBook.titleKannada || '',
      author: canonicalBook.author || 'JSS Publications',
      category: canonicalBook.category || 'Canonical Works',
      cover_image: canonicalBook.coverImage?.local || canonicalBook.cover_image || canonicalBook.imageUrl || '',
      webpImage: canonicalBook.coverImage?.webp || canonicalBook.webpImage || '',
      format: edition.binding,
      formatLabel: edition.formatLabel || `${edition.binding} Edition`,
      editionId: edition.editionId,
      isbn: edition.isbn,
      weightGrams: edition.weightGrams || 240,
      mrp: edition.mrp || authoritativePrice,
      price: authoritativePrice, // Authoritative price snapshot
      quantity: cleanQty,
      maxQuantity: maxLimit,
      inStock: true
    };

    cart.push(newItem);
    saveCart(cart);
    return { success: true, cart, addedQty: cleanQty, hitMaxLimit: false };
  },

  /**
   * Update quantity of an item in the cart
   */
  updateQuantity(productId, variant, newQty) {
    const cleanVariant = variant || 'Paperback';
    const cart = loadCart();
    const targetIndex = cart.findIndex(
      (item) => item.id === productId && (item.format || 'Paperback') === cleanVariant
    );

    if (targetIndex === -1) {
      return { success: false, reason: 'Item not found in cart' };
    }

    if (newQty <= 0) {
      cart.splice(targetIndex, 1);
      saveCart(cart);
      return { success: true, cart, removed: true };
    }

    const currentItem = cart[targetIndex];
    const maxLimit = currentItem.maxQuantity || MAX_RETAIL_QTY_PER_TITLE;
    const clampedQty = validation.sanitizeQuantity(newQty, 1, maxLimit);

    cart[targetIndex] = {
      ...currentItem,
      quantity: clampedQty
    };

    saveCart(cart);
    return {
      success: true,
      cart,
      removed: false,
      quantity: clampedQty,
      hitMaxLimit: newQty >= maxLimit
    };
  },

  /**
   * Remove an item edition from the cart
   */
  removeItem(productId, variant) {
    const cleanVariant = variant || 'Paperback';
    const cart = loadCart().filter(
      (item) => !(item.id === productId && (item.format || 'Paperback') === cleanVariant)
    );
    saveCart(cart);
    return { success: true, cart };
  },

  /**
   * Empty all items from the cart
   */
  clearCart() {
    saveCart([]);
    return { success: true, cart: [] };
  },

  /**
   * Compute comprehensive financial totals with deterministic rounding and tax exemption.
   *
   * @param {CartItem[]} [cartItems=null] - Optional override array
   * @param {number} [appliedDiscount=0] - Discount in INR
   * @param {number|null} [customShipping=null] - Custom shipping override (e.g. counter pickup = 0)
   * @returns {TotalsResult}
   */
  getTotals(cartItems = null, appliedDiscount = 0, customShipping = null) {
    const items = cartItems || loadCart();
    
    // Deterministic arithmetic (avoids floating-point errors)
    const itemsCount = items.reduce((sum, item) => sum + (Math.max(1, parseInt(item.quantity, 10) || 1)), 0);
    const subtotal = items.reduce((sum, item) => {
      const price = typeof item.price === 'number' && item.price >= 0 ? item.price : 0;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      return sum + Math.round(price * qty);
    }, 0);

    const totalWeightGrams = items.reduce((sum, item) => {
      const weight = item.weightGrams || 240;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      return sum + (weight * qty);
    }, 0);

    const discount = Math.max(0, Math.min(Math.round(appliedDiscount), subtotal));
    const discountedSubtotal = subtotal - discount;

    let shippingFee = 0;
    if (itemsCount > 0) {
      if (customShipping !== null && typeof customShipping === 'number') {
        shippingFee = Math.max(0, Math.round(customShipping));
      } else {
        shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
      }
    }

    const grandTotal = Math.max(0, discountedSubtotal + shippingFee);
    const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

    return {
      itemsCount,
      subtotal,
      discount,
      shippingFee,
      grandTotal,
      totalWeightGrams,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountNeededForFreeShipping,
      freeShippingProgress,
      qualifiesForFreeShipping: itemsCount > 0 && shippingFee === 0,
      isTaxExempt: true, // HSN 4901 GST exemption for all printed books
      taxAmount: 0,
      currency: 'INR'
    };
  }
};

export default cartService;
