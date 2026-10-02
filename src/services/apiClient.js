/**
 * Authoritative Frontend API Client
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Routes all catalogue, inventory, pricing, order, and admin requests
 * to the production backend REST API.
 */

const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const err = new Error(`API server offline or returned non-JSON response (${res.status})`);
      err.isOffline = true;
      throw err;
    }
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: Request failed`);
    }
    return data;
  } catch (err) {
    if (err.isOffline || err.message?.includes('non-JSON') || err.message?.includes('Failed to fetch')) {
      // Offline fallback mode; avoid polluting console with HTML parse failures
      throw err;
    }
    console.warn(`[apiClient] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const apiClient = {
  // Books & Catalogue
  async getBooks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/books${query ? `?${query}` : ''}`);
    return res.books || [];
  },

  async getBook(slugOrId) {
    const res = await request(`/books/${slugOrId}`);
    return res.book || null;
  },

  async addBook(bookData) {
    const res = await request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
    return res.book;
  },

  async updateBookPrice(bookId, binding, newPrice, reason = 'Price adjustment', actor = 'Administrator') {
    return request(`/books/${bookId}/price`, {
      method: 'PATCH',
      body: JSON.stringify({ binding, newPrice, reason, actor })
    });
  },

  async updateBookStatus(bookId, status, actor = 'Administrator') {
    return request(`/books/${bookId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, actor })
    });
  },

  // Inventory
  async getInventory() {
    const res = await request('/inventory');
    return res.stock || [];
  },

  async adjustStock(editionId, amount, reason = 'Stock adjustment', actor = 'Administrator') {
    return request('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ editionId, amount, reason, actor })
    });
  },

  async reserveStock(sessionId, items) {
    return request('/inventory/reserve', {
      method: 'POST',
      body: JSON.stringify({ sessionId, items })
    });
  },

  async releaseReservation(sessionId, reason = 'Checkout cancelled') {
    return request('/inventory/release', {
      method: 'POST',
      body: JSON.stringify({ sessionId, reason })
    });
  },

  // Pricing & Coupons
  async calculateCartTotals(items, couponCode = null, isCounterPickup = false) {
    const res = await request('/pricing/calculate', {
      method: 'POST',
      body: JSON.stringify({ items, couponCode, isCounterPickup })
    });
    return res.totals;
  },

  async validateCoupon(code, subtotal) {
    return request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    });
  },

  // Orders
  async createOrder(orderPayload) {
    const res = await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
    return res.order;
  },

  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/orders${query ? `?${query}` : ''}`);
    return res.orders || [];
  },

  async getOrder(idOrRef) {
    const res = await request(`/orders/${idOrRef}`);
    return res.order;
  },

  async updateOrderStatus(orderId, status, { trackingNumber, reason, actor } = {}) {
    return request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, trackingNumber, reason, actor })
    });
  },

  // Payment
  async createPaymentIntent({ amountInRupees, orderReference, customer }) {
    return request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amountInRupees, orderReference, customer })
    });
  },

  // FAQs
  async getFaqs() {
    const res = await request('/faqs');
    return res.faqs || [];
  },

  async addFaq(faqData) {
    const res = await request('/faqs', {
      method: 'POST',
      body: JSON.stringify(faqData)
    });
    return res.faq;
  },

  async updateFaq(id, faqData) {
    return request(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faqData)
    });
  },

  // Bulk Enquiries
  async getBulkEnquiries() {
    const res = await request('/bulk-enquiries');
    return res.enquiries || [];
  },

  async createBulkEnquiry(payload) {
    return request('/bulk-enquiries', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Admin Dashboard & Audit Logs
  async getDashboardMetrics() {
    const res = await request('/admin/dashboard');
    return res.metrics;
  },

  async getAuditLogs() {
    const res = await request('/admin/audit-logs');
    return res.logs || [];
  }
};

export default apiClient;
