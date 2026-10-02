/**
 * JSS Publications - Repository Factory & Persistence Adapters
 *
 * Implements clean separation:
 * Presentation Layer -> Application Service -> Repository Interface -> Persistence Adapter
 *
 * Supported Adapters:
 * - 'api': Communicates with backend Express / SQLite 3 server via apiClient.js
 * - 'demo': Client-side persistent fallback using authoritative localStorage stores
 * - 'postgres' / 'supabase': Future database direct adapter
 */

import { apiClient } from '../services/apiClient.js';
import storage from '../utils/storage.js';
import ids from '../utils/ids.js';
import { catalogueService } from '../services/catalogueService.js';
import { validator, ValidationError } from '../domain/validator.js';
import { canTransitionOrder, ORDER_STATES } from '../domain/contracts.js';

// Configuration provider selection
const APP_DATA_PROVIDER = (typeof window !== 'undefined' && window.__APP_DATA_PROVIDER) || 'demo';

// ============================================================================
// PRODUCT REPOSITORY
// ============================================================================
class DemoProductAdapter {
  async list(filters = {}) {
    let books = catalogueService.getBooksSync();
    if (filters.category && filters.category !== 'All') {
      books = books.filter(b => b.category === filters.category);
    }
    if (filters.status && filters.status !== 'All') {
      books = books.filter(b => b.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      books = books.filter(b => 
        b.title.toLowerCase().includes(q) || 
        (b.author && b.author.toLowerCase().includes(q))
      );
    }
    return books;
  }

  async getById(id) {
    return catalogueService.getBookById(id);
  }

  async getBySlug(slug) {
    return catalogueService.getBookBySlug(slug);
  }

  async create(input) {
    validator.validateBookInput(input, false);
    const newBook = {
      id: input.id || `jss-pub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      slug: input.slug || ids.generateSlug(input.title),
      title: input.title.trim(),
      titleKannada: input.titleKannada || input.title,
      author: input.author.trim(),
      category: input.category || 'Vachana Literature',
      price: Number(input.price) || 200,
      status: input.status || 'in_print',
      pages: Number(input.pages) || 200,
      stock: Number(input.stock) || 30,
      description: input.description || '',
      editions: input.editions || [
        { id: `ed-${Date.now()}-1`, binding: 'Paperback', price: Number(input.price) || 200, stock: 30 }
      ],
      createdAt: new Date().toISOString(),
      version: 1
    };
    return newBook;
  }

  async updatePrice(bookId, binding, newPrice, reason = 'Price adjustment') {
    const book = await this.getById(bookId);
    if (!book) throw new Error(`Publication "${bookId}" not found.`);
    book.price = Number(newPrice);
    book.version = (book.version || 1) + 1;
    book.updatedAt = new Date().toISOString();
    return book;
  }
}

class RemoteApiProductAdapter {
  async list(filters = {}) {
    return apiClient.getBooks(filters);
  }
  async getById(id) {
    return apiClient.getBook(id);
  }
  async getBySlug(slug) {
    return apiClient.getBook(slug);
  }
  async create(input) {
    validator.validateBookInput(input, false);
    return apiClient.addBook(input);
  }
  async updatePrice(bookId, binding, newPrice, reason = 'Price adjustment') {
    return apiClient.updateBookPrice(bookId, binding, newPrice, reason);
  }
}

// ============================================================================
// ORDER REPOSITORY (WITH IDEMPOTENCY KEYS)
// ============================================================================
const PROCESSED_IDEMPOTENCY_KEYS = new Map();

class DemoOrderAdapter {
  constructor() {
    this.storageKey = 'jss_granthamale_orders';
  }

  _load() {
    return storage.get(this.storageKey, []);
  }

  _save(orders) {
    storage.set(this.storageKey, orders);
  }

  async create(orderPayload, idempotencyKey = null) {
    // 1. Idempotency Check: prevent duplicate double-charge or double-order creation
    if (idempotencyKey) {
      if (PROCESSED_IDEMPOTENCY_KEYS.has(idempotencyKey)) {
        console.warn(`[OrderRepository] Idempotent order duplicate detected for key "${idempotencyKey}". Returning existing order.`);
        return PROCESSED_IDEMPOTENCY_KEYS.get(idempotencyKey);
      }
    }

    // 2. Strict Domain Validation
    validator.validateCheckoutPayload(orderPayload);

    const orderId = ids.generateOrderId();
    const createdAt = new Date().toISOString();

    const orderRecord = {
      orderId,
      orderReference: orderId,
      status: ORDER_STATES.CONFIRMED,
      createdAt,
      updatedAt: createdAt,
      version: 1,
      customer: {
        fullName: orderPayload.customer.fullName.trim(),
        email: (orderPayload.customer.email || '').trim().toLowerCase(),
        phone: orderPayload.customer.phone.trim(),
        organization: orderPayload.customer.organization ? orderPayload.customer.organization.trim() : null
      },
      shippingAddress: {
        addressLine: orderPayload.shippingAddress.addressLine.trim(),
        city: orderPayload.shippingAddress.city.trim(),
        state: orderPayload.shippingAddress.state ? orderPayload.shippingAddress.state.trim() : 'Karnataka',
        pincode: orderPayload.shippingAddress.pincode.trim()
      },
      items: orderPayload.items.map(it => ({
        id: it.id || it.editionId,
        title: it.title,
        price: Number(it.price),
        quantity: Number(it.quantity),
        binding: it.binding || it.format || 'Paperback',
        hsnCode: '4901'
      })),
      totals: {
        subtotal: orderPayload.totals?.subtotal || 0,
        discount: orderPayload.totals?.discount || 0,
        shippingFee: orderPayload.totals?.shippingFee || 0,
        grandTotal: orderPayload.totals?.grandTotal || 0,
        currency: 'INR'
      },
      payment: {
        method: orderPayload.paymentMethod || 'Development Demo Adapter',
        status: 'completed',
        timestamp: createdAt
      },
      dispatch: {
        status: 'pending_dispatch',
        carrier: 'India Post (Speed Post)',
        trackingNumber: null
      }
    };

    const orders = this._load();
    orders.unshift(orderRecord);
    this._save(orders);

    if (idempotencyKey) {
      PROCESSED_IDEMPOTENCY_KEYS.set(idempotencyKey, orderRecord);
    }

    return orderRecord;
  }

  async getById(id) {
    const orders = this._load();
    return orders.find(o => o.orderId === id || o.orderReference === id) || null;
  }

  async getByReference(ref) {
    return this.getById(ref);
  }

  async list(filters = {}) {
    let orders = this._load();
    if (filters.status && filters.status !== 'All') {
      orders = orders.filter(o => o.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      orders = orders.filter(o => 
        o.orderId.toLowerCase().includes(q) ||
        (o.customer?.fullName && o.customer.fullName.toLowerCase().includes(q))
      );
    }
    return orders;
  }

  async updateStatus(id, newStatus, details = {}) {
    const orders = this._load();
    const order = orders.find(o => o.orderId === id || o.orderReference === id);
    if (!order) throw new Error(`Order "${id}" does not exist.`);

    if (!canTransitionOrder(order.status, newStatus)) {
      throw new Error(`Illegal state transition from "${order.status}" to "${newStatus}".`);
    }

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    order.version = (order.version || 1) + 1;
    if (details.trackingNumber) {
      order.dispatch = order.dispatch || {};
      order.dispatch.trackingNumber = details.trackingNumber;
    }
    this._save(orders);
    return order;
  }
}

class RemoteApiOrderAdapter {
  async create(orderPayload, idempotencyKey = null) {
    validator.validateCheckoutPayload(orderPayload);
    const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {};
    return apiClient.createOrder({ ...orderPayload, headers });
  }
  async getById(id) {
    return apiClient.getOrder(id);
  }
  async getByReference(ref) {
    return apiClient.getOrder(ref);
  }
  async list(filters = {}) {
    return apiClient.getOrders(filters);
  }
  async updateStatus(id, newStatus, details = {}) {
    return apiClient.updateOrderStatus(id, newStatus, details);
  }
}

// ============================================================================
// REPOSITORY FACTORY INSTANTIATION
// ============================================================================
const isServerAvailable = false; // Evaluated dynamically or via provider selection

export const productRepository = APP_DATA_PROVIDER === 'api' 
  ? new RemoteApiProductAdapter() 
  : new DemoProductAdapter();

export const orderRepository = APP_DATA_PROVIDER === 'api' 
  ? new RemoteApiOrderAdapter() 
  : new DemoOrderAdapter();

export { ORDER_STATES, canTransitionOrder } from '../domain/contracts.js';
export { validator, ValidationError } from '../domain/validator.js';
export { DemoProductAdapter, RemoteApiProductAdapter, DemoOrderAdapter, RemoteApiOrderAdapter };

export default {
  productRepository,
  orderRepository,
  ORDER_STATES,
  canTransitionOrder,
  ValidationError,
  validator
};
