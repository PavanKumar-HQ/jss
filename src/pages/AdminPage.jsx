import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Building2,
  BookOpen,
  Boxes,
  Ticket,
  Home,
  HelpCircle,
  Newspaper,
  Headphones,
  Sliders,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Save,
  Check,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Sparkles,
  ChevronRight,
  Filter,
  Users,
  Copy,
  Lock,
  LogOut,
  Loader2,
  User
} from 'lucide-react';
import { adminService, catalogueService } from '../services';
import { apiClient } from '../services/apiClient.js';
import { realtimeClient } from '../services/realtimeClient.js';
import jssLogo from '../assets/jss-logo.webp';

export function normalizeOrder(o) {
  if (!o) return null;
  const orderId = o.orderId || o.order_reference || o.orderReference || o.id || 'JSS-ORD';
  const customerName = o.customer?.fullName || o.customerName || o.customer_name || 'Valued Reader';
  const phone = o.customer?.phone || o.customerPhone || o.customer_phone || '';
  const email = o.customer?.email || o.customerEmail || o.customer_email || '';
  const addressLine = o.shippingAddress?.addressLine || o.shipping_address_line || o.address || 'Direct Dispatch';
  const city = o.shippingAddress?.city || o.city || 'Mysuru';
  const state = o.shippingAddress?.state || o.state || 'Karnataka';
  const pincode = o.shippingAddress?.pincode || o.pincode || '';
  const paymentMethod = o.payment?.method || o.payment_method || o.paymentMethod || 'Online Payment';
  const paymentStatus = o.payment?.status || o.payment_status || (o.status === 'confirmed' ? 'Completed' : 'Pending');
  const grandTotal = Number(o.totals?.grandTotal ?? o.total_amount ?? o.grandTotal ?? 0);
  const trackingNumber = o.dispatch?.trackingNumber || o.tracking_number || o.trackingNumber || null;
  const items = Array.isArray(o.items)
    ? o.items.map(it => ({
        ...it,
        title: it.title || it.book_title || it.bookTitle || 'Publication Title',
        quantity: Number(it.quantity || 1),
        price: Number(it.price || it.unit_price || it.unitPrice || 0)
      }))
    : [];
  const createdAt = o.createdAt || o.created_at || new Date().toISOString();
  const status = o.status || 'confirmed';

  return {
    ...o,
    orderId,
    customer: {
      fullName: customerName,
      phone,
      email
    },
    shippingAddress: {
      addressLine,
      city,
      state,
      pincode
    },
    payment: {
      method: paymentMethod,
      status: paymentStatus
    },
    totals: {
      grandTotal
    },
    dispatch: {
      trackingNumber
    },
    items,
    createdAt,
    status
  };
}

