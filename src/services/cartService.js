/**
 * Cart Domain Service
 * Manages item addition, removal, quantity bounds, variant resolution,
 * persistence, and reactive updates without authoritative backend coupling.
 */

import storage from '../utils/storage';
import validation from '../utils/validation';
import ids from '../utils/ids';

const CART_STORAGE_KEY = 'jss_granthamale_cart';
const MAX_RETAIL_QTY_PER_TITLE = 10;
const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_FEE = 40;

const listeners = new Set();

function notifyListeners(cart) {
  listeners.forEach((listener) => {
    try {
      listener(cart);
    } catch (err) {
      console.error('[cartService] Listener error:', err);
    }
  });
}

function loadCart() {
  const items = storage.get(CART_STORAGE_KEY, []);
  return Array.isArray(items) ? items : [];
}

function saveCart(cart) {
  storage.set(CART_STORAGE_KEY, cart);
  notifyListeners(cart);
}

export const cartService = {
  /**
   * Subscribe to cart state mutations
   * @param {Function} callback (cart: CartItem[]) => void
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  /**
   * Returns current list of cart items
   */
  getCart() {
    return loadCart();
  },

  /**
   * Add a book to the cart with variant and quantity bounds check
   */
  addItem(book, variant = 'Paperback', requestedQty = 1) {
    if (!book || !book.id) return { success: false, reason: 'Invalid book' };

    const cart = loadCart();
    const cleanVariant = variant || book.selectedVariant || book.format || 'Paperback';
    const cleanQty = validation.sanitizeQuantity(requestedQty, 1, MAX_RETAIL_QTY_PER_TITLE);

    // Resolve price for variant
    const resolvedPrice = cleanVariant.toLowerCase().includes('hardbound') && book.specialPrice
      ? book.specialPrice
      : book.price;

    const existingIndex = cart.findIndex(
      (item) => item.id === book.id && (item.format || 'Paperback') === cleanVariant
    );

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      const newQty = Math.min(currentQty + cleanQty, MAX_RETAIL_QTY_PER_TITLE);
      const addedQty = newQty - currentQty;

      cart[existingIndex] = {
        ...cart[existingIndex],
        quantity: newQty,
        price: resolvedPrice
      };

      saveCart(cart);
      return {
        success: true,
        cart,
        addedQty,
        hitMaxLimit: newQty === MAX_RETAIL_QTY_PER_TITLE && currentQty + cleanQty > MAX_RETAIL_QTY_PER_TITLE
      };
    }

    const newItem = {
      key: ids.getCartItemKey(book.id, cleanVariant),
      id: book.id,
      slug: book.slug || String(book.id),
      title: book.title,
      titleKannada: book.titleKannada || '',
      author: book.author || 'JSS Publications',
      category: book.category || 'Canonical Works',
      cover_image: book.cover_image || book.imageUrl || '',
      webpImage: book.webpImage || '',
      price: resolvedPrice,
      format: cleanVariant,
      quantity: cleanQty,
      maxQuantity: MAX_RETAIL_QTY_PER_TITLE
    };

    cart.push(newItem);
    saveCart(cart);
    return { success: true, cart, addedQty: cleanQty, hitMaxLimit: false };
  },

  /**
   * Update item quantity with min/max bounds check
   */
  updateQuantity(productId, variant, newQty) {
    const cleanVariant = variant || 'Paperback';
    const cart = loadCart();
    const targetIndex = cart.findIndex(
      (item) => item.id === productId && (item.format || 'Paperback') === cleanVariant
    );

    if (targetIndex === -1) return { success: false, reason: 'Item not in cart' };

    if (newQty <= 0) {
      cart.splice(targetIndex, 1);
      saveCart(cart);
      return { success: true, cart, removed: true };
    }

    const clampedQty = validation.sanitizeQuantity(newQty, 1, MAX_RETAIL_QTY_PER_TITLE);
    cart[targetIndex] = {
      ...cart[targetIndex],
      quantity: clampedQty
    };

    saveCart(cart);
    return { success: true, cart, removed: false, quantity: clampedQty };
  },

  /**
   * Remove a specific variant from the cart
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
   * Empty all items
   */
  clearCart() {
    saveCart([]);
    return { success: true, cart: [] };
  },

  /**
   * Compute comprehensive financial totals including threshold checks and tax status
   */
  getTotals(cartItems = null, appliedDiscount = 0, customShipping = null) {
    const items = cartItems || loadCart();
    const itemsCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const discount = Math.max(0, Math.min(appliedDiscount, subtotal));
    const discountedSubtotal = subtotal - discount;

    let shippingFee = 0;
    if (itemsCount > 0) {
      if (customShipping !== null && typeof customShipping === 'number') {
        shippingFee = customShipping;
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
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountNeededForFreeShipping,
      freeShippingProgress,
      qualifiesForFreeShipping: itemsCount > 0 && shippingFee === 0,
      isTaxExempt: true, // HSN 4901 GST exemption for all printed literature
      taxAmount: 0
    };
  }
};

export default cartService;
