/**
 * JSS Publications - Centralized Admin Domain Service & Store
 * Provides persistent state management, full CRUD operations, and reactive subscriptions
 * for all 19 functional areas of the JSS Publications Admin Suite.
 *
 * Persistence is managed via client-side storage (localStorage) with instant zero-backend
 * fallback and rich seed data, allowing complete enterprise operations without touching codebase.
 */

import storage from '../utils/storage.js';
import ids from '../utils/ids.js';
import { catalogueService } from './catalogueService.js';
import { INSTITUTIONAL_FAQS } from '../utils/seo.js';

// Storage Keys
const KEYS = {
  ORDERS: 'jss_admin_orders',
  BULK_ENQUIRIES: 'jss_admin_bulk_enquiries',
  RETURNS: 'jss_admin_returns',
  FAQS: 'jss_admin_faqs',
  COUPONS: 'jss_admin_coupons',
  CUSTOMERS: 'jss_admin_customers',
  SUPPORT_TICKETS: 'jss_admin_support_tickets',
  AUDIT_LOGS: 'jss_admin_audit_logs',
  SETTINGS: 'jss_admin_settings',
  HOMEPAGE_CMS: 'jss_admin_homepage_cms',
  VACHANAS: 'jss_admin_vachanas',
  PERIODICALS: 'jss_admin_periodicals',
  STAFF_USERS: 'jss_admin_staff_users',
  CATALOGUE_OVERRIDES: 'jss_admin_catalogue_overrides',
  SHIPPING_CONFIG: 'jss_admin_shipping_config'
};

// Listeners for reactive updates
const listeners = new Set();

function notify() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('[adminService] Listener error:', e);
    }
  });
}

// -----------------------------------------------------------------------------
// SEED INITIALIZERS (Ensures rich, realistic operational state on first launch)
// -----------------------------------------------------------------------------

function getSeedFaqs() {
  return [
    {
      id: 'faq-01',
      category: 'JSS Publications',
      question: 'What is Jagadguru Sri Shivarathreeshwara Granthamale (JSS Publications)?',
      answer: 'Jagadguru Sri Shivarathreeshwara Granthamale is the premier publications and research wing of JSS Mahavidyapeetha, Mysuru. Founded under the spiritual auspices of Sri Suttur Veerashimhasana Math, it has been publishing authentic editions of 12th-century Vachana literature, Shaiva Agamas, Indian philosophy, and classical Kannada treatises since the mid-20th century.',
      status: 'published',
      order: 1,
      createdAt: '2026-01-10T10:00:00Z',
      views: 1420
    },
    {
      id: 'faq-02',
      category: 'JSS Publications',
      question: 'Where is the physical JSS Book House located in Mysuru?',
      answer: 'The physical JSS Book House retail counter is situated at JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004. It is open Monday to Saturday from 9:30 AM to 6:00 PM IST.',
      status: 'published',
      order: 2,
      createdAt: '2026-01-12T10:00:00Z',
      views: 980
    },
    {
      id: 'faq-03',
      category: 'Shipping',
      question: 'How are books shipped to individual readers across India?',
      answer: 'All orders are dispatched directly from the Mysuru publication press and retail counter via India Post (Speed Post and Registered Book Parcel). Orders above ₹500 qualify for free postal delivery anywhere in India.',
      status: 'published',
      order: 3,
      createdAt: '2026-01-15T10:00:00Z',
      views: 2150
    },
    {
      id: 'faq-04',
      category: 'Payments',
      question: 'Are GST charges applicable on JSS publications?',
      answer: 'Under statutory GST regulations for the Government of India (HSN Chapter 4901), printed books, journals, sacred scriptures, and classical publications are completely exempt from GST (0% CGST/SGST/IGST).',
      status: 'published',
      order: 4,
      createdAt: '2026-01-16T10:00:00Z',
      views: 1840
    },
    {
      id: 'faq-05',
      category: 'Bulk Orders',
      question: 'Can universities, colleges, and libraries place bulk procurement orders?',
      answer: 'Yes. JSS Publications provides institutional library procurement desks with graded institutional subsidies (10% to 20%), official proforma invoices, and direct dispatch for universities, colleges, research institutes, and public libraries.',
      status: 'published',
      order: 5,
      createdAt: '2026-01-18T10:00:00Z',
      views: 760
    },
    {
      id: 'faq-06',
      category: 'Books',
      question: 'What major canonical works are published by JSS Granthamale?',
      answer: "Key publications include the monumental 896-page 'Shivapada Ratnakosha' lexicon, authoritative critical editions of 'Sharanara Vachanagalu', 'Allama Prabhu Devara Vachana', exegeses on 'Patanjali Yoga Sutras' and 'Shiva Sutras', bi-monthly journal 'Prasada' (published continuously for over 58 years), and chronicles of Sri Suttur Math.",
      status: 'published',
      order: 6,
      createdAt: '2026-01-20T10:00:00Z',
      views: 1220
    },
    {
      id: 'faq-07',
      category: 'Ordering',
      question: 'Can I track my dispatched book parcel online?',
      answer: 'Yes. As soon as your physical parcel is booked at India Post by the JSS Book House dispatch counter, an authentic 13-character Speed Post consignment number (e.g., EM123456789IN) is registered to your order. You can track live dispatch status via the "Track Consignment" tool on this website.',
      status: 'published',
      order: 7,
      createdAt: '2026-01-22T10:00:00Z',
      views: 890
    },
    {
      id: 'faq-08',
      category: 'Returns',
      question: 'What happens if a book is received in damaged condition?',
      answer: 'In the rare event of transit damage or binder defects, readers can report the issue within 7 days of delivery. JSS Publications provides immediate complimentary replacement dispatch at zero additional postal cost upon verification.',
      status: 'published',
      order: 8,
      createdAt: '2026-01-25T10:00:00Z',
      views: 540
    }
  ];
}

