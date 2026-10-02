/**
 * JSS Publications - Production Express API & Real-time Server
 * JSS Mahavidyapeetha / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Exposes server-authoritative REST endpoints and Server-Sent Events (SSE) stream.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { db } from './services/db.js';
import { seedDatabase } from './db/seed.js';
import { realtimeService } from './services/realtimeService.js';
import { catalogueService } from './services/catalogueService.js';
import { inventoryService } from './services/inventoryService.js';
import { pricingService } from './services/pricingService.js';
import { orderService } from './services/orderService.js';
import { paymentService } from './services/paymentService.js';
import { serverValidator, ValidationError } from './services/validator.js';

dotenv.config();

const idempotencyKeyMap = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Ensure database is seeded on startup if empty
seedDatabase(false);

// -------------------------------------------------------------
// 1. HEALTH & REALTIME
// -------------------------------------------------------------
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    realtimeClients: realtimeService.getClientCount(),
    database: 'SQLite 3 (WAL mode)'
  });
});

app.get('/api/v1/realtime', (req, res) => {
  realtimeService.addClient(req, res);
});

// -------------------------------------------------------------
// 2. CATALOGUE & BOOKS
// -------------------------------------------------------------
app.get('/api/v1/books', (req, res) => {
  try {
    const { category, status, search } = req.query;
    const books = catalogueService.getAllBooks({ category, status, search });
    res.json({ success: true, count: books.length, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/books/:slug', (req, res) => {
  try {
    const book = catalogueService.getBookBySlug(req.params.slug) || catalogueService.getBookById(req.params.slug);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }
    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/books', (req, res) => {
  try {
    const book = catalogueService.addBook(req.body);
    res.status(201).json({ success: true, book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.patch('/api/v1/books/:id/price', (req, res) => {
  try {
    const { binding, newPrice, reason, actor } = req.body;
    const result = catalogueService.updatePrice(req.params.id, binding, newPrice, reason, actor);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.patch('/api/v1/books/:id/status', (req, res) => {
  try {
    const { status, actor } = req.body;
    const result = catalogueService.updateBookStatus(req.params.id, status, actor);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 3. INVENTORY
// -------------------------------------------------------------
app.get('/api/v1/inventory', (req, res) => {
  try {
    const stock = inventoryService.getAllStock();
    res.json({ success: true, count: stock.length, stock });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/inventory/adjust', (req, res) => {
  try {
    const { editionId, amount, reason, actor } = req.body;
    const result = inventoryService.adjustStock(editionId, amount, reason, actor);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/inventory/reserve', (req, res) => {
  try {
    const { sessionId, items } = req.body;
    const result = inventoryService.reserveStock(sessionId, items);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/inventory/release', (req, res) => {
  try {
    const { sessionId, reason } = req.body;
    const result = inventoryService.releaseReservation(sessionId, reason);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 4. PRICING & COUPONS
// -------------------------------------------------------------
app.post('/api/v1/pricing/calculate', (req, res) => {
  try {
    const { items, couponCode, isCounterPickup } = req.body;
    const result = pricingService.calculateCartTotals(items, couponCode, isCounterPickup);
    res.json({ success: true, totals: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/coupons/validate', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const result = pricingService.validateCoupon(code, subtotal);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 5. ORDERS
// -------------------------------------------------------------
app.post('/api/v1/orders', (req, res) => {
  try {
    const idempotencyKey = req.headers['idempotency-key'] || req.body?.idempotencyKey;
    if (idempotencyKey && idempotencyKeyMap.has(idempotencyKey)) {
      return res.status(200).json({ success: true, order: idempotencyKeyMap.get(idempotencyKey), idempotent: true });
    }

    serverValidator.validateOrderPayload(req.body);
    const order = orderService.createOrder(req.body);

    if (idempotencyKey) {
      idempotencyKeyMap.set(idempotencyKey, order);
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message, errors: err.errors || [] });
  }
});

app.get('/api/v1/orders', (req, res) => {
  try {
    const { status, search, limit, offset } = req.query;
    const orders = orderService.getAllOrders({ status, search, limit, offset });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/orders/:id', (req, res) => {
  try {
    const order = orderService.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/v1/orders/:id/status', (req, res) => {
  try {
    const { status, trackingNumber, reason, actor } = req.body;
    const result = orderService.updateOrderStatus(req.params.id, status, { trackingNumber, reason, actor });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 6. PAYMENTS & WEBHOOKS
// -------------------------------------------------------------
app.post('/api/v1/payments/create-intent', async (req, res) => {
  try {
    const { amountInRupees, orderReference, customer } = req.body;
    const result = await paymentService.createPaymentIntent({ amountInRupees, orderReference, customer });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/payments/webhook', (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = JSON.stringify(req.body);
    const result = paymentService.processWebhook(rawBody, signature);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 7. FAQS (CMS)
// -------------------------------------------------------------
app.get('/api/v1/faqs', (req, res) => {
  try {
    const faqs = db.queryAll('SELECT * FROM faqs ORDER BY display_order ASC');
    res.json({ success: true, count: faqs.length, faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/faqs', (req, res) => {
  try {
    const { category, question, question_kn, answer, answer_kn, status } = req.body;
    const id = `faq-${Date.now().toString().slice(-4)}`;
    const nowIso = new Date().toISOString();
    const count = db.queryOne('SELECT COUNT(*) as c FROM faqs').c;

    db.run(`
      INSERT INTO faqs (id, category, question, question_kn, answer, answer_kn, status, display_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, id, category, question, question_kn || '', answer, answer_kn || '', status || 'published', count + 1, nowIso, nowIso);

    realtimeService.broadcast('FAQ_MUTATED', { action: 'CREATED', faqId: id });
    res.status(201).json({ success: true, faq: { id, category, question, answer } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/v1/faqs/:id', (req, res) => {
  try {
    const { category, question, question_kn, answer, answer_kn, status } = req.body;
    const nowIso = new Date().toISOString();

    db.run(`
      UPDATE faqs
      SET category = ?, question = ?, question_kn = ?, answer = ?, answer_kn = ?, status = ?, updated_at = ?
      WHERE id = ?
    `, category, question, question_kn || '', answer, answer_kn || '', status || 'published', nowIso, req.params.id);

    realtimeService.broadcast('FAQ_MUTATED', { action: 'UPDATED', faqId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 8. BULK ENQUIRIES
// -------------------------------------------------------------
app.get('/api/v1/bulk-enquiries', (req, res) => {
  try {
    const enquiries = db.queryAll('SELECT * FROM bulk_enquiries ORDER BY created_at DESC');
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/bulk-enquiries', (req, res) => {
  try {
    const {
      institutionName, contactPerson, designation, email, phone,
      city, state, pincode, estimatedCopies, estimatedBudget, requirementDetails
    } = req.body;

    const id = `bulk-${Date.now().toString().slice(-4)}`;
    const nowIso = new Date().toISOString();

    db.run(`
      INSERT INTO bulk_enquiries (
        id, institution_name, contact_person, designation, email, phone,
        city, state, pincode, estimated_copies, estimated_budget, requirement_details,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)
    `,
      id, institutionName, contactPerson, designation || '', email, phone,
      city, state || 'Karnataka', pincode, estimatedCopies || 0, estimatedBudget || 0, requirementDetails || '',
      nowIso, nowIso
    );

    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 9. ADMIN DASHBOARD & AUDIT LOGS
// -------------------------------------------------------------
app.get('/api/v1/admin/dashboard', (req, res) => {
  try {
    const totalOrders = db.queryOne('SELECT COUNT(*) as c FROM orders').c;
    const totalRevenue = db.queryOne("SELECT SUM(grand_total) as s FROM orders WHERE status != 'cancelled'").s || 0;
    const pendingOrders = db.queryOne("SELECT COUNT(*) as c FROM orders WHERE status IN ('pending_payment', 'confirmed', 'processing')").c;
    const totalTitles = db.queryOne("SELECT COUNT(*) as c FROM books WHERE status = 'published'").c;
    const lowStockCount = db.queryOne('SELECT COUNT(*) as c FROM inventory WHERE available_stock <= low_stock_threshold').c;

    const recentOrders = db.queryAll('SELECT * FROM orders ORDER BY created_at DESC LIMIT 6');

    res.json({
      success: true,
      metrics: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        pendingOrders,
        totalTitles,
        lowStockCount,
        recentOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/admin/audit-logs', (req, res) => {
  try {
    const logs = db.queryAll('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] JSS Publications Production API running on http://localhost:${PORT}`);
    console.log(`[server] Realtime SSE stream active at http://localhost:${PORT}/api/v1/realtime`);
  });
}

export default app;