export default function AdminPage({ onNavigate }) {
  // Administrator Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('jss_admin_auth') === 'true';
    }
    return false;
  });
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStepMessage, setAuthStepMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthenticating(true);
    setAuthStepMessage('Verifying administrative credentials...');

    setTimeout(() => {
      setAuthStepMessage('Connecting to authoritative JSS Granthamale SQLite 3 database...');
      setTimeout(() => {
        if (usernameInput.trim().toLowerCase() === 'admin' && passwordInput === '12345') {
          sessionStorage.setItem('jss_admin_auth', 'true');
          setIsAuthenticated(true);
          setIsAuthenticating(false);
          setToastMessage('Authenticated successfully as JSS Granthamale Administrator.');
        } else {
          setIsAuthenticating(false);
          setLoginError('Invalid credentials. Please enter username: "admin" and password: "12345".');
        }
      }, 500);
    }, 450);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jss_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
    setLoginError('');
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Real Domain Store State
  const [metrics, setMetrics] = useState(() => adminService.getDashboardMetrics());
  const [orders, setOrders] = useState(() => adminService.getOrders().map(normalizeOrder));
  const [bulkEnquiries, setBulkEnquiries] = useState(() => adminService.getBulkEnquiries());
  const [books, setBooks] = useState(() => catalogueService.getBooksSync());
  const [periodicals, setPeriodicals] = useState(() => adminService.getPeriodicals());
  const [homepageCms, setHomepageCms] = useState(() => adminService.getHomepageCms());
  const [faqs, setFaqs] = useState(() => adminService.getFaqs());
  const [coupons, setCoupons] = useState(() => adminService.getCoupons());
  const [supportTickets, setSupportTickets] = useState(() => adminService.getSupportTickets());
  const [staffUsers, setStaffUsers] = useState(() => adminService.getStaffUsers());
  const [settings, setSettings] = useState(() => adminService.getSettings());

  // Filter & Search States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [bulkStatusFilter, setBulkStatusFilter] = useState('All');
  const [bookSearch, setBookSearch] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('All');
  const [bookStatusFilter, setBookStatusFilter] = useState('All');
  const [inventoryOnlyLowStock, setInventoryOnlyLowStock] = useState(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState('All');
  const [cmsActiveTab, setCmsActiveTab] = useState('hero');

  // Modal & Detail States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTrackingInput, setOrderTrackingInput] = useState('');
  const [invoicePrintOrder, setInvoicePrintOrder] = useState(null);
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStockBook, setSelectedStockBook] = useState(null);
  const [stockAdjustAmount, setStockAdjustAmount] = useState(10);
  const [stockReason, setStockReason] = useState('Mysuru Press Counter Restock');
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedPriceBook, setSelectedPriceBook] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState('');
  const [priceChangeReason, setPriceChangeReason] = useState('Reprint price adjustment');
  const [isNewPeriodicalModalOpen, setIsNewPeriodicalModalOpen] = useState(false);
  const [isNewFaqModalOpen, setIsNewFaqModalOpen] = useState(false);
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Confirmation Safety Modal
  const [safetyModal, setSafetyModal] = useState({
    isOpen: false,
    title: '',
    consequence: '',
    reason: '',
    confirmLabel: 'Confirm Action',
    onConfirm: null
  });

  // Reactive subscription to adminService events & Backend Server SSE Stream
  useEffect(() => {
    const unsubLocal = adminService.subscribe(() => {
      setMetrics(adminService.getDashboardMetrics());
      setOrders(adminService.getOrders().map(normalizeOrder));
      setBulkEnquiries(adminService.getBulkEnquiries());
      setBooks(catalogueService.getBooksSync());
      setPeriodicals(adminService.getPeriodicals());
      setHomepageCms(adminService.getHomepageCms());
      setFaqs(adminService.getFaqs());
      setCoupons(adminService.getCoupons());
      setSupportTickets(adminService.getSupportTickets());
      setStaffUsers(adminService.getStaffUsers());
      setSettings(adminService.getSettings());
    });

    const refreshServerState = async () => {
      try {
        const [serverOrders, serverBooks, serverMetrics, serverFaqs] = await Promise.all([
          apiClient.getOrders().catch(() => null),
          apiClient.getBooks({ status: 'All' }).catch(() => null),
          apiClient.getDashboardMetrics().catch(() => null),
          apiClient.getFaqs().catch(() => null)
        ]);
        if (serverOrders?.length) setOrders(serverOrders.map(normalizeOrder));
        if (serverBooks?.length) setBooks(serverBooks);
        if (serverMetrics) setMetrics(serverMetrics);
        if (serverFaqs?.length) setFaqs(serverFaqs);
      } catch (err) {
        console.warn('[admin] Server sync fallback:', err.message);
      }
    };

    refreshServerState();

    const unsubOrder = realtimeClient.on('ORDER_CREATED', (data) => {
      showToast(`New Order: ${data.orderReference} (${data.itemsCount} copies, ₹${data.grandTotal})`);
      refreshServerState();
    });

    const unsubStatus = realtimeClient.on('ORDER_STATUS_CHANGED', () => refreshServerState());
    const unsubInv = realtimeClient.on('INVENTORY_UPDATED', () => refreshServerState());
    const unsubPrice = realtimeClient.on('PRICE_CHANGED', () => refreshServerState());
    const unsubBook = realtimeClient.on('BOOK_MUTATED', () => refreshServerState());
    const unsubFaq = realtimeClient.on('FAQ_MUTATED', () => refreshServerState());

    return () => {
      unsubLocal();
      unsubOrder();
      unsubStatus();
      unsubInv();
      unsubPrice();
      unsubBook();
      unsubFaq();
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openSafetyModal = ({ title, consequence, onConfirm, confirmLabel = 'Confirm Action' }) => {
    setSafetyModal({
      isOpen: true,
      title,
      consequence,
      reason: '',
      confirmLabel,
      onConfirm
    });
  };

  const handleSafetyConfirm = () => {
    if (!safetyModal.reason || safetyModal.reason.trim().length < 4) {
      alert('A valid operational reason (minimum 4 characters) is mandatory.');
      return;
    }
    if (safetyModal.onConfirm) {
      safetyModal.onConfirm(safetyModal.reason);
    }
    setSafetyModal({ isOpen: false, title: '', consequence: '', reason: '', confirmLabel: '', onConfirm: null });
  };

  // Clean, purposeful 5-group sidebar navigation (10 essential tabs)
  const NAVIGATION_GROUPS = [
    {
      group: 'STORE OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => o.status === 'confirmed').length || null },
        { id: 'bulk-orders', label: 'Bulk Enquiries', icon: Building2, badge: bulkEnquiries.filter(b => b.status === 'New Enquiry').length || null }
      ]
    },
    {
      group: 'PUBLICATIONS & STOCK',
      items: [
        { id: 'books', label: 'Publications Catalogue', icon: BookOpen, badge: books.length },
        { id: 'inventory', label: 'Inventory & Restock', icon: Boxes, badge: metrics.lowStockCount ? `${metrics.lowStockCount} Low` : null, badgeColor: '#D97706' }
      ]
    },
    {
      group: 'PERIODICALS & CONTENT',
      items: [
        { id: 'periodicals', label: 'Periodicals (Suttur Vani)', icon: Newspaper, badge: `${periodicals.length} Issues` },
        { id: 'homepage-cms', label: 'Storefront CMS & FAQs', icon: Home, badge: 'Live' }
      ]
    },
    {
      group: 'MARKETING & SUPPORT',
      items: [
        { id: 'coupons', label: 'Discounts & Coupons', icon: Ticket, badge: coupons.filter(c => c.status === 'active').length || null },
        { id: 'support', label: 'Support Desk', icon: Headphones, badge: supportTickets.filter(t => t.status === 'Open').length || null, badgeColor: '#DC2626' }
      ]
    },
    {
      group: 'CONFIGURATION',
      items: [
        { id: 'settings', label: 'Store & Staff Settings', icon: Sliders, badge: null }
      ]
    }
  ];

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    const q = (orderSearch || '').toLowerCase().trim();
    return (orders || []).map(normalizeOrder).filter(o => {
      if (!o) return false;
      const orderIdStr = (o.orderId || '').toLowerCase();
      const customerNameStr = (o.customer?.fullName || '').toLowerCase();
      const phoneStr = (o.customer?.phone || '');
      const matchesSearch = !q ||
        orderIdStr.includes(q) ||
        customerNameStr.includes(q) ||
        phoneStr.includes(q);
      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Bulk Enquiries
  const filteredBulkEnquiries = useMemo(() => {
    return (bulkEnquiries || []).filter(b => {
      if (!b) return false;
      if (bulkStatusFilter === 'All') return true;
      if (bulkStatusFilter === 'Quoted') return b.status === 'Quoted' || b.status === 'Quotation Generated' || b.status === 'Quotation Sent';
      return b.status === bulkStatusFilter;
    });
  }, [bulkEnquiries, bulkStatusFilter]);

  // Filtered Books
  const filteredBooks = useMemo(() => {
    const q = (bookSearch || '').toLowerCase().trim();
    return (books || []).filter(b => {
      if (!b) return false;
      const title = (b.title || '').toLowerCase();
      const kannadaTitle = (b.kannadaTitle || '').toLowerCase();
      const author = (b.author || '').toLowerCase();
      const matchesQuery = !q ||
        title.includes(q) ||
        kannadaTitle.includes(q) ||
        author.includes(q);
      const matchesCategory = bookCategoryFilter === 'All' || b.category === bookCategoryFilter;
      const status = b.status || 'published';
      const matchesStatus = bookStatusFilter === 'All' || status === bookStatusFilter;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [books, bookSearch, bookCategoryFilter, bookStatusFilter]);

  // Unique Categories
  const categoriesList = useMemo(() => {
    const set = new Set(books.map(b => b.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [books]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    if (!inventoryOnlyLowStock) return books;
    return books.filter(b => (b.stock || 25) < 15);
  }, [books, inventoryOnlyLowStock]);

  // Filtered Support Tickets
  const filteredTickets = useMemo(() => {
    return supportTickets.filter(t => {
      return ticketStatusFilter === 'All' || t.status === ticketStatusFilter;
    });
  }, [supportTickets, ticketStatusFilter]);

  // If administrator is not authenticated, render authentic institutional Login Gate
  if (!isAuthenticated) {
    return (
      <div
        className="admin-login-screen"
        style={{
          minHeight: '100vh',
          width: '100vw',
          backgroundColor: '#FAF7F2',
          backgroundImage: 'radial-gradient(rgba(197, 155, 39, 0.22) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          fontFamily: 'var(--font-sans)',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Return to Public Storefront Top Button */}
        <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', backgroundColor: '#FFFFFF' }}
          >
            <span>← Return to Public Storefront</span>
          </button>
        </div>

        {/* Central Auth Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '430px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid rgba(197, 155, 39, 0.45)',
            borderTop: '5px solid var(--color-maroon)',
            borderRadius: '12px',
            boxShadow: '0 16px 40px rgba(94, 22, 36, 0.12), 0 2px 6px rgba(0,0,0,0.04)',
            padding: '36px 28px',
            boxSizing: 'border-box',
            textAlign: 'center'
          }}
        >
          {/* Institution Crest */}
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              border: '2px solid rgba(197, 155, 39, 0.5)',
              boxShadow: '0 4px 12px rgba(94, 22, 36, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              padding: '4px'
            }}
          >
            <img
              src={jssLogo}
              alt="JSS Publications Emblem Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <span
            style={{
              display: 'inline-block',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--color-maroon)',
              backgroundColor: 'rgba(94, 22, 36, 0.08)',
              padding: '3px 10px',
              borderRadius: '4px',
              marginBottom: '10px'
            }}
          >
            Administrative Console
          </span>

          <h1
            className="text-serif"
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--color-maroon)',
              marginBottom: '4px',
              lineHeight: 1.2
            }}
          >
            JSS PUBLICATIONS
          </h1>

          <p
            className="text-kannada"
            style={{
              fontSize: '0.85rem',
              color: '#8C6708',
              marginBottom: '18px',
              fontWeight: 600
            }}
          >
            ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ · ಮೈಸೂರು
          </p>

          {/* Demo Credentials Helper Notice */}
          <div
            style={{
              backgroundColor: '#FAF5E8',
              border: '1px solid rgba(197, 155, 39, 0.4)',
              borderRadius: '6px',
              padding: '10px 14px',
              marginBottom: '20px',
              textAlign: 'left',
              fontSize: '0.8rem',
              color: '#420D18'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={12} color="#8C6708" />
              <span>Authorized Administrator Login</span>
            </div>
            <div>
              Username: <code style={{ backgroundColor: '#FFFFFF', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>admin</code>
              {' '}· Password: <code style={{ backgroundColor: '#FFFFFF', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>12345</code>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div
              style={{
                backgroundColor: 'rgba(94, 22, 36, 0.1)',
                border: '1px solid var(--color-maroon)',
                color: 'var(--color-maroon)',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '18px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertTriangle size={15} color="var(--color-maroon)" style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-text-charcoal)',
                  marginBottom: '5px'
                }}
              >
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  required
                  disabled={isAuthenticating}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    fontSize: '0.88rem',
                    borderRadius: '6px',
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: isAuthenticating ? '#F5F5F5' : '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <User
                  size={15}
                  color="var(--color-text-muted)"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-text-charcoal)',
                  marginBottom: '5px'
                }}
              >
                Administrator Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter passkey (12345)"
                  required
                  disabled={isAuthenticating}
                  style={{
                    width: '100%',
                    padding: '9px 36px 9px 34px',
                    fontSize: '0.88rem',
                    borderRadius: '6px',
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: isAuthenticating ? '#F5F5F5' : '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Lock
                  size={15}
                  color="var(--color-text-muted)"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '6px',
                cursor: isAuthenticating ? 'wait' : 'pointer'
              }}
            >
              {isAuthenticating ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 0.6s linear infinite' }} />
                  <span>{authStepMessage || 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Authenticate & Enter Console</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ marginTop: '20px', fontSize: '0.72rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '14px' }}>
            <span>JSS Mahavidyapeetha · Mysuru · Authoritative SQLite 3 Store</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-layout-root"
      style={{
        display: 'flex',
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#F8F6F2',
        color: '#1C1917',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1E0408',
            color: '#FFFFFF',
            border: '1px solid #DFBF5F',
            padding: '12px 20px',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={16} color="#DFBF5F" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR - Clean, Focused Navigation */}
      <aside
        className="admin-sidebar"
        style={{
          width: '260px',
          height: '100vh',
          maxHeight: '100vh',
          backgroundColor: '#1E0408',
          borderRight: '1px solid #380B12',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflowY: 'auto'
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(223, 191, 95, 0.2)' }}>
          <div
            onClick={() => onNavigate && onNavigate('/')}
            title="Return to Public Storefront"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(223, 191, 95, 0.6)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px',
                flexShrink: 0
              }}
            >
              <img
                src={jssLogo}
                alt="JSS Publications Emblem Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.6px', display: 'block', lineHeight: 1.1 }}>
                JSS ADMIN
              </span>
              <span style={{ fontSize: '0.7rem', color: '#DFBF5F', display: 'block', marginTop: '2px' }}>
                Granthamale Operations
              </span>
            </div>
          </div>
        </div>

        {/* Live Storefront Shortcut */}
        <div style={{ padding: '12px 16px' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              color: '#DFBF5F',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <span>View Public Storefront</span>
            <ExternalLink size={13} />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav style={{ flex: 1, padding: '8px 12px' }}>
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.group} style={{ marginBottom: '18px' }}>
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.9px',
                  color: 'rgba(237, 231, 220, 0.45)',
                  padding: '4px 8px',
                  display: 'block'
                }}
              >
                {group.group}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: isActive ? '#C59B27' : 'transparent',
                        color: isActive ? '#1E0408' : 'rgba(237, 231, 220, 0.85)',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={16} color={isActive ? '#1E0408' : '#DFBF5F'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '10px',
                            backgroundColor: item.badgeColor || (isActive ? '#1E0408' : 'rgba(255, 255, 255, 0.16)'),
                            color: item.badgeColor ? '#FFFFFF' : (isActive ? '#FFFFFF' : '#EDE7DC')
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Meta */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(223, 191, 95, 0.2)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: 'rgba(237, 231, 220, 0.5)' }}>Sri Suttur Math · Mysuru</span>
            <div style={{ color: '#DFBF5F', fontWeight: 600, marginTop: '2px' }}>admin (Authenticated)</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(223, 191, 95, 0.3)',
              color: '#DFBF5F',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.7rem'
            }}
            title="Sign out of admin portal"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA - Independent Scroll */}
      <main
        className="admin-main-content"
        style={{
          flex: 1,
          height: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top Navbar */}
        <header
          style={{
            height: '60px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem' }}>
            <div
              onClick={() => onNavigate && onNavigate('/')}
              title="Return to Public Storefront"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(197, 155, 39, 0.4)',
                boxShadow: '0 1px 4px rgba(94, 22, 36, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <img
                src={jssLogo}
                alt="JSS Publications Emblem Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <span style={{ color: 'var(--color-text-muted)' }}>JSS Operations</span>
            <span style={{ color: 'var(--color-border)' }}>/</span>
            <span style={{ fontWeight: 800, color: 'var(--color-maroon)' }}>
              {NAVIGATION_GROUPS.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Console'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#FAF7F2', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
              Speed Post Threshold: ₹{settings.freeShippingThreshold}
            </span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.76rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={13} />
              <span>Storefront</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.76rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-maroon)' }}
              title="Sign out of admin session"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* TAB BODY CONTAINER */}
        <div style={{ padding: '28px', flex: 1 }}>
          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Executive Heritage Banner */}
              <div
                style={{
                  backgroundColor: '#26060C',
                  backgroundImage: 'radial-gradient(ellipse at top right, rgba(197, 155, 39, 0.25), transparent 70%)',
                  borderRadius: '8px',
                  padding: '24px 28px',
                  color: '#EDE7DC',
                  border: '1px solid rgba(197, 155, 39, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: '#FFFFFF', margin: '0 0 6px 0' }}>
                    Granthamale Publication Operations Console
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#DFBF5F', maxWidth: '650px', lineHeight: 1.4 }}>
                    Preserving and distributing 12th-century Vachana literature, Shaiva Agamas, and classical philosophical treatises under the spiritual patronage of Sri Suttur Veerashimhasana Math.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(237, 231, 220, 0.6)', display: 'block' }}>Operational Dispatch</span>
                  <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#FFFFFF' }}>India Post Speed Post</span>
                </div>
              </div>

              {/* 4 Essential KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Revenue</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                    HSN 4901 (0% GST Tax-Exempt)
                  </span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Units Sold / Dispatched</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    {metrics.totalUnitsSold} Copies
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                    Across Karnataka & India
                  </span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Pending Orders</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
                    {metrics.pendingOrdersCount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                    Awaiting Speed Post booking
                  </span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Bulk Enquiries</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {metrics.pendingBulkCount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                    Universities, Colleges & Mutts
                  </span>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsNewBookModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>Add New Publication</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShoppingBag size={14} />
                  <span>Process Orders ({orders.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Boxes size={14} />
                  <span>Restock Inventory</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewPeriodicalModalOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Newspaper size={14} />
                  <span>Register Periodical Issue</span>
                </button>
              </div>

              {/* Two Column Grid: Recent Orders & Low Stock Radar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
                {/* Recent Orders Timeline */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>Recent Orders Timeline</h2>
                    <button type="button" onClick={() => setActiveTab('orders')} className="btn btn-outline btn-sm" style={{ fontSize: '0.76rem', padding: '4px 10px' }}>
                      All Orders ({orders.length})
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                          <th style={{ padding: '8px 10px' }}>Order ID</th>
                          <th style={{ padding: '8px 10px' }}>Customer</th>
                          <th style={{ padding: '8px 10px' }}>Total</th>
                          <th style={{ padding: '8px 10px' }}>Status</th>
                          <th style={{ padding: '8px 10px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.orderId} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                            <td style={{ padding: '10px', fontWeight: 700, color: 'var(--color-maroon)' }}>{o.orderId}</td>
                            <td style={{ padding: '10px' }}>{o.customer.fullName}</td>
                            <td style={{ padding: '10px', fontWeight: 600 }}>₹{o.totals?.grandTotal || 0}</td>
                            <td style={{ padding: '10px' }}>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  textTransform: 'capitalize',
                                  backgroundColor: o.status === 'delivered' ? '#DCFCE7' : o.status === 'shipped' ? '#E0F2FE' : '#FEF3C7',
                                  color: o.status === 'delivered' ? '#15803D' : o.status === 'shipped' ? '#0369A1' : '#B45309'
                                }}
                              >
                                {o.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td style={{ padding: '10px' }}>
                              <button
                                type="button"
                                onClick={() => { setSelectedOrder(o); setOrderTrackingInput(o.dispatch?.trackingNumber || ''); }}
                                style={{ background: 'none', border: 'none', color: 'var(--color-maroon)', fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' }}
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Low Stock Radar */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={16} color="#D97706" />
                      <h2 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>Low Stock Publications</h2>
                    </div>
                    <button type="button" onClick={() => setActiveTab('inventory')} className="btn btn-outline btn-sm" style={{ fontSize: '0.76rem', padding: '4px 10px' }}>
                      Full Inventory
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {books.slice(0, 5).map((book) => {
                      const stock = book.stock || 18;
                      return (
                        <div
                          key={book.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            backgroundColor: '#FAF7F2',
                            borderRadius: '6px',
                            border: '1px solid var(--color-border-subtle)'
                          }}
                        >
                          <div style={{ maxWidth: '200px' }}>
                            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-text-charcoal)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {book.title}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                              ₹{book.price} · {book.format || 'Paperback'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: stock < 15 ? '#DC2626' : 'var(--color-maroon)' }}>
                              {stock} in stock
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStockBook(book);
                                setIsStockModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 9px', fontSize: '0.74rem' }}
                            >
                              Restock
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ORDERS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Order Processing & Speed Post Dispatch Desk
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Fulfill orders, generate proforma invoices, book Speed Post consignments, and update delivery statuses.
                  </p>
                </div>
              </div>

              {/* Status Filter Bar & Search */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '220px' }}>
                  <Search size={15} color="var(--color-text-muted)" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer Name, or Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['All', 'confirmed', 'processing', 'shipped', 'delivered'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: orderStatusFilter === st ? 'var(--color-maroon)' : 'var(--color-border)',
                        backgroundColor: orderStatusFilter === st ? 'var(--color-maroon)' : '#FFFFFF',
                        color: orderStatusFilter === st ? '#FFFFFF' : 'var(--color-text-charcoal)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Order ID & Date</th>
                      <th style={{ padding: '12px 14px' }}>Customer & Destination</th>
                      <th style={{ padding: '12px 14px' }}>Items Summary</th>
                      <th style={{ padding: '12px 14px' }}>Payment</th>
                      <th style={{ padding: '12px 14px' }}>Total Amount</th>
                      <th style={{ padding: '12px 14px' }}>Consignment Tracking</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.orderId} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-maroon)', display: 'block' }}>{o.orderId}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 700, display: 'block' }}>{o.customer.fullName}</span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                            {o.shippingAddress.city}, {o.shippingAddress.pincode}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 600 }}>{o.items.length} titles</span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {o.items.map(it => it.title).join(', ')}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>{o.payment.method}</span>
                          <span style={{ fontSize: '0.7rem', color: '#16A34A', display: 'block' }}>HSN 4901 Exempt</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-maroon)' }}>
                          ₹{o.totals?.grandTotal || 0}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {o.dispatch?.trackingNumber ? (
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, padding: '2px 6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', borderRadius: '4px', fontSize: '0.74rem' }}>
                              {o.dispatch.trackingNumber}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Pending Booking</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              textTransform: 'capitalize',
                              backgroundColor: o.status === 'delivered' ? '#DCFCE7' : o.status === 'shipped' ? '#E0F2FE' : '#FEF3C7',
                              color: o.status === 'delivered' ? '#15803D' : o.status === 'shipped' ? '#0369A1' : '#B45309'
                            }}
                          >
                            {o.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrder(o);
                                setOrderTrackingInput(o.dispatch?.trackingNumber || '');
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            >
                              Manage
                            </button>
                            <button
                              type="button"
                              onClick={() => setInvoicePrintOrder(o)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                              title="Print Proforma Invoice"
                            >
                              <Printer size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BULK ENQUIRIES */}
          {/* ========================================================================= */}
          {activeTab === 'bulk-orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Institutional & Mutt Bulk Procurement Desk
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Review large volume inquiries from university libraries, colleges, math mutts, and research institutions.
                  </p>
                </div>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'New Enquiry', 'Quoted', 'Dispatched', 'Closed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setBulkStatusFilter(st)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: '1px solid',
                      borderColor: bulkStatusFilter === st ? 'var(--color-maroon)' : 'var(--color-border)',
                      backgroundColor: bulkStatusFilter === st ? 'var(--color-maroon)' : '#FFFFFF',
                      color: bulkStatusFilter === st ? '#FFFFFF' : 'var(--color-text-charcoal)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Bulk Enquiries Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Institution / Organization</th>
                      <th style={{ padding: '12px 14px' }}>Contact Person</th>
                      <th style={{ padding: '12px 14px' }}>Requested Consignment</th>
                      <th style={{ padding: '12px 14px' }}>Quoted Value</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBulkEnquiries.map((b) => {
                      const orgName = b.organizationName || b.institution_name || b.institutionName || b.orgName || 'Unnamed Institution';
                      const orgType = b.orgType || b.institutionType || b.category || 'Institutional Indent';
                      const contact = b.contactPerson || b.contact_person || b.contactName || b.officerName || 'Staff In-charge';
                      const phone = b.phone || '';
                      const email = b.email || '';
                      const volumes = b.requestedTitles?.length
                        ? `${b.estimatedBooksCount || b.requestedTitles.length} copies (${b.requestedTitles.length} titles)`
                        : (b.estimatedCopies ? `${b.estimatedCopies} copies` : (b.requestedVolumes || 'Bulk Consignment'));
                      const notes = b.notes || b.requirement_details || b.requirementDetails || '';
                      const quoted = b.quotedAmount
                        ? `₹${Number(b.quotedAmount).toLocaleString('en-IN')}`
                        : (b.estimatedValue ? `₹${Number(b.estimatedValue).toLocaleString('en-IN')}` : 'Quote Pending');

                      return (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--color-text-charcoal)', display: 'block', fontSize: '0.9rem' }}>
                              {orgName}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: 'var(--color-maroon)', fontWeight: 600 }}>
                              {orgType}
                            </span>
                            {b.city && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                {b.city}{b.state ? `, ${b.state}` : ''}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--color-text-charcoal)', display: 'block' }}>
                              {contact}
                            </span>
                            {phone && (
                              <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                {phone}
                              </span>
                            )}
                            {email && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                {email}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', maxWidth: '280px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--color-text-charcoal)' }}>{volumes}</span>
                            {notes && <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{notes}</div>}
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: quoted === 'Quote Pending' ? 'var(--color-text-muted)' : 'var(--color-maroon)' }}>
                            {quoted}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: b.status === 'Dispatched' ? '#DCFCE7' : b.status === 'New Enquiry' ? '#FEF3C7' : b.status === 'Quotation Generated' || b.status === 'Quotation Sent' ? '#EFF6FF' : '#F3F4F6',
                                color: b.status === 'Dispatched' ? '#15803D' : b.status === 'New Enquiry' ? '#B45309' : b.status === 'Quotation Generated' || b.status === 'Quotation Sent' ? '#1D4ED8' : '#374151'
                              }}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              value={b.status}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                adminService.updateBulkStatus(b.id, newStatus);
                                showToast(`Bulk inquiry status updated to ${newStatus}`);
                              }}
                              style={{ fontSize: '0.74rem', padding: '3px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                            >
                              <option value="New Enquiry">New Enquiry</option>
                              <option value="Quotation Generated">Quotation Generated</option>
                              <option value="Quotation Sent">Quotation Sent</option>
                              <option value="Payment Received">Payment Received</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PUBLICATIONS CATALOGUE */}
          {/* ========================================================================= */}
          {activeTab === 'books' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Publications Catalogue & Title Management
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Add new publications, calibrate MRPs, manage stock, and control Draft → Published → Archived lifecycles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewBookModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>Add New Publication</span>
                </button>
              </div>

              {/* Filtering Bar */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '220px' }}>
                  <Search size={15} color="var(--color-text-muted)" />
                  <input
                    type="text"
                    placeholder="Search by title, Kannada title, or author..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Category:</label>
                  <select
                    value={bookCategoryFilter}
                    onChange={(e) => setBookCategoryFilter(e.target.value)}
                    style={{ fontSize: '0.78rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  {['All', 'published', 'draft', 'archived'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setBookStatusFilter(st)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: bookStatusFilter === st ? 'var(--color-maroon)' : 'var(--color-border)',
                        backgroundColor: bookStatusFilter === st ? '#FAF7F2' : '#FFFFFF',
                        color: bookStatusFilter === st ? 'var(--color-maroon)' : 'var(--color-text-charcoal)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Publications Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Title & Series</th>
                      <th style={{ padding: '12px 14px' }}>Author / Editor</th>
                      <th style={{ padding: '12px 14px' }}>Category & Format</th>
                      <th style={{ padding: '12px 14px' }}>MRP (₹)</th>
                      <th style={{ padding: '12px 14px' }}>Stock</th>
                      <th style={{ padding: '12px 14px' }}>Lifecycle Status</th>
                      <th style={{ padding: '12px 14px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => {
                      const stock = book.stock || 25;
                      const status = book.status || 'published';
                      return (
                        <tr key={book.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '12px 14px', maxWidth: '280px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--color-maroon)' }}>{book.title}</div>
                            {book.kannadaTitle && (
                              <div style={{ fontSize: '0.76rem', color: 'var(--color-text-charcoal)' }}>{book.kannadaTitle}</div>
                            )}
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{book.isbn}</div>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.8rem' }}>{book.author}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block' }}>{book.category}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{book.format || 'Paperback'}</span>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 800 }}>₹{book.price}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: stock < 15 ? '#DC2626' : 'var(--color-maroon)' }}>
                            {stock} copies
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              value={status}
                              onChange={(e) => {
                                const newStat = e.target.value;
                                adminService.updateBookStatus(book.id, newStat, `Status changed by admin to ${newStat}`);
                                showToast(`Status updated to ${newStat}`);
                              }}
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                padding: '3px 6px',
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: status === 'published' ? '#DCFCE7' : status === 'archived' ? '#F3F4F6' : '#FEF3C7',
                                color: status === 'published' ? '#15803D' : status === 'archived' ? '#6B7280' : '#B45309'
                              }}
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                              <option value="unlisted">Unlisted</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => setEditingBook({ ...book })}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 7px', fontSize: '0.72rem' }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPriceBook(book);
                                  setNewPriceInput(String(book.price));
                                  setIsPriceModalOpen(true);
                                }}
                                className="btn btn-outline btn-sm"
                                style={{ padding: '3px 7px', fontSize: '0.72rem' }}
                              >
                                Price
                              </button>
                              {status !== 'archived' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    openSafetyModal({
                                      title: `Archive Publication (${book.title})`,
                                      consequence: 'This title will be safely marked as Archived. It will not appear on the storefront, but all historical order records remain intact.',
                                      confirmLabel: 'Archive Publication',
                                      onConfirm: (reason) => {
                                        adminService.updateBookStatus(book.id, 'archived', reason);
                                        showToast('Publication safely archived.');
                                      }
                                    });
                                  }}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '3px 7px', fontSize: '0.72rem', color: '#DC2626' }}
                                >
                                  Archive
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    adminService.updateBookStatus(book.id, 'published', 'Restored to catalogue');
                                    showToast('Publication published to storefront.');
                                  }}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '3px 7px', fontSize: '0.72rem', color: '#15803D' }}
                                >
                                  Restore
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: INVENTORY & RESTOCK */}
          {/* ========================================================================= */}
          {activeTab === 'inventory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Warehouse & Mysore Press Inventory Desk
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Track stock on hand, review threshold alerts, and record reprint restocks with audited operational justifications.
                  </p>
                </div>
              </div>

              {/* Inventory Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Titles Catalogued</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {books.length} Publications
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Low Stock Alert (&lt; 15)</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
                    {books.filter(b => (b.stock || 25) < 15).length} Titles
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Stock Depleted</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#DC2626', marginTop: '4px' }}>
                    {books.filter(b => (b.stock || 25) === 0).length} Titles
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Warehouse Location</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    Mysuru Sales Counter
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inventoryOnlyLowStock}
                    onChange={(e) => setInventoryOnlyLowStock(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span>Show only low-stock titles (&lt; 15 copies)</span>
                </label>
              </div>

              {/* Inventory Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Publication Title</th>
                      <th style={{ padding: '12px 14px' }}>Format</th>
                      <th style={{ padding: '12px 14px' }}>Stock on Hand</th>
                      <th style={{ padding: '12px 14px' }}>Safety Threshold</th>
                      <th style={{ padding: '12px 14px' }}>Health Status</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((book) => {
                      const stock = book.stock || 25;
                      const isLow = stock < 15;
                      const isOut = stock === 0;
                      return (
                        <tr key={book.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--color-text-charcoal)' }}>{book.title}</div>
                            {book.kannadaTitle && <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{book.kannadaTitle}</div>}
                          </td>
                          <td style={{ padding: '12px 14px' }}>{book.format || 'Paperback'}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: isOut ? '#DC2626' : isLow ? '#D97706' : '#15803D' }}>
                            {stock} copies
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--color-text-muted)' }}>15 copies</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: isOut ? '#FEE2E2' : isLow ? '#FEF3C7' : '#DCFCE7',
                                color: isOut ? '#DC2626' : isLow ? '#B45309' : '#15803D'
                              }}
                            >
                              {isOut ? 'Depleted' : isLow ? 'Low Stock' : 'Healthy Stock'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStockBook(book);
                                setIsStockModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            >
                              + Restock
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: PERIODICALS (SUTTUR VANI & SHARANA SANDESHA) */}
          {/* ========================================================================= */}
          {activeTab === 'periodicals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Suttur Vani & Math Periodicals Archive
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Manage monthly spiritual publications, Sharana Sandesha issues, subscription renewals, and archival editions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewPeriodicalModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>Register New Issue</span>
                </button>
              </div>

              {/* Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Archived Issues</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {periodicals.length} Issues
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Print Run</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                    {periodicals.reduce((acc, p) => acc + (p.circulationCount || 0), 0).toLocaleString('en-IN')} copies
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Annual Subscriptions</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
                    ₹350 / year
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Postal Dispatch</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    Book Post Registered
                  </div>
                </div>
              </div>

              {/* Periodicals Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Periodical Title</th>
                      <th style={{ padding: '12px 14px' }}>Volume & Issue</th>
                      <th style={{ padding: '12px 14px' }}>Month & Year</th>
                      <th style={{ padding: '12px 14px' }}>Chief Editor</th>
                      <th style={{ padding: '12px 14px' }}>Circulation</th>
                      <th style={{ padding: '12px 14px' }}>Price</th>
                      <th style={{ padding: '12px 14px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {periodicals.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-maroon)' }}>{p.title}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{p.titleKn}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                          Vol. {p.volume}, Issue {p.issue}
                        </td>
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          {p.month} {p.year}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.78rem' }}>
                          {p.editor}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#15803D' }}>
                          {(p.circulationCount || 1000).toLocaleString('en-IN')} copies
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                          ₹{p.price || 30}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            type="button"
                            onClick={() => showToast(`Archival PDF opened for ${p.title}.`)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            PDF View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: STOREFRONT CMS & BILINGUAL FAQS */}
          {/* ========================================================================= */}
          {activeTab === 'homepage-cms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Storefront Editorial & Bilingual FAQs CMS
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Configure the digital storefront hero announcement, Sri Suttur Math blessings notice, and reader FAQs.
                  </p>
                </div>
              </div>

              {/* Sub-navigation pills */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCmsActiveTab('hero')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: cmsActiveTab === 'hero' ? 'var(--color-maroon)' : 'var(--color-border)',
                    backgroundColor: cmsActiveTab === 'hero' ? 'var(--color-maroon)' : '#FFFFFF',
                    color: cmsActiveTab === 'hero' ? '#FFFFFF' : 'var(--color-text-charcoal)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Hero Editorial & Math Blessings
                </button>
                <button
                  type="button"
                  onClick={() => setCmsActiveTab('faqs')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: cmsActiveTab === 'faqs' ? 'var(--color-maroon)' : 'var(--color-border)',
                    backgroundColor: cmsActiveTab === 'faqs' ? 'var(--color-maroon)' : '#FFFFFF',
                    color: cmsActiveTab === 'faqs' ? '#FFFFFF' : 'var(--color-text-charcoal)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Bilingual FAQs ({faqs.length})
                </button>
              </div>

              {cmsActiveTab === 'hero' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    adminService.updateHomepageCms({
                      heroHeadline: fd.get('heroHeadline'),
                      heroHeadlineKn: fd.get('heroHeadlineKn'),
                      heroSubtitle: fd.get('heroSubtitle'),
                      heroBadge: fd.get('heroBadge'),
                      blessingMessage: fd.get('blessingMessage'),
                      curatedShelfTitle: fd.get('curatedShelfTitle'),
                      scholarSpotlightName: fd.get('scholarSpotlightName'),
                      announcementActive: fd.get('announcementActive') === 'on'
                    });
                    showToast('Homepage editorial configuration saved.');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  {/* Hero Showcase Card */}
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: 'var(--color-maroon)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Home size={18} />
                      <span>Hero Section & Editorial Header</span>
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>Hero Headline (English)</label>
                        <input name="heroHeadline" type="text" defaultValue={homepageCms.heroHeadline} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>Hero Headline (ಕನ್ನಡ)</label>
                        <input name="heroHeadlineKn" type="text" defaultValue={homepageCms.heroHeadlineKn} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>Editorial Subtitle / Monograph Tagline</label>
                        <input name="heroSubtitle" type="text" defaultValue={homepageCms.heroSubtitle} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>Commemorative Tag Badge</label>
                        <input name="heroBadge" type="text" defaultValue={homepageCms.heroBadge} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }} />
                      </div>
                    </div>
                  </div>

                  {/* Suttur Math Blessing Card */}
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: 'var(--color-maroon)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} />
                      <span>Sri Suttur Math Patronage Blessing</span>
                    </h3>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>Sri Math Blessings Invocation (Asheervachana)</label>
                      <textarea name="blessingMessage" rows={3} defaultValue={homepageCms.blessingMessage} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        name="announcementActive"
                        type="checkbox"
                        id="announcementActiveCheck"
                        defaultChecked={homepageCms.announcementActive}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="announcementActiveCheck" style={{ fontSize: '0.86rem', fontWeight: 600, cursor: 'pointer' }}>
                        Publish sitewide institutional blessing banner at the top of the storefront
                      </label>
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Save size={16} />
                      <span>Save Editorial Configuration</span>
                    </button>
                  </div>
                </form>
              )}

              {cmsActiveTab === 'faqs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setIsNewFaqModalOpen(true)}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={14} />
                      <span>Add Bilingual FAQ</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          padding: '16px 20px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-maroon)', textTransform: 'uppercase' }}>
                              {faq.category}
                            </span>
                            <h4 style={{ margin: '4px 0 2px 0', fontSize: '0.94rem', color: 'var(--color-text-charcoal)' }}>
                              {faq.question}
                            </h4>
                            {faq.questionKn && (
                              <div style={{ fontSize: '0.84rem', color: 'var(--color-maroon)', marginBottom: '6px' }}>
                                {faq.questionKn}
                              </div>
                            )}
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                              {faq.answer}
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => adminService.toggleFaqStatus(faq.id)}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                            >
                              {faq.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                openSafetyModal({
                                  title: `Archive FAQ (${faq.id})`,
                                  consequence: 'Safely transitions FAQ to Archived state without hard-deleting records.',
                                  confirmLabel: 'Archive FAQ',
                                  onConfirm: (reason) => {
                                    adminService.archiveFaq(faq.id, reason);
                                    showToast('FAQ archived.');
                                  }
                                });
                              }}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#DC2626' }}
                            >
                              Archive
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: DISCOUNTS & COUPONS */}
          {/* ========================================================================= */}
          {activeTab === 'coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Coupons & Cultural Promotion Desk
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Create subsidized promotion codes for students, pilgrimage book fairs, and library endowments.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewCouponModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>Create Coupon</span>
                </button>
              </div>

              {/* Coupons Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '18px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', color: 'var(--color-maroon)', letterSpacing: '0.5px' }}>
                          {c.code}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            backgroundColor: c.status === 'active' ? '#DCFCE7' : '#F3F4F6',
                            color: c.status === 'active' ? '#15803D' : '#6B7280'
                          }}
                        >
                          {c.status}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-charcoal)', margin: '0 0 10px 0' }}>
                        {c.description}
                      </p>

                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                        <div><strong>Discount:</strong> {c.discountValue}{c.discountType === 'percentage' ? '%' : '₹'} off (Max ₹{c.maxDiscount})</div>
                        <div><strong>Min Order:</strong> ₹{c.minOrder}</div>
                        <div><strong>Uses:</strong> {c.usedCount} / {c.usageLimit}</div>
                        <div><strong>Valid Until:</strong> {c.expiryDate}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => adminService.toggleCoupon(c.code)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.74rem' }}
                      >
                        {c.status === 'active' ? 'Disable Coupon' : 'Activate Coupon'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: CUSTOMER SUPPORT DESK */}
          {/* ========================================================================= */}
          {activeTab === 'support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Customer & Scholar Inquiries Desk
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Handle reader inquiries, Speed Post dispatch questions, and out-of-print title requests.
                  </p>
                </div>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTicketStatusFilter(st)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: '1px solid',
                      borderColor: ticketStatusFilter === st ? 'var(--color-maroon)' : 'var(--color-border)',
                      backgroundColor: ticketStatusFilter === st ? 'var(--color-maroon)' : '#FFFFFF',
                      color: ticketStatusFilter === st ? '#FFFFFF' : 'var(--color-text-charcoal)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Support Tickets Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Ticket & Date</th>
                      <th style={{ padding: '12px 14px' }}>Scholar / Customer</th>
                      <th style={{ padding: '12px 14px' }}>Department</th>
                      <th style={{ padding: '12px 14px' }}>Subject & Query</th>
                      <th style={{ padding: '12px 14px' }}>Priority</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-maroon)', display: 'block' }}>{t.id}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 700, display: 'block' }}>{t.customerName}</span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{t.customerEmail}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.78rem' }}>{t.department}</td>
                        <td style={{ padding: '12px 14px', maxWidth: '280px' }}>
                          <div style={{ fontWeight: 600 }}>{t.subject}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {t.message}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '3px', backgroundColor: t.priority === 'High' ? '#FEF2F2' : '#F3F4F6', color: t.priority === 'High' ? '#DC2626' : '#4B5563' }}>
                            {t.priority}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: t.status === 'Open' ? '#FEF2F2' : t.status === 'In Progress' ? '#FEF3C7' : '#DCFCE7', color: t.status === 'Open' ? '#DC2626' : t.status === 'In Progress' ? '#B45309' : '#15803D' }}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTicket(t);
                              setTicketReplyText('');
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            {t.status === 'Resolved' ? 'View' : 'Reply & Resolve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 10: STORE & STAFF SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Store Configuration & Staff Administration
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Manage retail sales counter details, statutory GST exemption parameters, and operations personnel accounts.
                </p>
              </div>

              {/* Store Details Form */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: 'var(--color-maroon)' }}>
                  Mysuru Retail Sales Counter Configuration
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    adminService.updateSettings({
                      storeName: formData.get('storeName'),
                      counterAddress: formData.get('counterAddress'),
                      email: formData.get('email'),
                      phone: formData.get('phone'),
                      freeShippingThreshold: Number(formData.get('freeShippingThreshold')),
                      gstExemptionCode: formData.get('gstExemptionCode')
                    });
                    showToast('Store settings saved successfully.');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Institutional Entity</label>
                    <input name="storeName" type="text" defaultValue={settings.storeName} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Mysuru Retail Counter Address</label>
                    <input name="counterAddress" type="text" defaultValue={settings.counterAddress} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Contact Email</label>
                      <input name="email" type="email" defaultValue={settings.email} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Contact Phone</label>
                      <input name="phone" type="text" defaultValue={settings.phone} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Free Speed Post Threshold (₹)</label>
                      <input name="freeShippingThreshold" type="number" defaultValue={settings.freeShippingThreshold} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Statutory GST Exemption Code</label>
                      <input name="gstExemptionCode" type="text" defaultValue={settings.gstExemptionCode} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    </div>
                  </div>

                  <div style={{ marginTop: '4px' }}>
                    <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Save size={15} />
                      <span>Save Configuration</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Staff Personnel Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-maroon)' }}>
                    Operations Staff Accounts ({staffUsers.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsNewStaffModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} />
                    <span>Add Staff User</span>
                  </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '10px 12px' }}>Staff Name</th>
                      <th style={{ padding: '10px 12px' }}>Institutional Email</th>
                      <th style={{ padding: '10px 12px' }}>Role</th>
                      <th style={{ padding: '10px 12px' }}>Status</th>
                      <th style={{ padding: '10px 12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{u.name}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--color-text-charcoal)' }}>{u.email}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FAF7F2', border: '1px solid var(--color-border)', color: 'var(--color-maroon)' }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: u.status === 'Active' ? '#DCFCE7' : '#F3F4F6', color: u.status === 'Active' ? '#15803D' : '#6B7280' }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const res = adminService.toggleStaffStatus(u.id);
                              if (res.success) {
                                showToast(`User ${u.name} status updated.`);
                              }
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                          >
                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* INTERACTIVE CRUD MODALS & ACTION DIALOGS */}
      {/* ========================================================================= */}

      {/* SAFETY REASON CONFIRMATION MODAL */}
      {safetyModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '500px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <AlertTriangle size={22} color="#DC2626" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#DC2626', fontWeight: 800 }}>
                {safetyModal.title}
              </h3>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-charcoal)', lineHeight: 1.4, marginBottom: '14px' }}>
              {safetyModal.consequence}
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-maroon)', marginBottom: '6px' }}>
                Operational Reason (Mandatory) *
              </label>
              <textarea
                rows={3}
                placeholder="State the justification for this action..."
                value={safetyModal.reason}
                onChange={(e) => setSafetyModal({ ...safetyModal, reason: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSafetyModal({ isOpen: false, title: '', consequence: '', reason: '', confirmLabel: '', onConfirm: null })}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSafetyConfirm}
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#DC2626', borderColor: '#DC2626' }}
              >
                {safetyModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER DETAILS & DISPATCH DRAWER */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '680px', maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '28px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-maroon)', fontWeight: 800 }}>JSS PUBLICATIONS ORDER</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: 'var(--color-text-charcoal)' }}>{selectedOrder.orderId}</h3>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Customer Details */}
            <div style={{ backgroundColor: '#FAF7F2', padding: '12px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.82rem' }}>
              <div><strong>Customer:</strong> {selectedOrder.customer.fullName} ({selectedOrder.customer.phone})</div>
              <div><strong>Delivery Address:</strong> {selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                Purchased Publications (HSN 4901 0% GST)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#FAF7F2', borderRadius: '6px', fontSize: '0.84rem' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>{item.title}</span> ({item.format || 'Paperback'}) × {item.quantity}
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--color-maroon)' }}>₹{item.total || item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consignment Booking */}
            <div style={{ padding: '14px', backgroundColor: '#FAF7F2', borderRadius: '6px', marginBottom: '18px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                India Post Speed Post Consignment Booking
              </h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="e.g. EM123456789IN"
                  value={orderTrackingInput}
                  onChange={(e) => setOrderTrackingInput(e.target.value)}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: '5px', border: '1px solid var(--color-border)', fontSize: '0.84rem', textTransform: 'uppercase' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const res = adminService.assignTracking(selectedOrder.orderId, orderTrackingInput);
                    if (res.success) {
                      showToast('Speed Post consignment booked.');
                      setSelectedOrder(res.order);
                    } else {
                      alert(res.error);
                    }
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Book Tracking
                </button>
              </div>
            </div>

            {/* Status Transition */}
            <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 700 }}>Update Status:</label>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  const res = adminService.updateOrderStatus(selectedOrder.orderId, newStatus);
                  if (res.success) {
                    apiClient.updateOrderStatus(selectedOrder.orderId, newStatus, { reason: 'Status change', actor: 'Admin Pavan' }).catch(() => {});
                    showToast(`Order status updated to ${newStatus}`);
                    setSelectedOrder(res.order);
                  }
                }}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }}
              >
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing (Packing)</option>
                <option value="shipped">Shipped via Speed Post</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setInvoicePrintOrder(selectedOrder)}
                className="btn btn-outline btn-sm"
              >
                <Printer size={14} />
                <span>Print Proforma Invoice</span>
              </button>
              <button type="button" onClick={() => setSelectedOrder(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PUBLICATION */}
      {isNewBookModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '620px', maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-maroon)', fontWeight: 800 }}>
                Add New Granthamale Publication
              </h3>
              <button type="button" onClick={() => setIsNewBookModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const res = adminService.addBook({
                  title: fd.get('title'),
                  kannadaTitle: fd.get('kannadaTitle'),
                  author: fd.get('author'),
                  category: fd.get('category'),
                  format: fd.get('format'),
                  price: fd.get('price'),
                  stock: fd.get('stock'),
                  isbn: fd.get('isbn'),
                  pages: fd.get('pages'),
                  weight: fd.get('weight'),
                  description: fd.get('description'),
                  status: 'published'
                });
                if (res.success) {
                  apiClient.addBook({
                    title: fd.get('title'),
                    titleKannada: fd.get('kannadaTitle'),
                    author: fd.get('author'),
                    category: fd.get('category'),
                    price: fd.get('price'),
                    stock: fd.get('stock')
                  }).catch(() => {});
                  showToast(`Publication "${res.book.title}" added to catalogue.`);
                  setIsNewBookModalOpen(false);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Title (English) *</label>
                  <input name="title" required type="text" placeholder="e.g. Vachana Dharmasara" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Title (ಕನ್ನಡ)</label>
                  <input name="kannadaTitle" type="text" placeholder="ವಚನ ಧರ್ಮಸಾರ" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Author / Editor</label>
                  <input name="author" type="text" defaultValue="JSS Editorial Board" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select name="category" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                    <option value="Vachana Literature">Vachana Literature</option>
                    <option value="Veerashaivism">Veerashaivism</option>
                    <option value="Historical Studies">Historical Studies</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Children Literature">Children Literature</option>
                    <option value="Spiritual Discourses">Spiritual Discourses</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Binding Format</label>
                  <select name="format" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                    <option value="Paperback">Paperback</option>
                    <option value="Hardbound">Hardbound</option>
                    <option value="Deluxe Edition">Deluxe Edition</option>
                    <option value="Pocket Edition">Pocket Edition</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Price (₹) *</label>
                  <input name="price" required type="number" defaultValue="250" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Initial Stock</label>
                  <input name="stock" type="number" defaultValue="50" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Monograph Description</label>
                <textarea name="description" rows={3} defaultValue="Published under the patronage of Sri Suttur Veerashimhasana Math." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publish to Catalogue</button>
                <button type="button" onClick={() => setIsNewBookModalOpen(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PUBLICATION DETAILS */}
      {editingBook && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '620px', maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-maroon)', fontWeight: 800 }}>EDIT PUBLICATION #{editingBook.id}</span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-text-charcoal)', fontWeight: 800 }}>
                  {editingBook.title}
                </h3>
              </div>
              <button type="button" onClick={() => setEditingBook(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const res = adminService.updateBook(editingBook.id, {
                  title: fd.get('title'),
                  kannadaTitle: fd.get('kannadaTitle'),
                  author: fd.get('author'),
                  category: fd.get('category'),
                  price: Number(fd.get('price')),
                  stock: Number(fd.get('stock')),
                  isbn: fd.get('isbn'),
                  description: fd.get('description')
                });
                if (res.success) {
                  showToast('Publication details updated.');
                  setEditingBook(null);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Title (English) *</label>
                  <input name="title" required type="text" defaultValue={editingBook.title} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Title (ಕನ್ನಡ)</label>
                  <input name="kannadaTitle" type="text" defaultValue={editingBook.kannadaTitle || editingBook.title} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Author / Editor</label>
                  <input name="author" type="text" defaultValue={editingBook.author} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <input name="category" type="text" defaultValue={editingBook.category} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Price (₹)</label>
                  <input name="price" type="number" defaultValue={editingBook.price} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Stock Copies</label>
                  <input name="stock" type="number" defaultValue={editingBook.stock || 25} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>ISBN</label>
                  <input name="isbn" type="text" defaultValue={editingBook.isbn} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea name="description" rows={3} defaultValue={editingBook.description} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={() => setEditingBook(null)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT */}
      {isStockModalOpen && selectedStockBook && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '440px', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--color-maroon)' }}>
              Stock Adjustment: {selectedStockBook.title}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '14px' }}>
              Current stock: {selectedStockBook.stock || 25} copies
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Adjustment Quantity (+ or -)</label>
                <input
                  type="number"
                  value={stockAdjustAmount}
                  onChange={(e) => setStockAdjustAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Operational Reason</label>
                <input
                  type="text"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  placeholder="e.g. Mysuru Press Counter Restock"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const res = adminService.adjustStock(selectedStockBook.id, stockAdjustAmount, stockReason);
                    if (res.success) {
                      apiClient.adjustStock(`${selectedStockBook.id}-pb`, stockAdjustAmount, stockReason, 'Admin Pavan').catch(() => {});
                      showToast(`Updated stock to ${res.newStock} copies.`);
                      setIsStockModalOpen(false);
                    } else {
                      alert(res.error);
                    }
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Stock
                </button>
                <button type="button" onClick={() => setIsStockModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRICE CHANGE */}
      {isPriceModalOpen && selectedPriceBook && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '440px', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--color-maroon)' }}>
              Change Catalogue Price: {selectedPriceBook.title}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '14px' }}>
              Historical orders will never be modified.
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>New Price (₹)</label>
                <input
                  type="number"
                  value={newPriceInput}
                  onChange={(e) => setNewPriceInput(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Reason</label>
                <input
                  type="text"
                  value={priceChangeReason}
                  onChange={(e) => setPriceChangeReason(e.target.value)}
                  placeholder="e.g. Revised reprint edition"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const res = adminService.updateBookPrice(selectedPriceBook.id, newPriceInput, priceChangeReason);
                    if (res.success) {
                      apiClient.updateBookPrice(selectedPriceBook.id, 'Paperback', newPriceInput, priceChangeReason, 'Admin Pavan').catch(() => {});
                      showToast(`Catalogue price changed to ₹${res.newPrice}.`);
                      setIsPriceModalOpen(false);
                    } else {
                      alert(res.error);
                    }
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Price
                </button>
                <button type="button" onClick={() => setIsPriceModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PUBLISH NEW PERIODICAL ISSUE */}
      {isNewPeriodicalModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '480px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-maroon)' }}>
              Register Periodical Issue
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const res = adminService.addPeriodical({
                  title: fd.get('title'),
                  titleKn: fd.get('titleKn'),
                  volume: fd.get('volume'),
                  issue: fd.get('issue'),
                  month: fd.get('month'),
                  year: fd.get('year'),
                  editor: fd.get('editor'),
                  price: fd.get('price'),
                  circulationCount: fd.get('circulationCount')
                });
                if (res.success) {
                  showToast('Periodical issue registered.');
                  setIsNewPeriodicalModalOpen(false);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}
            >
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Periodical Name *</label>
                <input name="title" required type="text" defaultValue="Sharana Sandesha" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Name (ಕನ್ನಡ)</label>
                <input name="titleKn" type="text" defaultValue="ಶರಣ ಸಂದೇಶ" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Volume</label>
                  <input name="volume" type="number" defaultValue="42" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Issue No</label>
                  <input name="issue" type="number" defaultValue="10" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Month</label>
                  <input name="month" type="text" defaultValue="October" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Year</label>
                  <input name="year" type="number" defaultValue="2026" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Chief Editor</label>
                <input name="editor" type="text" defaultValue="Dr. H. P. Nagaraj" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Single Issue Price (₹)</label>
                  <input name="price" type="number" defaultValue="30" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Circulation (Copies)</label>
                  <input name="circulationCount" type="number" defaultValue="1500" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Register Issue</button>
                <button type="button" onClick={() => setIsNewPeriodicalModalOpen(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE BILINGUAL FAQ */}
      {isNewFaqModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '520px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-maroon)' }}>
              Create Bilingual FAQ
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const res = adminService.addFaq({
                  category: formData.get('category'),
                  question: formData.get('question'),
                  questionKn: formData.get('questionKn'),
                  answer: formData.get('answer'),
                  answerKn: formData.get('answerKn'),
                  status: 'published'
                });
                if (res.success) {
                  showToast('Bilingual FAQ published successfully.');
                  setIsNewFaqModalOpen(false);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}
            >
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                <select name="category" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  <option value="JSS Publications">JSS Publications</option>
                  <option value="Ordering">Ordering</option>
                  <option value="Payments">Payments</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Books">Books</option>
                  <option value="Bulk Orders">Bulk Orders</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Question (English) *</label>
                <input name="question" required type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Question (Kannada)</label>
                <input name="questionKn" type="text" placeholder="ಕನ್ನಡ ಪ್ರಶ್ನೆ" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Answer (English) *</label>
                <textarea name="answer" required rows={3} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publish FAQ</button>
                <button type="button" onClick={() => setIsNewFaqModalOpen(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE COUPON */}
      {isNewCouponModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '480px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-maroon)' }}>
              Create Promotional Coupon
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const res = adminService.createCoupon({
                  code: formData.get('code'),
                  discountType: 'percentage',
                  discountValue: formData.get('discountValue'),
                  minOrder: formData.get('minOrder'),
                  description: formData.get('description'),
                  maxUsesTotal: formData.get('maxUsesTotal')
                });
                if (res.success) {
                  showToast('Coupon created successfully.');
                  setIsNewCouponModalOpen(false);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}
            >
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Coupon Code *</label>
                <input name="code" required type="text" placeholder="e.g. SUTTUR20" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', textTransform: 'uppercase' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Discount Percentage (%) *</label>
                <input name="discountValue" required type="number" placeholder="15" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Minimum Order Amount (₹)</label>
                <input name="minOrder" type="number" defaultValue="400" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <input name="description" type="text" placeholder="e.g. Suttur Jathra Pilgrim Discount" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Coupon</button>
                <button type="button" onClick={() => setIsNewCouponModalOpen(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUPPORT TICKET REPLY */}
      {selectedTicket && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '600px', maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-maroon)', fontWeight: 800 }}>SUPPORT INQUIRY {selectedTicket.id}</span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-text-charcoal)', fontWeight: 800 }}>
                  {selectedTicket.subject}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#FAF7F2', padding: '14px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.84rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div><strong>From:</strong> {selectedTicket.customerName}</div>
                <div><strong>Email:</strong> {selectedTicket.customerEmail}</div>
                <div><strong>Department:</strong> {selectedTicket.department}</div>
                <div><strong>Order Ref:</strong> {selectedTicket.orderRef || 'N/A'}</div>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '10px' }}>
                <strong>Message:</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-charcoal)', lineHeight: 1.4 }}>
                  {selectedTicket.message}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-maroon)', marginBottom: '6px' }}>
                Official Granthamale Response
              </label>
              <textarea
                rows={4}
                placeholder="Type response to reader / scholar..."
                value={ticketReplyText}
                onChange={(e) => setTicketReplyText(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    adminService.replySupportTicket(selectedTicket.id, ticketReplyText, 'Resolved');
                    showToast('Ticket marked Resolved with reply dispatched.');
                    setSelectedTicket(null);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#15803D', borderColor: '#15803D' }}
                >
                  Reply & Resolve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    adminService.replySupportTicket(selectedTicket.id, ticketReplyText, 'In Progress');
                    showToast('Reply dispatched; ticket kept In Progress.');
                    setSelectedTicket(null);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Reply & Keep Open
                </button>
              </div>
              <button type="button" onClick={() => setSelectedTicket(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STAFF USER */}
      {isNewStaffModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '460px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-maroon)' }}>
              Add Institutional Staff Account
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const res = adminService.addStaffUser({
                  name: fd.get('name'),
                  email: fd.get('email'),
                  role: fd.get('role')
                });
                if (res.success) {
                  showToast(`Staff account created for ${res.user.name}.`);
                  setIsNewStaffModalOpen(false);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}
            >
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Staff Full Name *</label>
                <input name="name" required type="text" placeholder="e.g. Mahadevaiah B." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Email Address *</label>
                <input name="email" required type="email" placeholder="staff@jssonline.org" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Operational Role</label>
                <select name="role" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  <option value="Order/Support Staff">Order/Support Staff</option>
                  <option value="Operations Staff">Operations Staff</option>
                  <option value="Catalogue Manager">Catalogue Manager</option>
                  <option value="Finance Auditor">Finance Auditor</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Account</button>
                <button type="button" onClick={() => setIsNewStaffModalOpen(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE PROFORMA INVOICE VIEW */}
      {invoicePrintOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '680px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '36px', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--color-maroon)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-maroon)', display: 'block' }}>
                  JAGADGURU SRI SHIVARATHREESHWARA GRANTHAMALE
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru - 570004
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-maroon)', textTransform: 'uppercase' }}>PROFORMA INVOICE</span>
                <div style={{ fontSize: '0.94rem', fontWeight: 700 }}>INV-{invoicePrintOrder.orderId}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.84rem', marginBottom: '20px' }}>
              <div>
                <strong>Billed & Dispatched To:</strong>
                <div>{invoicePrintOrder.customer.fullName}</div>
                <div>{invoicePrintOrder.shippingAddress.addressLine}</div>
                <div>{invoicePrintOrder.shippingAddress.city}, {invoicePrintOrder.shippingAddress.state} - {invoicePrintOrder.shippingAddress.pincode}</div>
                <div>Phone: {invoicePrintOrder.customer.phone}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><strong>Date:</strong> {new Date(invoicePrintOrder.createdAt).toLocaleDateString('en-IN')}</div>
                <div><strong>Tax Status:</strong> Exempt (HSN 4901 0% GST)</div>
                <div><strong>Payment:</strong> {invoicePrintOrder.payment.method} ({invoicePrintOrder.payment.status})</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Title & Format</th>
                  <th style={{ padding: '8px' }}>HSN</th>
                  <th style={{ padding: '8px' }}>Qty</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Rate</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoicePrintOrder.items.map((it, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '8px' }}>{it.title} ({it.format || 'Paperback'})</td>
                    <td style={{ padding: '8px' }}>4901</td>
                    <td style={{ padding: '8px' }}>{it.quantity}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>₹{it.price}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>₹{it.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.94rem', fontWeight: 800, color: 'var(--color-maroon)', borderTop: '2px solid var(--color-border)', paddingTop: '10px', marginBottom: '24px' }}>
              <span>Grand Total: ₹{invoicePrintOrder.totals?.grandTotal || 0}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                Computer-generated proforma invoice issued by JSS Publications Sales Counter.
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => window.print()} className="btn btn-primary btn-sm">
                  <Printer size={14} />
                  <span>Print Document</span>
                </button>
                <button type="button" onClick={() => setInvoicePrintOrder(null)} className="btn btn-outline btn-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