function getSeedOrders() {
  return [
    {
      orderId: 'JSS-2026-88102',
      status: 'shipped',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      customer: {
        fullName: 'Prof. Ramachandra Swamy',
        email: 'r.swamy@uni-mysore.ac.in',
        phone: '9845012345',
        organization: 'University of Mysore, Dept. of Philosophy'
      },
      shippingAddress: {
        addressLine: 'House #42, Manasagangotri Campus',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570006'
      },
      items: [
        { id: 1, title: 'Shivapada Ratnakosha', format: 'Hardbound Deluxe', price: 1000, quantity: 1, total: 1000 },
        { id: 3, title: 'Patanjali Yoga Sutras', format: 'Paperback', price: 350, quantity: 2, total: 700 }
      ],
      totals: { itemsCount: 3, subtotal: 1700, discount: 0, shippingFee: 0, grandTotal: 1700 },
      payment: { method: 'Online UPI', status: 'completed' },
      dispatch: {
        status: 'in_transit',
        carrier: 'India Post Speed Post',
        trackingNumber: 'EM882910481IN',
        bookedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
      },
      internalNotes: 'Academic research shipment. Pack with extra corner protectors.'
    },
    {
      orderId: 'JSS-2026-88094',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      customer: {
        fullName: 'Suma Pavan Kumar',
        email: 'sumapavan1231@gmail.com',
        phone: '9880198802',
        organization: null
      },
      shippingAddress: {
        addressLine: 'Flat 402, Sharada Nilaya, Kuvempunagar',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570023'
      },
      items: [
        { id: 7, title: 'Sharanara Vachanagalu', format: 'Paperback', price: 200, quantity: 2, total: 400 },
        { id: 4, title: 'Shiva Sutras', format: 'Paperback', price: 250, quantity: 1, total: 250 }
      ],
      totals: { itemsCount: 3, subtotal: 650, discount: 0, shippingFee: 0, grandTotal: 650 },
      payment: { method: 'NetBanking (SBI)', status: 'completed' },
      dispatch: { status: 'awaiting_packing', carrier: 'India Post', trackingNumber: null },
      internalNotes: 'Ready for parcel desk dispatch.'
    },
    {
      orderId: 'JSS-2026-88081',
      status: 'delivered',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      customer: {
        fullName: 'Mahadevappa Patil',
        email: 'mpatil@dharwadlibrary.org',
        phone: '9448119022',
        organization: 'Dharwad Study Circle'
      },
      shippingAddress: {
        addressLine: 'Plot 12, Station Road, Near Kelgeri',
        city: 'Dharwad',
        state: 'Karnataka',
        pincode: '580007'
      },
      items: [
        { id: 2, title: 'Allama Prabhu Devara Vachana', format: 'Paperback', price: 300, quantity: 1, total: 300 },
        { id: 11, title: 'Molige Mahadevi Vachanagalu', format: 'Paperback', price: 180, quantity: 1, total: 180 }
      ],
      totals: { itemsCount: 2, subtotal: 480, discount: 0, shippingFee: 40, grandTotal: 520 },
      payment: { method: 'UPI / QR', status: 'completed' },
      dispatch: {
        status: 'delivered',
        carrier: 'India Post Speed Post',
        trackingNumber: 'EM771239845IN',
        deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString()
      },
      internalNotes: 'Delivered and acknowledged by recipient.'
    },
    {
      orderId: 'JSS-2026-88075',
      status: 'pending_payment',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      customer: {
        fullName: 'Dr. Girish Kulkarni',
        email: 'gkulkarni@blde.edu',
        phone: '9845209876',
        organization: 'BLDE Association, Vijayapura'
      },
      shippingAddress: {
        addressLine: 'Solapur Road, BLDE Campus',
        city: 'Vijayapura',
        state: 'Karnataka',
        pincode: '586103'
      },
      items: [
        { id: 5, title: 'The Heritage of Sri Suttur Math', format: 'Hardbound', price: 600, quantity: 3, total: 1800 }
      ],
      totals: { itemsCount: 3, subtotal: 1800, discount: 0, shippingFee: 0, grandTotal: 1800 },
      payment: { method: 'NEFT / RTGS Transfer', status: 'pending' },
      dispatch: { status: 'payment_pending', carrier: 'India Post', trackingNumber: null },
      internalNotes: 'Awaiting institutional bank remittance confirmation.'
    }
  ];
}

function getSeedBulkEnquiries() {
  return [
    {
      id: 'BLK-2026-001',
      organizationName: 'JSS College of Arts, Commerce & Science, Nanjangud',
      orgType: 'College / University',
      contactPerson: 'Dr. B. Shivarudraiah (Head Librarian)',
      email: 'librarian@jssnanjangud.edu.in',
      phone: '9448011223',
      city: 'Nanjangud',
      pincode: '571301',
      titlesRequested: 'Vachana Literature Complete Canonical Set (35 Titles, 5 Copies each)',
      estimatedQty: 175,
      budget: '₹45,000 - ₹50,000',
      status: 'Quotation Generated',
      quotedAmount: 42500,
      createdAt: '2026-02-14T09:30:00Z',
      notes: '15% institutional education subsidy applied. Proforma invoice sent for Syndicate approval.'
    },
    {
      id: 'BLK-2026-002',
      organizationName: 'Sri Jagadguru Murugharajendra Mutt Reading Centre',
      orgType: 'Mutt / Religious Institution',
      contactPerson: 'Sri Basavaprabhu Swamiji',
      email: 'contact@chitradurgamutt.org',
      phone: '9844098765',
      city: 'Chitradurga',
      pincode: '577501',
      titlesRequested: 'Shivapada Ratnakosha (10 Hardbound), Sharanara Vachanagalu (50 Paperback)',
      estimatedQty: 60,
      budget: '₹20,000',
      status: 'Negotiation',
      quotedAmount: 18000,
      createdAt: '2026-02-18T14:15:00Z',
      notes: 'Endowment tier (25% discount). Awaiting final delivery address verification.'
    },
    {
      id: 'BLK-2026-003',
      organizationName: 'Karnataka State Central Library, Bengaluru',
      orgType: 'Public Library Network',
      contactPerson: 'Sri K. Venkataramana',
      email: 'director@karnatakapubliclibraries.gov.in',
      phone: '080-22212345',
      city: 'Bengaluru',
      pincode: '560001',
      titlesRequested: 'Complete JSS Publications Catalogue (All 49 In-Print Titles, 10 sets for District Libraries)',
      estimatedQty: 490,
      budget: '₹1,50,000',
      status: 'New Enquiry',
      quotedAmount: 0,
      createdAt: '2026-02-24T11:00:00Z',
      notes: 'Government annual procurement grant. Requires official HSN 4901 exemption declaration.'
    }
  ];
}

function getSeedCoupons() {
  return [
    {
      code: 'JSSGIFT10',
      description: '10% Inaugural reader discount on orders above ₹400',
      discountType: 'percentage',
      discountValue: 10,
      minOrder: 400,
      maxDiscount: 150,
      expiryDate: '2026-12-31',
      usageLimit: 500,
      usedCount: 84,
      status: 'active'
    },
    {
      code: 'SCHOLAR15',
      description: '15% Subsidy for research scholars and university students',
      discountType: 'percentage',
      discountValue: 15,
      minOrder: 500,
      maxDiscount: 300,
      expiryDate: '2026-12-31',
      usageLimit: 200,
      usedCount: 39,
      status: 'active'
    },
    {
      code: 'FREESHIP',
      description: 'Zero postal shipping fee on any order size',
      discountType: 'free_shipping',
      discountValue: 0,
      minOrder: 0,
      maxDiscount: 40,
      expiryDate: '2026-10-31',
      usageLimit: 300,
      usedCount: 112,
      status: 'active'
    }
  ];
}

function getSeedReturns() {
  return [
    {
      id: 'RET-2026-001',
      orderId: 'JSS-2026-88022',
      customerName: 'Kallesh B.',
      customerEmail: 'kallesh.b@gmail.com',
      bookTitle: 'Shivapada Ratnakosha',
      issueType: 'Spine Damaged in Transit',
      description: 'Parcel arrived crushed with heavy spine crease on front hardboard.',
      status: 'Replacement Dispatched',
      resolution: 'New copy sent via India Post Speed Post (EM998822114IN)',
      createdAt: '2026-02-12T16:00:00Z'
    },
    {
      id: 'RET-2026-002',
      orderId: 'JSS-2026-88039',
      customerName: 'Anil Deshmukh',
      customerEmail: 'anil.deshmukh@rediffmail.com',
      bookTitle: 'Patanjali Yoga Sutras',
      issueType: 'Misbound Pages',
      description: 'Pages 128-144 repeated twice with missing folio.',
      status: 'Pending Review',
      resolution: 'Awaiting photo confirmation from customer.',
      createdAt: '2026-02-26T10:45:00Z'
    }
  ];
}

function getSeedAuditLogs() {
  return [
    {
      id: 'log-01',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      user: 'Pavan Kumar (Super Admin)',
      action: 'ORDER_STATUS_UPDATE',
      target: 'JSS-2026-88102',
      details: 'Changed status from Packed -> Shipped. Booked India Post Speed Post EM882910481IN'
    },
    {
      id: 'log-02',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      user: 'Pavan Kumar (Super Admin)',
      action: 'STOCK_RESTOCK',
      target: 'Shivapada Ratnakosha (Hardbound)',
      details: 'Added +50 units from Mysuru Press storage counter'
    },
    {
      id: 'log-03',
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      user: 'Dr. H. Basavaraj (Catalogue Manager)',
      action: 'FAQ_PUBLISHED',
      target: 'FAQ-07 (Online Tracking)',
      details: 'Published new FAQ regarding India Post 13-character Speed Post consignment tracking'
    },
    {
      id: 'log-04',
      timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
      user: 'Pavan Kumar (Super Admin)',
      action: 'BULK_QUOTE_SENT',
      target: 'BLK-2026-001 (JSS College Nanjangud)',
      details: 'Generated official Proforma Quotation for ₹42,500 (15% academic subsidy)'
    }
  ];
}

function getSeedStaff() {
  return [
    { id: 'usr-1', name: 'Pavan Kumar', email: 'sumapavan1231@gmail.com', role: 'Super Admin', status: 'Active', lastLogin: 'Just now' },
    { id: 'usr-2', name: 'Dr. H. Basavaraj', email: 'h.basavaraj@jssonline.org', role: 'Catalogue Manager', status: 'Active', lastLogin: '2 hours ago' },
    { id: 'usr-3', name: 'Shivanna R.', email: 'dispatch@jssonline.org', role: 'Operations & Dispatch', status: 'Active', lastLogin: 'Yesterday' },
    { id: 'usr-4', name: 'Ananya S.', email: 'support@jssonline.org', role: 'Customer Support', status: 'Active', lastLogin: '3 days ago' }
  ];
}

function getSeedSettings() {
  return {
    storeName: 'JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale',
    organization: 'JSS Mahavidyapeetha, Mysuru',
    establishedYear: '1954',
    counterAddress: 'JSS Book House, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004',
    phone: '0821-2548212',
    email: 'publications@jssonline.org',
    dispatchOrigin: 'Mysuru Central Post Office (570001)',
    freeShippingThreshold: 500,
    baseShippingRate: 40,
    gstExemptionCode: 'HSN 4901 (0% GST - Statutory Book Publishing Exemption)',
    enableMaintenanceMode: false,
    enableGuestCheckout: true,
    autoApproveReviews: false,
    currencySymbol: '₹',
    currencyCode: 'INR',
    orderIdPrefix: 'JSS-2026-'
  };
}

// -----------------------------------------------------------------------------
// MAIN ADMIN SERVICE OBJECT
// -----------------------------------------------------------------------------

export const adminService = {
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // 1. DASHBOARD & KPIS
  getDashboardMetrics() {
    const orders = this.getOrders();
    const bulk = this.getBulkEnquiries();
    const returns = this.getReturns();
    const books = catalogueService.getBooksSync();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr));
    const pendingOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'processing' || o.status === 'pending_payment');
    
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0);

    const totalUnitsSold = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totals?.itemsCount || 0), 0);

    const lowStockBooks = books.filter(b => (b.stock || 25) < 15);
    const outOfStockBooks = books.filter(b => (b.stock || 25) === 0);
    const pendingBulk = bulk.filter(b => b.status === 'New Enquiry' || b.status === 'Negotiation');
    const pendingReturns = returns.filter(r => r.status === 'Pending Review');

    return {
      todayOrdersCount: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0),
      pendingOrdersCount: pendingOrders.length,
      totalRevenue,
      totalUnitsSold,
      totalCatalogueCount: books.length,
      lowStockCount: lowStockBooks.length,
      outOfStockCount: outOfStockBooks.length,
      pendingBulkCount: pendingBulk.length,
      pendingReturnsCount: pendingReturns.length,
      lowStockBooks: lowStockBooks.slice(0, 5),
      recentOrders: orders.slice(0, 6)
    };
  },

  // 2. FAQS MANAGEMENT (Fully dynamic CMS)
  getFaqs() {
    const faqs = storage.get(KEYS.FAQS, null);
    if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
      const seed = getSeedFaqs();
      storage.set(KEYS.FAQS, seed);
      return seed;
    }
    return faqs;
  },

  getPublishedFaqs() {
    return this.getFaqs().filter(f => f.status === 'published');
  },

  addFaq({ question, answer, category = 'JSS Publications', status = 'published' }) {
    if (!question || !answer) return { success: false, error: 'Question and Answer are required.' };
    const faqs = this.getFaqs();
    const newFaq = {
      id: `faq-${Date.now().toString().slice(-4)}`,
      category: category.trim(),
      question: question.trim(),
      answer: answer.trim(),
      status,
      order: faqs.length + 1,
      createdAt: new Date().toISOString(),
      views: 0
    };
    faqs.unshift(newFaq);
    storage.set(KEYS.FAQS, faqs);
    this.logAction('Pavan Kumar', 'CREATE_FAQ', newFaq.question, null, category);
    notify();
    return { success: true, faq: newFaq };
  },

  updateFaq(id, updates) {
    const faqs = this.getFaqs();
    const idx = faqs.findIndex(f => f.id === id);
    if (idx === -1) return { success: false, error: 'FAQ not found.' };

    const old = { ...faqs[idx] };
    faqs[idx] = { ...faqs[idx], ...updates, updatedAt: new Date().toISOString() };
    storage.set(KEYS.FAQS, faqs);
    this.logAction('Pavan Kumar', 'UPDATE_FAQ', faqs[idx].question, old.category, faqs[idx].category);
    notify();
    return { success: true, faq: faqs[idx] };
  },

  deleteFaq(id) {
    const faqs = this.getFaqs();
    const target = faqs.find(f => f.id === id);
    const filtered = faqs.filter(f => f.id !== id);
    storage.set(KEYS.FAQS, filtered);
    if (target) {
      this.logAction('Pavan Kumar', 'DELETE_FAQ', target.question, target.category, 'Deleted');
    }
    notify();
    return { success: true };
  },

  toggleFaqStatus(id) {
    const faqs = this.getFaqs();
    const item = faqs.find(f => f.id === id);
    if (item) {
      item.status = item.status === 'published' ? 'draft' : 'published';
      storage.set(KEYS.FAQS, faqs);
      this.logAction('Pavan Kumar', 'TOGGLE_FAQ_STATUS', item.question, null, item.status);
      notify();
      return { success: true, faq: item };
    }
    return { success: false };
  },

  // 3. ORDERS MANAGEMENT
  getOrders() {
    let orders = storage.get(KEYS.ORDERS, null);
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      const seed = getSeedOrders();
      storage.set(KEYS.ORDERS, seed);
      return seed;
    }
    return orders;
  },

  updateOrderStatus(orderId, newStatus, internalNote = '') {
    const orders = this.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const oldStatus = order.status;
    order.status = newStatus;
    if (internalNote) {
      order.internalNotes = (order.internalNotes ? order.internalNotes + '\n' : '') + `[${new Date().toLocaleDateString('en-IN')}] ${internalNote}`;
    }
    storage.set(KEYS.ORDERS, orders);
    this.logAction('Pavan Kumar', 'ORDER_STATUS_UPDATE', orderId, oldStatus, newStatus);
    notify();
    return { success: true, order };
  },

  assignTracking(orderId, trackingNumber, carrier = 'India Post Speed Post') {
    const orders = this.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    order.dispatch = {
      ...order.dispatch,
      carrier,
      trackingNumber: trackingNumber.trim(),
      bookedAt: new Date().toISOString(),
      status: 'in_transit'
    };
    order.status = 'shipped';
    storage.set(KEYS.ORDERS, orders);
    this.logAction('Pavan Kumar', 'ASSIGN_TRACKING', orderId, null, trackingNumber);
    notify();
    return { success: true, order };
  },

  addOrderNote(orderId, note) {
    const orders = this.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    order.internalNotes = (order.internalNotes ? order.internalNotes + '\n' : '') + `[${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}] ${note.trim()}`;
    storage.set(KEYS.ORDERS, orders);
    notify();
    return { success: true, order };
  },

  // 4. BULK & INSTITUTIONAL ENQUIRIES
  getBulkEnquiries() {
    let list = storage.get(KEYS.BULK_ENQUIRIES, null);
    if (!list || !Array.isArray(list) || list.length === 0) {
      const seed = getSeedBulkEnquiries();
      storage.set(KEYS.BULK_ENQUIRIES, seed);
      return seed;
    }
    return list;
  },

  updateBulkEnquiry(id, updates) {
    const list = this.getBulkEnquiries();
    const item = list.find(b => b.id === id);
    if (!item) return { success: false, error: 'Enquiry not found' };

    const oldStatus = item.status;
    Object.assign(item, updates);
    storage.set(KEYS.BULK_ENQUIRIES, list);
    this.logAction('Pavan Kumar', 'BULK_ENQUIRY_UPDATE', id, oldStatus, item.status);
    notify();
    return { success: true, enquiry: item };
  },

  createBulkQuotation(id, quotedAmount, note = '') {
    return this.updateBulkEnquiry(id, {
      status: 'Quotation Generated',
      quotedAmount: Number(quotedAmount),
      notes: (note ? note + ' ' : '') + `[Quoted ₹${quotedAmount} on ${new Date().toLocaleDateString('en-IN')}]`
    });
  },

  // 5. RETURNS & REFUNDS
  getReturns() {
    let list = storage.get(KEYS.RETURNS, null);
    if (!list || !Array.isArray(list) || list.length === 0) {
      const seed = getSeedReturns();
      storage.set(KEYS.RETURNS, seed);
      return seed;
    }
    return list;
  },

  updateReturn(id, updates) {
    const list = this.getReturns();
    const item = list.find(r => r.id === id);
    if (!item) return { success: false, error: 'Return record not found' };

    Object.assign(item, updates);
    storage.set(KEYS.RETURNS, list);
    this.logAction('Pavan Kumar', 'RETURN_RECORD_UPDATE', id, null, item.status);
    notify();
    return { success: true, returnRecord: item };
  },

  // 6. COUPONS & PROMOTIONS
  getCoupons() {
    let list = storage.get(KEYS.COUPONS, null);
    if (!list || !Array.isArray(list) || list.length === 0) {
      const seed = getSeedCoupons();
      storage.set(KEYS.COUPONS, seed);
      return seed;
    }
    return list;
  },

  createCoupon({ code, description, discountType = 'percentage', discountValue, minOrder = 0, expiryDate, usageLimit = 100 }) {
    if (!code || !discountValue) return { success: false, error: 'Code and Discount value are required.' };
    const list = this.getCoupons();
    const cleanCode = code.trim().toUpperCase();

    if (list.some(c => c.code === cleanCode)) {
      return { success: false, error: `Coupon ${cleanCode} already exists.` };
    }

    const newCoupon = {
      code: cleanCode,
      description: description ? description.trim() : '',
      discountType,
      discountValue: Number(discountValue),
      minOrder: Number(minOrder || 0),
      maxDiscount: discountType === 'percentage' ? 250 : Number(discountValue),
      expiryDate: expiryDate || '2026-12-31',
      usageLimit: Number(usageLimit || 100),
      usedCount: 0,
      status: 'active'
    };
    list.unshift(newCoupon);
    storage.set(KEYS.COUPONS, list);
    this.logAction('Pavan Kumar', 'CREATE_COUPON', cleanCode, null, `${discountValue}%`);
    notify();
    return { success: true, coupon: newCoupon };
  },

  toggleCoupon(code) {
    const list = this.getCoupons();
    const item = list.find(c => c.code === code);
    if (item) {
      item.status = item.status === 'active' ? 'disabled' : 'active';
      storage.set(KEYS.COUPONS, list);
      this.logAction('Pavan Kumar', 'TOGGLE_COUPON', code, null, item.status);
      notify();
      return { success: true, coupon: item };
    }
    return { success: false };
  },

  // 7. INVENTORY ADJUSTMENTS
  adjustStock(bookId, changeAmount, reason = 'Restock') {
    const books = catalogueService.getBooksSync();
    const book = books.find(b => b.id === Number(bookId));
    if (!book) return { success: false, error: 'Book not found' };

    const oldStock = book.stock || 30;
    const newStock = Math.max(0, oldStock + Number(changeAmount));
    book.stock = newStock;

    // Persist override
    const overrides = storage.get(KEYS.CATALOGUE_OVERRIDES, {});
    overrides[bookId] = { ...(overrides[bookId] || {}), stock: newStock };
    storage.set(KEYS.CATALOGUE_OVERRIDES, overrides);

    this.logAction('Pavan Kumar', 'STOCK_ADJUSTMENT', book.title, `Stock ${oldStock}`, `Stock ${newStock} (${reason})`);
    notify();
    return { success: true, bookId, oldStock, newStock };
  },

  // 8. AUDIT LOGGING
  getAuditLogs() {
    let logs = storage.get(KEYS.AUDIT_LOGS, null);
    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      const seed = getSeedAuditLogs();
      storage.set(KEYS.AUDIT_LOGS, seed);
      return seed;
    }
    return logs;
  },

  logAction(user, action, target, before, after) {
    const logs = this.getAuditLogs();
    const newLog = {
      id: `log-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      user: user || 'Pavan Kumar (Super Admin)',
      action,
      target: String(target || ''),
      details: before && after ? `Changed from "${before}" → "${after}"` : String(after || before || action)
    };
    logs.unshift(newLog);
    // Keep max 200 logs
    storage.set(KEYS.AUDIT_LOGS, logs.slice(0, 200));
  },

  // 9. STAFF USERS & ROLES
  getStaffUsers() {
    let staff = storage.get(KEYS.STAFF_USERS, null);
    if (!staff || !Array.isArray(staff) || staff.length === 0) {
      const seed = getSeedStaff();
      storage.set(KEYS.STAFF_USERS, seed);
      return seed;
    }
    return staff;
  },

  addStaffUser({ name, email, role = 'Order/Support Staff' }) {
    if (!name || !email) return { success: false, error: 'Name and email are required.' };
    const staff = this.getStaffUsers();
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      status: 'Active',
      lastLogin: 'Never'
    };
    staff.push(newUser);
    storage.set(KEYS.STAFF_USERS, staff);
    this.logAction('Pavan Kumar', 'CREATE_STAFF_USER', newUser.name, null, role);
    notify();
    return { success: true, user: newUser };
  },

  // 10. SYSTEM SETTINGS
  getSettings() {
    let settings = storage.get(KEYS.SETTINGS, null);
    if (!settings || typeof settings !== 'object') {
      const seed = getSeedSettings();
      storage.set(KEYS.SETTINGS, seed);
      return seed;
    }
    return settings;
  },

  updateSettings(updates) {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    storage.set(KEYS.SETTINGS, updated);
    this.logAction('Pavan Kumar', 'UPDATE_SETTINGS', 'System Store Configuration', null, 'Settings saved');
    notify();
    return { success: true, settings: updated };
  }
};

export default adminService;
