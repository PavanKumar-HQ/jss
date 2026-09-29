import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Building2,
  RotateCcw,
  BookOpen,
  FolderTree,
  Users,
  Layers,
  Boxes,
  Tag,
  Ticket,
  Megaphone,
  Home,
  HelpCircle,
  Newspaper,
  Scroll,
  Compass,
  FileQuestion,
  UserCheck,
  Headphones,
  Truck,
  Bell,
  TrendingUp,
  PieChart,
  Search,
  ShieldAlert,
  Sliders,
  LogOut,
  ExternalLink,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  FileText,
  DollarSign,
  Package,
  Calendar,
  Filter,
  Save,
  Check,
  X,
  Eye,
  RefreshCw,
  MapPin,
  Lock,
  ChevronDown,
  Activity,
  Database,
  AlertCircle,
  ShieldCheck,
  Languages,
  Sparkles
} from 'lucide-react';
import { adminService, catalogueService } from '../services';
import { ADMIN_PERMISSIONS, ROLE_DEFINITIONS } from '../services/adminService';
import jssLogo from '../assets/jss-logo.webp';

export default function AdminPage({ onNavigate }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchFilter, setSearchFilter] = useState('');

  // Data subscriptions from adminService
  const [metrics, setMetrics] = useState(() => adminService.getDashboardMetrics());
  const [orders, setOrders] = useState(() => adminService.getOrders());
  const [bulkEnquiries, setBulkEnquiries] = useState(() => adminService.getBulkEnquiries());
  const [returns, setReturns] = useState(() => adminService.getReturns());
  const [faqs, setFaqs] = useState(() => adminService.getFaqs());
  const [coupons, setCoupons] = useState(() => adminService.getCoupons());
  const [reconciliation, setReconciliation] = useState(() => adminService.getReconciliationRecords());
  const [customers, setCustomers] = useState(() => adminService.getCustomers());
  const [searchAnalytics, setSearchAnalytics] = useState(() => adminService.getSearchAnalytics());
  const [operationsAlerts, setOperationsAlerts] = useState(() => adminService.getOperationsAlerts());
  const [fraudAlerts, setFraudAlerts] = useState(() => adminService.getFraudAlerts());
  const [systemHealth, setSystemHealth] = useState(() => adminService.getSystemHealth());
  const [auditLogs, setAuditLogs] = useState(() => adminService.getAuditLogs());
  const [staffUsers, setStaffUsers] = useState(() => adminService.getStaffUsers());
  const [settings, setSettings] = useState(() => adminService.getSettings());
  const [books, setBooks] = useState(() => catalogueService.getBooksSync());
  const [promotions, setPromotions] = useState(() => adminService.getPromotions());
  const [homepageCms, setHomepageCms] = useState(() => adminService.getHomepageCms());
  const [periodicals, setPeriodicals] = useState(() => adminService.getPeriodicals());
  const [vachanas, setVachanas] = useState(() => adminService.getVachanas());
  const [readingPaths, setReadingPaths] = useState(() => adminService.getReadingPaths());
  const [supportTickets, setSupportTickets] = useState(() => adminService.getSupportTickets());
  const [salesAnalytics, setSalesAnalytics] = useState(() => adminService.getSalesAnalytics());

  // Additional Modals & Filter States
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isNewPromoModalOpen, setIsNewPromoModalOpen] = useState(false);
  const [isNewPeriodicalModalOpen, setIsNewPeriodicalModalOpen] = useState(false);
  const [isNewVachanaModalOpen, setIsNewVachanaModalOpen] = useState(false);
  const [isNewReadingPathModalOpen, setIsNewReadingPathModalOpen] = useState(false);
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('All');
  const [bookStatusFilter, setBookStatusFilter] = useState('All');

  // Modal & Detail States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedBulk, setSelectedBulk] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isNewFaqModalOpen, setIsNewFaqModalOpen] = useState(false);
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStockBook, setSelectedStockBook] = useState(null);
  const [stockAdjustAmount, setStockAdjustAmount] = useState(10);
  const [stockReason, setStockReason] = useState('Mysuru Press Counter Restock');
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedPriceBook, setSelectedPriceBook] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState('');
  const [priceChangeReason, setPriceChangeReason] = useState('Reprint price adjustment');

  // Shipping PIN Test State
  const [testPinInput, setTestPinInput] = useState('570004');
  const [pinLookupResult, setPinLookupResult] = useState(() => adminService.checkPinServiceability('570004'));

  // Safety Confirmation Modal State
  const [safetyModal, setSafetyModal] = useState({
    isOpen: false,
    title: '',
    consequence: '',
    reasonRequired: true,
    reason: '',
    confirmLabel: 'Confirm Action',
    onConfirm: null
  });

  const [orderTrackingInput, setOrderTrackingInput] = useState('');
  const [orderStatusSelect, setOrderStatusSelect] = useState('');
  const [orderNoteInput, setOrderNoteInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [invoicePrintOrder, setInvoicePrintOrder] = useState(null);

  // Sync data whenever adminService fires an update
  useEffect(() => {
    return adminService.subscribe(() => {
      setMetrics(adminService.getDashboardMetrics());
      setOrders(adminService.getOrders());
      setBulkEnquiries(adminService.getBulkEnquiries());
      setReturns(adminService.getReturns());
      setFaqs(adminService.getFaqs());
      setCoupons(adminService.getCoupons());
      setReconciliation(adminService.getReconciliationRecords());
      setCustomers(adminService.getCustomers());
      setSearchAnalytics(adminService.getSearchAnalytics());
      setOperationsAlerts(adminService.getOperationsAlerts());
      setFraudAlerts(adminService.getFraudAlerts());
      setSystemHealth(adminService.getSystemHealth());
      setAuditLogs(adminService.getAuditLogs());
      setStaffUsers(adminService.getStaffUsers());
      setSettings(adminService.getSettings());
      setBooks(catalogueService.getBooksSync());
      setPromotions(adminService.getPromotions());
      setHomepageCms(adminService.getHomepageCms());
      setPeriodicals(adminService.getPeriodicals());
      setVachanas(adminService.getVachanas());
      setReadingPaths(adminService.getReadingPaths());
      setSupportTickets(adminService.getSupportTickets());
      setSalesAnalytics(adminService.getSalesAnalytics());
    });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Trigger Safety Modal for high-stakes decisions
  const openSafetyModal = ({ title, consequence, onConfirm, confirmLabel = 'Confirm Action' }) => {
    setSafetyModal({
      isOpen: true,
      title,
      consequence,
      reasonRequired: true,
      reason: '',
      confirmLabel,
      onConfirm
    });
  };

  const handleSafetyConfirm = () => {
    if (!safetyModal.reason || safetyModal.reason.trim().length < 4) {
      alert('A valid operational reason (minimum 4 characters) is mandatory for this action.');
      return;
    }
    if (safetyModal.onConfirm) {
      safetyModal.onConfirm(safetyModal.reason);
    }
    setSafetyModal({ isOpen: false, title: '', consequence: '', reasonRequired: true, reason: '', confirmLabel: '', onConfirm: null });
  };

  // Sidebar navigation structure (Directly reflecting JSS Admin Architecture)
  const NAVIGATION_GROUPS = [
    {
      group: 'DASHBOARD',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: 'SALES',
      items: [
        { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => o.status === 'confirmed').length || null },
        { id: 'payment-recon', label: 'Payment Recon', icon: DollarSign, badge: metrics.discrepanciesCount ? `${metrics.discrepanciesCount} Alert` : null, badgeColor: '#DC2626' },
        { id: 'bulk-orders', label: 'Bulk Orders', icon: Building2, badge: bulkEnquiries.filter(b => b.status === 'New Enquiry').length || null },
        { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw, badge: returns.filter(r => r.status === 'Pending Review').length || null }
      ]
    },
    {
      group: 'CATALOGUE',
      items: [
        { id: 'books', label: 'Books & Lifecycle', icon: BookOpen, badge: books.length },
        { id: 'editions', label: 'Editions & Formats', icon: Layers, badge: null },
        { id: 'inventory', label: 'Inventory & Holds', icon: Boxes, badge: metrics.lowStockCount ? `${metrics.lowStockCount} Low` : null, badgeColor: '#D97706' },
        { id: 'pricing', label: 'Pricing & Tiers', icon: Tag, badge: null }
      ]
    },
    {
      group: 'MARKETING',
      items: [
        { id: 'coupons', label: 'Coupons & Limits', icon: Ticket, badge: coupons.filter(c => c.status === 'active').length },
        { id: 'promotions', label: 'Promotions', icon: Megaphone, badge: promotions.filter(p => p.status === 'active').length || null }
      ]
    },
    {
      group: 'CONTENT',
      items: [
        { id: 'homepage-cms', label: 'Homepage CMS', icon: Home, badge: 'Live' },
        { id: 'faqs-cms', label: 'FAQs & Bilingual', icon: HelpCircle, badge: faqs.length },
        { id: 'periodicals', label: 'Periodicals', icon: Newspaper, badge: `${periodicals.length} Issues` },
        { id: 'vachanas', label: 'Vachanas & MSS', icon: Scroll, badge: `${vachanas.length} MSS` },
        { id: 'reading-paths', label: 'Reading Paths', icon: Compass, badge: `${readingPaths.length} Paths` }
      ]
    },
    {
      group: 'OPERATIONS',
      items: [
        { id: 'customers', label: 'Customers', icon: UserCheck, badge: customers.length },
        { id: 'shipping', label: 'Shipping & PINs', icon: Truck, badge: 'Speed Post' },
        { id: 'support', label: 'Support Desk', icon: Headphones, badge: supportTickets.filter(t => t.status === 'Open').length || null, badgeColor: '#DC2626' }
      ]
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { id: 'operations-alerts', label: 'Alerts Radar', icon: AlertTriangle, badge: operationsAlerts.length ? `${operationsAlerts.length}` : null, badgeColor: '#DC2626' },
        { id: 'fraud-radar', label: 'Fraud & Abuse', icon: ShieldAlert, badge: fraudAlerts.filter(f => f.status === 'Under Review').length || null, badgeColor: '#D97706' },
        { id: 'sales-analytics', label: 'Sales Analytics', icon: TrendingUp, badge: `₹${Math.round(salesAnalytics.grossSales / 1000)}k` },
        { id: 'search-analytics', label: 'Search Analytics', icon: Search, badge: null }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'admin-users', label: 'Admin Users', icon: Users, badge: staffUsers.length },
        { id: 'roles', label: 'Roles & RBAC', icon: Lock, badge: null },
        { id: 'audit-log', label: 'Audit Log', icon: FileText, badge: auditLogs.length },
        { id: 'system-health', label: 'System Health', icon: Activity, badge: '99.9%' },
        { id: 'backup-recovery', label: 'Backup & Restore', icon: Database, badge: null },
        { id: 'settings', label: 'Store Settings', icon: Sliders, badge: null }
      ]
    }
  ];

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

      {/* LEFT SIDEBAR - Independent Navigation Scroll */}
      <aside
        className="admin-sidebar"
        style={{
          width: '260px',
          height: '100vh',
          maxHeight: '100vh',
          backgroundColor: '#26060C',
          color: '#EDE7DC',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(197, 155, 39, 0.25)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <img src={jssLogo} alt="JSS Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                        padding: '7px 10px',
                        borderRadius: '5px',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <Icon size={15} color={isActive ? '#1E0408' : '#DFBF5F'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: '0.66rem',
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

        {/* Active Session Footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#1E0408' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#C59B27',
                  color: '#1E0408',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}
              >
                PK
              </div>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  Pavan Kumar
                </span>
                <span style={{ fontSize: '0.68rem', color: '#DFBF5F', display: 'block' }}>
                  Super Admin
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/')}
              title="Return to Bookstore"
              style={{ background: 'none', border: 'none', color: 'rgba(237, 231, 220, 0.6)', cursor: 'pointer', padding: '4px' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA - Independent Scrollable Content & Tables Column */}
      <main
        className="admin-main-content"
        style={{
          flex: 1,
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Top Control Bar - Sticky pinned to top of main content */}
        <header
          className="admin-header-sticky"
          style={{
            height: '56px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Granthamale</span>
            <ChevronRight size={13} color="var(--color-text-muted)" />
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'capitalize' }}>
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Quick Failure Radar shortcut */}
            {operationsAlerts.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('operations-alerts')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '20px',
                  color: '#DC2626',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <AlertCircle size={14} />
                <span>{operationsAlerts.length} Critical Alerts</span>
              </button>
            )}

            {/* Quick search filter */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search across orders, books, FAQs..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: '260px',
                  padding: '6px 12px 6px 30px',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>
          </div>
        </header>

        {/* DYNAMIC TAB BODY */}
        <div style={{ padding: '24px', flex: 1 }}>
          {/* TAB 1: DASHBOARD & KPIS */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Top Banner with Suttur Math Heritage */}
              <div
                style={{
                  backgroundColor: '#26060C',
                  backgroundImage: 'radial-gradient(ellipse at top right, rgba(197, 155, 39, 0.2), transparent 70%)',
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
                    Preserving and publishing 12th-century Vachana literature, Shaiva Agamas, and classical philosophical treatises under the spiritual patronage of Sri Suttur Veerashimhasana Math.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(237, 231, 220, 0.6)', display: 'block' }}>Operational Dispatch</span>
                  <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#FFFFFF' }}>India Post Speed Post</span>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Revenue</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                    HSN 4901 (0% GST Tax-Exempt)
                  </span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Units Sold / Dispatched</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    {metrics.totalUnitsSold} Copies
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                    Across Karnataka & India
                  </span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Pending Orders</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
                    {metrics.pendingOrdersCount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                    Awaiting packing / booking
                  </span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Bulk Enquiries</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {metrics.pendingBulkCount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                    Universities, Colleges & Mutts
                  </span>
                </div>
              </div>

              {/* Two Column Section: Recent Orders & Stock Radar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
                {/* Recent Orders Table */}
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
                                onClick={() => { setSelectedOrder(o); setActiveTab('orders'); }}
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

                {/* Low Stock Alerts & Quick Restock */}
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
                    {books.slice(0, 4).map((book) => {
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
                          <div style={{ maxWidth: '210px' }}>
                            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-text-charcoal)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {book.title}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                              ₹{book.price} · {book.binding || 'Paperback'}
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

          {/* TAB: PAYMENT RECONCILIATION SCREEN */}
          {activeTab === 'payment-recon' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Payment Provider Reconciliation Ledger
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Continuous auditing of Order Amount vs Payment Provider vs Captured vs Outstanding. Automatically detects webhook delays and gateway variances.
                  </p>
                </div>
              </div>

              {/* Reconciliation Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Reconciliation ID</th>
                      <th style={{ padding: '12px 14px' }}>Order Reference</th>
                      <th style={{ padding: '12px 14px' }}>Customer</th>
                      <th style={{ padding: '12px 14px' }}>Order Value</th>
                      <th style={{ padding: '12px 14px' }}>Gateway Captured</th>
                      <th style={{ padding: '12px 14px' }}>Variance</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reconciliation.map((rec) => {
                      const hasVariance = rec.variance !== 0;
                      return (
                        <tr key={rec.id} style={{ borderBottom: '1px solid var(--color-border-subtle)', backgroundColor: hasVariance ? '#FFFDF5' : 'transparent' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700 }}>{rec.id}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-maroon)' }}>{rec.orderId}</td>
                          <td style={{ padding: '12px 14px' }}>{rec.customerName}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 600 }}>₹{rec.orderAmount}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 600 }}>₹{rec.capturedAmount}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: hasVariance ? '#DC2626' : '#16A34A' }}>
                            {rec.variance === 0 ? '₹0 (Exact Match)' : `₹${rec.variance}`}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: rec.status.includes('Reconciled') ? '#DCFCE7' : '#FEE2E2',
                                color: rec.status.includes('Reconciled') ? '#15803D' : '#DC2626'
                              }}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {hasVariance ? (
                              <button
                                type="button"
                                onClick={() => {
                                  openSafetyModal({
                                    title: `Resolve Payment Discrepancy (${rec.orderId})`,
                                    consequence: 'This will record verified bank credit for ₹' + rec.orderAmount + ' and clear the discrepancy flag.',
                                    confirmLabel: 'Mark Reconciled',
                                    onConfirm: (reason) => {
                                      adminService.resolveDiscrepancy(rec.id, reason);
                                      showToast('Discrepancy resolved and audited successfully.');
                                    }
                                  });
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                              >
                                Resolve
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.76rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={13} /> Verified
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: OPERATIONS & FAILURE MONITORING ALERTS RADAR */}
          {activeTab === 'operations-alerts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Operational Failure & Alert Radar
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Continuous surveillance of postal failures, payment mismatches, translation staleness, stockouts, and stalled bulk procurement enquiries.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {operationsAlerts.length === 0 ? (
                  <div style={{ padding: '36px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <ShieldCheck size={36} color="#16A34A" style={{ margin: '0 auto 12px auto' }} />
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#16A34A' }}>All Systems Operating Normally</h3>
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>No failed webhooks, delivery deadlocks, or translation inconsistencies detected.</p>
                  </div>
                ) : (
                  operationsAlerts.map((alt) => {
                    const isCritical = alt.level === 'critical';
                    return (
                      <div
                        key={alt.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: `1px solid ${isCritical ? '#FCA5A5' : '#FDE68A'}`,
                          borderLeft: `5px solid ${isCritical ? '#DC2626' : '#D97706'}`,
                          borderRadius: '6px',
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <AlertTriangle size={18} color={isCritical ? '#DC2626' : '#D97706'} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: isCritical ? '#DC2626' : '#D97706' }}>
                              {alt.type}
                            </span>
                            <h4 style={{ margin: '2px 0 0 0', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-charcoal)' }}>
                              {alt.title}
                            </h4>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (alt.type.includes('Payment')) setActiveTab('payment-recon');
                            else if (alt.type.includes('Delivery')) setActiveTab('orders');
                            else if (alt.type.includes('Translation')) setActiveTab('faqs-cms');
                            else if (alt.type.includes('Stock')) setActiveTab('inventory');
                            else if (alt.type.includes('Bulk')) setActiveTab('bulk-orders');
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.76rem', padding: '5px 12px' }}
                        >
                          Investigate
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: SEARCH ANALYTICS & CATALOGUE OPPORTUNITIES */}
          {activeTab === 'search-analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Search Query Analytics & Content Opportunities
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Monitor what readers, scholars, and students are searching for. Convert zero-result searches directly into new editorial manuscripts or reprint editions.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Search Query</th>
                      <th style={{ padding: '12px 14px' }}>Query Frequency</th>
                      <th style={{ padding: '12px 14px' }}>Current Catalogue Results</th>
                      <th style={{ padding: '12px 14px' }}>Action / Opportunity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchAnalytics.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)', backgroundColor: item.resultsCount === 0 ? '#FFFBEB' : 'transparent' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-charcoal)' }}>
                          "{item.query}"
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{item.count} searches</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: item.resultsCount === 0 ? '#FEE2E2' : '#DCFCE7',
                              color: item.resultsCount === 0 ? '#DC2626' : '#15803D'
                            }}
                          >
                            {item.resultsCount === 0 ? '0 Results (Opportunity)' : `${item.resultsCount} books found`}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {item.resultsCount === 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                adminService.convertSearchToOpportunity(item.query);
                                showToast(`Added "${item.query}" as a new planned manuscript opportunity.`);
                              }}
                              disabled={item.convertedToDraft}
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.74rem', padding: '4px 9px' }}
                            >
                              <Sparkles size={12} />
                              <span>{item.convertedToDraft ? 'Opportunity Logged' : 'Create Catalogue Opportunity'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: FRAUD & ABUSE RADAR */}
          {activeTab === 'fraud-radar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Fraud & Abuse Signal Radar
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Heuristic surveillance for abnormal coupon reuse, multiple payment failures, and high-velocity ordering. Flagged for human review without automated customer banning.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Alert ID</th>
                      <th style={{ padding: '12px 14px' }}>Abuse Signal</th>
                      <th style={{ padding: '12px 14px' }}>Customer Reference</th>
                      <th style={{ padding: '12px 14px' }}>Details</th>
                      <th style={{ padding: '12px 14px' }}>Risk Level</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fraudAlerts.map((alt) => (
                      <tr key={alt.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{alt.id}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-maroon)' }}>{alt.type}</td>
                        <td style={{ padding: '12px 14px' }}>{alt.customerEmail}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-text-charcoal)' }}>{alt.details}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: alt.riskScore === 'High' ? '#FEE2E2' : '#FEF3C7',
                              color: alt.riskScore === 'High' ? '#DC2626' : '#B45309'
                            }}
                          >
                            {alt.riskScore} Risk
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {alt.status === 'Resolved' ? (
                            <span style={{ fontSize: '0.76rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={13} /> Resolved
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                openSafetyModal({
                                  title: `Resolve Fraud Flag (${alt.id})`,
                                  consequence: 'Mark alert reviewed and cleared.',
                                  confirmLabel: 'Clear Flag',
                                  onConfirm: (reason) => {
                                    adminService.resolveFraudAlert(alt.id, reason);
                                    showToast('Fraud alert cleared with audit record.');
                                  }
                                });
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                            >
                              Review & Clear
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SALES ANALYTICS */}
          {activeTab === 'sales-analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Sales Performance & Commercial Intelligence
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Revenue breakdowns, top selling publications, payment channels, and seasonal order volumes.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Sales Report CSV generated and downloaded.');
                      showToast('Sales Report CSV downloaded.');
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FileText size={14} />
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Printer size={14} />
                    <span>Print Report</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Gross Store Sales</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    ₹{salesAnalytics.grossSales.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Orders Dispatched</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    {salesAnalytics.totalOrdersCount} Orders
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Total Books Sold</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                    {salesAnalytics.totalItemsSold} Copies
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Average Order Value</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
                    ₹{salesAnalytics.avgOrderValue}
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Category Sales Share & Payment Methods */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '0.94rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                    Revenue Share by Literary Category
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {salesAnalytics.categoryDistribution.map((cat, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600 }}>{cat.category}</span>
                          <span style={{ fontWeight: 800 }}>₹{cat.revenue.toLocaleString('en-IN')} ({cat.sharePercent}%)</span>
                        </div>
                        <div style={{ height: '8px', width: '100%', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${cat.sharePercent}%`, backgroundColor: 'var(--color-maroon)', borderRadius: '4px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '0.94rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                    Payment Channel Distribution
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {salesAnalytics.paymentDistribution.map((pm, idx) => (
                      <div key={idx} style={{ padding: '12px 14px', backgroundColor: '#FAF7F2', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{pm.method}</span>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-maroon)' }}>{pm.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Selling Titles Leaderboard */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                    Top Selling Publications Leaderboard
                  </h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Rank & Publication</th>
                      <th style={{ padding: '12px 14px' }}>Copies Sold</th>
                      <th style={{ padding: '12px 14px' }}>Gross Revenue</th>
                      <th style={{ padding: '12px 14px' }}>Month-over-Month</th>
                      <th style={{ padding: '12px 14px' }}>Inventory Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesAnalytics.topSellingBooks.map((b, idx) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                          #{idx + 1} — {b.title}
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 800 }}>{b.copiesSold}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-maroon)' }}>₹{b.revenue.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px 14px', color: '#15803D', fontWeight: 700 }}>{b.trend}</td>
                        <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D' }}>Healthy Stock</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM HEALTH & TECH DIAGNOSTICS */}
          {activeTab === 'system-health' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Technical Architecture & System Health Diagnostics
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Real-time health telemetry across API gateways, postal integration services, and storage persistence layers.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>API Gateway Uptime</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>
                    {systemHealth.apiGatewayStatus}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                    Latency: {systemHealth.apiLatencyMs}ms (Round-trip)
                  </span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>India Post Webhook</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>
                    {systemHealth.indiaPostApiStatus}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                    Speed Post 13-char Consignment API
                  </span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Client Store Storage Quota</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {systemHealth.storageUsedKb} KB / {systemHealth.storageTotalKb} KB ({systemHealth.storagePercent}%)
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${systemHealth.storagePercent}%`, height: '100%', backgroundColor: 'var(--color-maroon)' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BACKUP & DISASTER RECOVERY */}
          {activeTab === 'backup-recovery' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Backup, Schema Verification & Disaster Recovery
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  A backup that has never been tested is not a verified backup. Download store snapshots and perform verified restore drills safely.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-text-charcoal)' }}>
                    Export Store Snapshot
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    Exports an authoritative JSON file containing all orders, inventory adjustments, bilingual FAQs, coupons, and immutable audit logs.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = adminService.exportStoreSnapshot();
                      const blob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `jss_publications_backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      showToast('Store backup JSON downloaded successfully.');
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <Save size={15} />
                    <span>Download JSON Snapshot</span>
                  </button>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-text-charcoal)' }}>
                    Disaster Recovery Restore Drill
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    Requires Super Admin authentication and mandatory reason logging. Validates payload integrity before applying changes.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    id="restoreFileInput"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target.result;
                        openSafetyModal({
                          title: 'Execute Disaster Recovery Restore Drill',
                          consequence: 'This will replace existing operational tables with data from the uploaded backup snapshot.',
                          confirmLabel: 'Execute Restore',
                          onConfirm: (reason) => {
                            const res = adminService.restoreStoreSnapshot(content, 'Pavan Kumar');
                            if (res.success) {
                              showToast('Store state successfully restored.');
                            } else {
                              alert(res.error);
                            }
                          }
                        });
                      };
                      reader.readAsText(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('restoreFileInput').click()}
                    className="btn btn-outline"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <RefreshCw size={15} />
                    <span>Select Backup File & Verify</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMER MANAGEMENT & RIGHT TO BE FORGOTTEN */}
          {activeTab === 'customers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Customer Directory & Privacy Anonymization
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Manage reader profiles while respecting privacy. Under Right to be Forgotten requests, personal data is anonymized while preserving financial & tax audit integrity.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Customer ID</th>
                      <th style={{ padding: '12px 14px' }}>Name & Identity</th>
                      <th style={{ padding: '12px 14px' }}>Contact</th>
                      <th style={{ padding: '12px 14px' }}>Orders</th>
                      <th style={{ padding: '12px 14px' }}>Total Spent</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{c.id}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-maroon)' }}>{c.name}</td>
                        <td style={{ padding: '12px 14px', fontSize: '0.78rem' }}>
                          <div>{c.email}</div>
                          <div style={{ color: 'var(--color-text-muted)' }}>{c.phone}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{c.ordersCount} Orders</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>₹{c.totalSpent}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: c.anonymized ? '#F3F4F6' : '#DCFCE7',
                              color: c.anonymized ? '#6B7280' : '#15803D'
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {!c.anonymized && (
                            <button
                              type="button"
                              onClick={() => {
                                openSafetyModal({
                                  title: `Anonymize Customer Data (${c.name})`,
                                  consequence: 'Permanently scrubs personal name, email, and phone under Right to be Forgotten. Financial transactions will be retained under an anonymous identifier.',
                                  confirmLabel: 'Anonymize Reader',
                                  onConfirm: (reason) => {
                                    adminService.anonymizeCustomer(c.id, reason);
                                    showToast('Reader data safely anonymized without deleting financial records.');
                                  }
                                });
                              }}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.74rem', padding: '4px 8px', color: '#DC2626' }}
                            >
                              Anonymize
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SHIPPING & PIN CODE SERVICEABILITY CHECKER */}
          {activeTab === 'shipping' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Postal Delivery Routing & PIN Serviceability
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Authoritative dispatch rules via India Post Speed Post. Test PIN code serviceability, delivery turnaround, and remote surcharges.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--color-text-charcoal)' }}>
                  Live PIN Code Serviceability Lookup
                </h3>
                <div style={{ display: 'flex', gap: '10px', maxWidth: '400px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    maxLength={6}
                    value={testPinInput}
                    onChange={(e) => setTestPinInput(e.target.value)}
                    placeholder="Enter 6-digit PIN code"
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const res = adminService.checkPinServiceability(testPinInput);
                      setPinLookupResult(res);
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.84rem' }}
                  >
                    Check
                  </button>
                </div>

                {pinLookupResult && (
                  <div style={{ padding: '14px 18px', backgroundColor: '#FAF7F2', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <CheckCircle2 size={16} color="#16A34A" />
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                        PIN Code {testPinInput}: Serviceable ({pinLookupResult.zone})
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-charcoal)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '10px' }}>
                      <div><strong>Carrier:</strong> {pinLookupResult.carrier}</div>
                      <div><strong>Estimated TAT:</strong> {pinLookupResult.speedPostTat}</div>
                      <div><strong>Remote Surcharge:</strong> ₹{pinLookupResult.surcharge}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SUPPORT DESK & SCHOLAR INQUIRIES */}
          {activeTab === 'support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Scholar Support Desk & Reader Inquiry Console
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Handle scholar citation queries, postal tracking requests, and institutional book inquiries.
                  </p>
                </div>
              </div>

              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div style={{ backgroundColor: '#FEF2F2', padding: '14px 18px', borderRadius: '8px', border: '1px solid #FECACA' }}>
                  <span style={{ fontSize: '0.74rem', color: '#DC2626', fontWeight: 700 }}>Open Tickets</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#DC2626', marginTop: '4px' }}>
                    {supportTickets.filter(t => t.status === 'Open').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FEF3C7', padding: '14px 18px', borderRadius: '8px', border: '1px solid #FCD34D' }}>
                  <span style={{ fontSize: '0.74rem', color: '#B45309', fontWeight: 700 }}>In Progress</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
                    {supportTickets.filter(t => t.status === 'In Progress').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#DCFCE7', padding: '14px 18px', borderRadius: '8px', border: '1px solid #86EFAC' }}>
                  <span style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 700 }}>Resolved</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                    {supportTickets.filter(t => t.status === 'Resolved').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Avg Response Time</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>1.8 Hours</div>
                </div>
              </div>

              {/* Tickets Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Ticket ID</th>
                      <th style={{ padding: '12px 14px' }}>Reader / Scholar</th>
                      <th style={{ padding: '12px 14px' }}>Department</th>
                      <th style={{ padding: '12px 14px' }}>Subject</th>
                      <th style={{ padding: '12px 14px' }}>Priority</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Assigned To</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportTickets.map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700 }}>{t.id}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700 }}>{t.senderName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{t.email}</div>
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
                        <td style={{ padding: '12px 14px', fontSize: '0.78rem' }}>{t.assignedTo}</td>
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
                            {t.status === 'Resolved' ? 'View' : 'Reply'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT WITH TIMELINE & NON-LINEAR STATE MACHINE */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Order Management & Postal Consignments
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Non-linear lifecycle management: Created → Paid → Packed → Shipped → Delivered (with delivery failure & address correction recovery).
                  </p>
                </div>
              </div>

              {/* Orders Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Order ID</th>
                      <th style={{ padding: '12px 14px' }}>Customer</th>
                      <th style={{ padding: '12px 14px' }}>Date</th>
                      <th style={{ padding: '12px 14px' }}>Items</th>
                      <th style={{ padding: '12px 14px' }}>Total Amount</th>
                      <th style={{ padding: '12px 14px' }}>Consignment / Carrier</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => !searchFilter || o.orderId.toLowerCase().includes(searchFilter.toLowerCase()) || o.customer.fullName.toLowerCase().includes(searchFilter.toLowerCase()))
                      .map((o) => (
                        <tr key={o.orderId} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-maroon)' }}>{o.orderId}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 600 }}>{o.customer.fullName}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{o.customer.email}</div>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--color-text-muted)' }}>
                            {new Date(o.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 14px' }}>{o.totals?.itemsCount || o.items?.length || 1} copies</td>
                          <td style={{ padding: '12px 14px', fontWeight: 700 }}>₹{o.totals?.grandTotal || 0}</td>
                          <td style={{ padding: '12px 14px' }}>
                            {o.dispatch?.trackingNumber ? (
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0369A1', fontSize: '0.78rem' }}>
                                {o.dispatch.trackingNumber}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Unassigned</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '4px',
                                textTransform: 'capitalize',
                                backgroundColor:
                                  o.status === 'delivered' ? '#DCFCE7' :
                                  o.status === 'shipped' ? '#E0F2FE' :
                                  o.status === 'delivery_failed' ? '#FEE2E2' : '#FEF3C7',
                                color:
                                  o.status === 'delivered' ? '#15803D' :
                                  o.status === 'shipped' ? '#0369A1' :
                                  o.status === 'delivery_failed' ? '#DC2626' : '#B45309'
                              }}
                            >
                              {o.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrder(o);
                                setOrderStatusSelect(o.status);
                                setOrderTrackingInput(o.dispatch?.trackingNumber || '');
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATALOGUE & BOOK LIFECYCLE (Draft -> Published -> Unlisted -> Archived) */}
          {activeTab === 'books' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Catalogue Publications & Edition Lifecycle
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Invariant: Draft → Published → Unlisted → Archived lifecycle instead of destructive deletion. ISBN normalization and multi-edition support.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewBookModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>Add Publication</span>
                </button>
              </div>

              {/* Filtering Bar */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={14} color="var(--color-maroon)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Filters:</span>
                </div>
                <select
                  value={bookCategoryFilter}
                  onChange={(e) => setBookCategoryFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '5px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                >
                  <option value="All">All Categories</option>
                  <option value="Vachana Literature">Vachana Literature</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Lexicon">Lexicon</option>
                  <option value="Epics & Poetry">Epics & Poetry</option>
                  <option value="Children Literature">Children Literature</option>
                </select>

                <select
                  value={bookStatusFilter}
                  onChange={(e) => setBookStatusFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '5px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="archived">Archived</option>
                </select>

                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                  Showing {books.filter(b => {
                    const matchSearch = !searchFilter || b.title.toLowerCase().includes(searchFilter.toLowerCase()) || (b.kannadaTitle && b.kannadaTitle.includes(searchFilter));
                    const matchCat = bookCategoryFilter === 'All' || b.category === bookCategoryFilter;
                    const matchStat = bookStatusFilter === 'All' || (b.status || 'published') === bookStatusFilter;
                    return matchSearch && matchCat && matchStat;
                  }).length} of {books.length} publications
                </span>
              </div>

              {/* Books Grid / Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Book / Lexicon Title</th>
                      <th style={{ padding: '12px 14px' }}>ISBN / Identifier</th>
                      <th style={{ padding: '12px 14px' }}>Binding Edition</th>
                      <th style={{ padding: '12px 14px' }}>Author / Scholars</th>
                      <th style={{ padding: '12px 14px' }}>Catalogue Price</th>
                      <th style={{ padding: '12px 14px' }}>Stock</th>
                      <th style={{ padding: '12px 14px' }}>Lifecycle Status</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books
                      .filter(b => {
                        const matchSearch = !searchFilter || b.title.toLowerCase().includes(searchFilter.toLowerCase()) || (b.kannadaTitle && b.kannadaTitle.includes(searchFilter));
                        const matchCat = bookCategoryFilter === 'All' || b.category === bookCategoryFilter;
                        const matchStat = bookStatusFilter === 'All' || (b.status || 'published') === bookStatusFilter;
                        return matchSearch && matchCat && matchStat;
                      })
                      .map((book) => {
                        const stock = book.stock || 25;
                        const status = book.status || 'published';
                        return (
                          <tr key={book.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ fontWeight: 700, color: 'var(--color-text-charcoal)' }}>{book.title}</div>
                              {book.kannadaTitle && (
                                <div style={{ fontSize: '0.74rem', color: 'var(--color-maroon)' }}>{book.kannadaTitle}</div>
                              )}
                            </td>
                            <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                              {book.isbn || `JSS-CAT-${book.id.toString().padStart(4, '0')}`}
                            </td>
                            <td style={{ padding: '12px 14px' }}>{book.binding || 'Paperback'}</td>
                            <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                              {book.author || 'Sri Suttur Granthamale'}
                            </td>
                            <td style={{ padding: '12px 14px', fontWeight: 700 }}>₹{book.price}</td>
                            <td style={{ padding: '12px 14px', fontWeight: 800, color: stock < 10 ? '#DC2626' : 'var(--color-maroon)' }}>
                              {stock}
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
                                          showToast(`"${book.title}" transitioned to Archived.`);
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
                                      adminService.updateBookStatus(book.id, 'published', 'Restored from archive');
                                      showToast(`"${book.title}" republished.`);
                                    }}
                                    className="btn btn-outline btn-sm"
                                    style={{ padding: '3px 7px', fontSize: '0.72rem', color: '#15803D' }}
                                  >
                                    Publish
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

          {/* TAB: EDITIONS & FORMATS */}
          {activeTab === 'editions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Editions, Formats & Print Specifications
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Manage physical binding editions (Paperback, Hardbound, Deluxe Leatherbound, Pocket Vachana), paper GSM, and India Post weight tiers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewBookModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>Add Format Variant</span>
                </button>
              </div>

              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Total Formats Catalogued</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    {books.length + 8} Variants
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Clothbound Hardbound</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {books.filter(b => b.price >= 300).length} Editions
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Average Parcel Weight</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    385g (Speed Post Tier 1)
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Printing Press Facility</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#C59B27', marginTop: '6px' }}>
                    Mysuru Suttur Press Desk
                  </div>
                </div>
              </div>

              {/* Editions Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Publication Title</th>
                      <th style={{ padding: '12px 14px' }}>Format & Binding</th>
                      <th style={{ padding: '12px 14px' }}>Paper & Spec</th>
                      <th style={{ padding: '12px 14px' }}>Weight (g)</th>
                      <th style={{ padding: '12px 14px' }}>Pages</th>
                      <th style={{ padding: '12px 14px' }}>Selling MRP</th>
                      <th style={{ padding: '12px 14px' }}>Available Stock</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                          <div>{b.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                            {b.isbn || `JSS-ISBN-00${b.id}`}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: b.price >= 400 ? '#FEF3C7' : '#EFF6FF', color: b.price >= 400 ? '#B45309' : '#1D4ED8' }}>
                            {b.format || (b.price >= 400 ? 'Hardbound Deluxe' : 'Standard Paperback')}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {b.price >= 400 ? '80 GSM Natural Shade, Gold Foil Spine' : '70 GSM Maplitho Paper, 300 GSM Art Card'}
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>{b.weight || (b.price >= 400 ? 580 : 340)}g</td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>{b.pages || 240}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-maroon)' }}>₹{b.price}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: (b.stock || 25) < 10 ? '#DC2626' : '#15803D' }}>
                          {b.stock || 25} copies
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStockBook(b);
                              setIsStockModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY & STOCK HOLDS */}
          {activeTab === 'inventory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Inventory Operations & Stock Adjustments
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Atomic stock updates with negative inventory prevention. Every manual adjustment mandates an audit reason.
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Publication Title</th>
                      <th style={{ padding: '12px 14px' }}>Binding</th>
                      <th style={{ padding: '12px 14px' }}>Available Stock</th>
                      <th style={{ padding: '12px 14px' }}>Status Level</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => {
                      const stock = book.stock || 25;
                      return (
                        <tr key={book.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700 }}>{book.title}</td>
                          <td style={{ padding: '12px 14px' }}>{book.binding || 'Paperback'}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: stock < 10 ? '#DC2626' : 'var(--color-maroon)' }}>
                            {stock} copies
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: stock === 0 ? '#FEE2E2' : stock < 15 ? '#FEF3C7' : '#DCFCE7',
                                color: stock === 0 ? '#DC2626' : stock < 15 ? '#B45309' : '#15803D'
                              }}
                            >
                              {stock === 0 ? 'Out of Stock' : stock < 15 ? 'Low Stock' : 'Ample Supply'}
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
                              style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                            >
                              Adjust Stock
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

          {/* TAB: PRICING & TIERS */}
          {activeTab === 'pricing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Statutory Pricing, Volume Tiers & Tax Rules
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Educational book subsidies, institutional library volume grants, and statutory tax exemption compliance.
                  </p>
                </div>
              </div>

              {/* Statutory Exemption Banner */}
              <div style={{ backgroundColor: '#26060C', border: '1px solid rgba(197, 155, 39, 0.4)', borderRadius: '8px', padding: '18px 24px', color: '#EDE7DC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <ShieldCheck size={20} color="#DFBF5F" />
                  <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#DFBF5F' }}>
                    Statutory GST Exemption: HSN Code 4901 (0% CGST / 0% SGST)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(237, 231, 220, 0.85)', lineHeight: 1.4 }}>
                  In accordance with the Ministry of Finance, Government of India notification on printed books and educational publications, all JSS Publications orders are 100% exempt from Goods and Services Tax (GST). All issued invoices and proforma documents automatically declare HSN 4901.
                </p>
              </div>

              {/* 4 Pricing Tiers Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-maroon)' }}>1. Retail Counter MRP</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>Baseline</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>100% Price</div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Standard publisher list price applied for retail walk-in and online individual customers.
                  </p>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-maroon)' }}>2. Student & Scholar Subsidy</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D' }}>15% Grant</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803D', marginBottom: '4px' }}>15% Subsidized</div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Applicable to university students and research scholars upon institutional ID card verification.
                  </p>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-maroon)' }}>3. Library & College Bulk</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#B45309' }}>20% Volume</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309', marginBottom: '4px' }}>20% Volume Tier</div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Automatically applied on institutional purchase orders with minimum order threshold of 10 or more titles.
                  </p>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-maroon)' }}>4. Mutt Endowment Distribution</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F3E8FF', color: '#7E22CE' }}>25% Patronage</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7E22CE', marginBottom: '4px' }}>25% Endowment</div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Special endowment patronage tier authorized for religious branch institutions and Dasoha mass distributions.
                  </p>
                </div>
              </div>

              {/* Price Rules Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                    Active Institutional Pricing Rules & Schedule
                  </h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Pricing Rule</th>
                      <th style={{ padding: '12px 14px' }}>Target Segment</th>
                      <th style={{ padding: '12px 14px' }}>Discount Slab</th>
                      <th style={{ padding: '12px 14px' }}>Min Quantity</th>
                      <th style={{ padding: '12px 14px' }}>Verification Check</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>Scholar Subsidy Rule</td>
                      <td style={{ padding: '12px 14px' }}>Recognized Research Scholars & Students</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#15803D' }}>15% Flat</td>
                      <td style={{ padding: '12px 14px' }}>1 Copy</td>
                      <td style={{ padding: '12px 14px' }}>Valid Student / University ID Card</td>
                      <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D' }}>Active</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>University Library Grant Slabs</td>
                      <td style={{ padding: '12px 14px' }}>Degree Colleges & University Libraries</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#B45309' }}>20% Volume</td>
                      <td style={{ padding: '12px 14px' }}>10 Copies</td>
                      <td style={{ padding: '12px 14px' }}>Institutional Letterhead / Purchase Order</td>
                      <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D' }}>Active</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>Sri Suttur Math Branch Endowment</td>
                      <td style={{ padding: '12px 14px' }}>Suttur Math Branches & Affiliated Trusts</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#7E22CE' }}>25% Endowment</td>
                      <td style={{ padding: '12px 14px' }}>25 Copies</td>
                      <td style={{ padding: '12px 14px' }}>Mutt Secretarial Sanction Reference</td>
                      <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D' }}>Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BULK & INSTITUTIONAL ORDERS */}
          {activeTab === 'bulk-orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Institutional Bulk Procurement Pipeline
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    8-Stage Institutional Workflow: Enquiry → Requirement Captured → Quotation → Negotiation → Approved → Proforma → Payment → Fulfilment.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bulkEnquiries.map((enq) => (
                  <div key={enq.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-maroon)', fontWeight: 800 }}>{enq.id} · {enq.stage}</span>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '1.08rem', color: 'var(--color-text-charcoal)' }}>{enq.organizationName}</h3>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Contact: {enq.contactPerson} ({enq.email}, {enq.phone})</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '4px',
                          backgroundColor: enq.status === 'Quotation Generated' ? '#E0F2FE' : '#FEF3C7',
                          color: enq.status === 'Quotation Generated' ? '#0369A1' : '#B45309'
                        }}
                      >
                        {enq.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-charcoal)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', padding: '10px 14px', backgroundColor: '#FAF7F2', borderRadius: '6px' }}>
                      <div><strong>Requested Copies:</strong> {enq.estimatedBooksCount} books</div>
                      <div><strong>PO Number:</strong> {enq.purchaseOrderNo || 'N/A'}</div>
                      <div><strong>GSTIN:</strong> {enq.gstin || 'Tax-Exempt'}</div>
                      <div><strong>Credit Terms:</strong> {enq.creditTerms}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                        {enq.quotedAmount ? `Approved Quotation: ₹${enq.quotedAmount}` : `Estimated Value: ₹${enq.estimatedValue}`}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const quote = prompt('Enter Proforma Quotation Amount (₹):', enq.quotedAmount || enq.estimatedValue);
                          if (quote) {
                            adminService.createBulkQuotation(enq.id, quote, 'Admin generated proforma quotation');
                            showToast('Proforma quotation updated.');
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.76rem', padding: '5px 12px' }}
                      >
                        Generate / Update Quotation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: RETURNS & REFUNDS (India Post Speed Post Transit Claims) */}
          {activeTab === 'returns' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Returns, Replacements & Transit Damage Claims
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    India Post Speed Post transit damage inspection, book return verification, and replacement dispatch desk.
                  </p>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Total Claims Filed</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>{returns.length}</div>
                </div>
                <div style={{ backgroundColor: '#FEF3C7', padding: '14px 18px', borderRadius: '8px', border: '1px solid #FCD34D' }}>
                  <span style={{ fontSize: '0.74rem', color: '#B45309', fontWeight: 700 }}>Pending Review</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
                    {returns.filter(r => r.status === 'Pending Review').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#DCFCE7', padding: '14px 18px', borderRadius: '8px', border: '1px solid #86EFAC' }}>
                  <span style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 700 }}>Replacements Dispatched</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                    {returns.filter(r => r.status.includes('Replacement')).length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#EFF6FF', padding: '14px 18px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  <span style={{ fontSize: '0.74rem', color: '#1D4ED8', fontWeight: 700 }}>Refunds Processed</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1D4ED8', marginTop: '4px' }}>
                    {returns.filter(r => r.status.includes('Refund')).length}
                  </div>
                </div>
              </div>

              {/* Returns Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Return ID</th>
                      <th style={{ padding: '12px 14px' }}>Order Ref</th>
                      <th style={{ padding: '12px 14px' }}>Customer</th>
                      <th style={{ padding: '12px 14px' }}>Book Title & Format</th>
                      <th style={{ padding: '12px 14px' }}>Reason & Evidence</th>
                      <th style={{ padding: '12px 14px' }}>Requested Action</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returns.map((ret) => (
                      <tr key={ret.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700 }}>{ret.id}</td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--color-maroon)' }}>{ret.orderId}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{ret.customerName}</td>
                        <td style={{ padding: '12px 14px' }}>{ret.bookTitle}</td>
                        <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                          <div style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: 600 }}>{ret.reason}</div>
                          <span style={{ fontSize: '0.72rem', color: ret.photosProvided ? '#15803D' : '#6B7280' }}>
                            {ret.photosProvided ? '✓ Photos Verified' : 'No photos attached'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{ret.actionRequested}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: ret.status === 'Pending Review' ? '#FEF3C7' : '#DCFCE7',
                              color: ret.status === 'Pending Review' ? '#B45309' : '#15803D'
                            }}
                          >
                            {ret.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {ret.status === 'Pending Review' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    openSafetyModal({
                                      title: `Approve Replacement for ${ret.id}`,
                                      consequence: `A replacement copy of "${ret.bookTitle}" will be allocated from inventory and scheduled for India Post dispatch.`,
                                      confirmLabel: 'Approve & Dispatch',
                                      onConfirm: (reason) => {
                                        adminService.updateReturn(ret.id, { status: 'Approved - Replacement Dispatched' }, reason);
                                        showToast('Replacement approved and dispatched.');
                                      }
                                    });
                                  }}
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    openSafetyModal({
                                      title: `Issue Refund for ${ret.id}`,
                                      consequence: `Order ${ret.orderId} will be processed for financial refund to the original payment method.`,
                                      confirmLabel: 'Process Refund',
                                      onConfirm: (reason) => {
                                        adminService.updateReturn(ret.id, { status: 'Refund Processed', refundAmount: 300 }, reason);
                                        showToast('Refund processed.');
                                      }
                                    });
                                  }}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                >
                                  Refund
                                </button>
                              </>
                            )}
                            {ret.status !== 'Pending Review' && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Closed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: HOMEPAGE CMS */}
          {activeTab === 'homepage-cms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Homepage Editorial & Hero Showcase CMS
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Configure the digital storefront hero announcement, Sri Suttur Math blessings notice, and curated shelf highlights.
                  </p>
                </div>
              </div>

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

                {/* Suttur Math Blessing & Shelf Card */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: 'var(--color-maroon)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} />
                    <span>Sri Suttur Math Patronage Blessing & Curated Shelves</span>
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>Sri Math Blessings Invocation (Asheervachana)</label>
                    <textarea name="blessingMessage" rows={3} defaultValue={homepageCms.blessingMessage} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>Curated Shelf Showcase Title</label>
                      <input name="curatedShelfTitle" type="text" defaultValue={homepageCms.curatedShelfTitle} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>Featured Scholar of the Month</label>
                      <input name="scholarSpotlightName" type="text" defaultValue={homepageCms.scholarSpotlightName} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }} />
                    </div>
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
                    <span>Publish Homepage CMS Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: FAQS & BILINGUAL CONTENT SYNCHRONIZATION */}
          {activeTab === 'faqs-cms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Dynamic Bilingual FAQ Content Management System
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Bilingual synchronization. If English is modified without reviewing Kannada, an explicit warning flag is raised to avoid serving stale translations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewFaqModalOpen(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>Create Bilingual FAQ</span>
                </button>
              </div>

              {/* FAQ List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.map((faq) => {
                  const isOutdated = faq.translationStatus === 'outdated';
                  return (
                    <div
                      key={faq.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${isOutdated ? '#FCD34D' : 'var(--color-border)'}`,
                        borderRadius: '8px',
                        padding: '16px 20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-maroon)', textTransform: 'uppercase' }}>
                              {faq.category}
                            </span>
                            {isOutdated && (
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '1px 6px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '4px' }}>
                                ⚠ Kannada translation outdated
                              </span>
                            )}
                          </div>
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
                          {isOutdated && (
                            <button
                              type="button"
                              onClick={() => {
                                adminService.markKannadaReviewed(faq.id);
                                showToast('Kannada translation confirmed.');
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                            >
                              Confirm Kannada
                            </button>
                          )}
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
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: PERIODICALS */}
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
                  <span>Publish New Issue</span>
                </button>
              </div>

              {/* Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Archived Issues</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {periodicals.length}
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
                      <th style={{ padding: '12px 14px' }}>Editor</th>
                      <th style={{ padding: '12px 14px' }}>Circulation</th>
                      <th style={{ padding: '12px 14px' }}>Subscription</th>
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
                          ₹{p.price || 30} / issue
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => showToast(`Archival PDF opened for ${p.title}.`)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            >
                              Download PDF
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

          {/* TAB: VACHANAS & MANUSCRIPTS */}
          {activeTab === 'vachanas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Palm-Leaf Manuscripts & Vachana Digitization Archive
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Preservation registry for ancient palm-leaf codices (ತಾಳೆಗರಿ), poet ankitas, folio conditions, and Granthamale critical apparatus.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewVachanaModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>Catalogue Manuscript</span>
                </button>
              </div>

              {/* Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Archived Codices</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {vachanas.length} Manuscripts
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Preserved Folios</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                    {vachanas.reduce((acc, v) => acc + (v.vachanaCount || 0), 0).toLocaleString('en-IN')} Vachanas
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Preservation Lab</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
                    Suttur Palm-Leaf Vault
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Digitization Resolution</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    600 DPI Master
                  </div>
                </div>
              </div>

              {/* Manuscripts Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Manuscript ID</th>
                      <th style={{ padding: '12px 14px' }}>Sharana Poet</th>
                      <th style={{ padding: '12px 14px' }}>Ankita (Signature)</th>
                      <th style={{ padding: '12px 14px' }}>Folios & Counts</th>
                      <th style={{ padding: '12px 14px' }}>Condition & Treatment</th>
                      <th style={{ padding: '12px 14px' }}>Preservation Status</th>
                      <th style={{ padding: '12px 14px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vachanas.map((v) => (
                      <tr key={v.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--color-maroon)' }}>
                            {v.manuscriptRef}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700 }}>{v.poet}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{v.era}</div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--color-maroon)' }}>
                            {v.ankita}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                          {v.vachanaCount} Vachanas ({v.folios || 120} leaves)
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {v.condition}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: v.status === 'Digitized' ? '#DCFCE7' : '#FEF3C7',
                            color: v.status === 'Digitized' ? '#15803D' : '#B45309'
                          }}>
                            {v.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            type="button"
                            onClick={() => showToast(`Scholarly critical apparatus loaded for ${v.poet}.`)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            Examine Folio
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: READING PATHS */}
          {activeTab === 'reading-paths' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Curated Reading Paths & Scholarly Curricula
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Guided literary curricula for students, researchers, and university libraries studying Veerashaivism and Kannada literature.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewReadingPathModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>Create Reading Path</span>
                </button>
              </div>

              {/* Grid of Reading Paths */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {readingPaths.map((rp) => (
                  <div
                    key={rp.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-maroon)' }}>
                          {rp.difficulty} Level · {rp.estimatedHours} Hours
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: rp.status === 'active' ? '#DCFCE7' : '#F3F4F6',
                          color: rp.status === 'active' ? '#15803D' : '#6B7280'
                        }}>
                          {rp.status === 'active' ? 'Active Path' : 'Draft'}
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--color-text-charcoal)', fontWeight: 800 }}>
                        {rp.title}
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-maroon)', marginBottom: '10px' }}>
                        {rp.titleKn}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                        {rp.description}
                      </p>

                      <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                          Curated Publications ({rp.books?.length || 0} Titles)
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {(rp.books || []).map((bTitle, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                              <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FAF7F2', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                                {idx + 1}
                              </span>
                              <span style={{ fontWeight: 600 }}>{bTitle}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          adminService.toggleReadingPath(rp.id);
                          showToast(`Reading path status updated.`);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.74rem' }}
                      >
                        {rp.status === 'active' ? 'Disable Path' : 'Activate Path'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS & ABUSE RADAR */}
          {activeTab === 'coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Coupons & Cultural Promotion Desk
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Create subsidized promotion codes with usage limits, max discount ceilings, and accident guards against 100% discounts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewCouponModalOpen(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {coupons.map((c) => (
                  <div key={c.code} style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-maroon)', letterSpacing: '0.5px' }}>
                        {c.code}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
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
                      <div><strong>Benefit:</strong> {c.discountValue}{c.discountType === 'percentage' ? '%' : '₹'} off (Max ₹{c.maxDiscount})</div>
                      <div><strong>Min Order:</strong> ₹{c.minOrder}</div>
                      <div><strong>Uses:</strong> {c.usedCount} / {c.usageLimit}</div>
                      <div><strong>Valid Until:</strong> {c.expiryDate}</div>
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

          {/* TAB: PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Institutional Promotions & Seasonal Campaigns
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Manage festive discounts, Suttur Jathra pilgrimage book subsidies, student endowments, and seasonal banner campaigns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewPromoModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>Create Campaign</span>
                </button>
              </div>

              {/* Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Campaigns</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                    {promotions.filter(p => p.status === 'active').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Campaigns</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {promotions.length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Average Subsidy</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
                    {Math.round(promotions.reduce((acc, p) => acc + (p.discountPercent || 0), 0) / (promotions.length || 1))}%
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Target Beneficiaries</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    Scholars & Mutts
                  </div>
                </div>
              </div>

              {/* Promotions Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Campaign Name</th>
                      <th style={{ padding: '12px 14px' }}>Promo Code</th>
                      <th style={{ padding: '12px 14px' }}>Discount</th>
                      <th style={{ padding: '12px 14px' }}>Target Audience</th>
                      <th style={{ padding: '12px 14px' }}>Validity Window</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-maroon)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{p.description}</div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FAF7F2', border: '1px dashed var(--color-border)' }}>
                            {p.code}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-maroon)' }}>
                          {p.discountPercent}% OFF
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.78rem' }}>
                          {p.targetAudience}
                        </td>
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                          {p.startDate} → {p.endDate}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: p.status === 'active' ? '#DCFCE7' : '#F3F4F6',
                            color: p.status === 'active' ? '#15803D' : '#6B7280'
                          }}>
                            {p.status === 'active' ? 'Active' : 'Paused'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                adminService.togglePromotion(p.id);
                                showToast(`Campaign status updated.`);
                              }}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            >
                              {p.status === 'active' ? 'Pause' : 'Activate'}
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

          {/* TAB 8: AUDIT LOG (First-Class Operational Ledger) */}
          {activeTab === 'audit-log' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Granthamale Operations Audit Ledger
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Immutable operational ledger recording Who, What, When, Object, Old Value, New Value, and Reason.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Timestamp</th>
                      <th style={{ padding: '12px 14px' }}>Operator / User</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                      <th style={{ padding: '12px 14px' }}>Target Subject</th>
                      <th style={{ padding: '12px 14px' }}>Before → After</th>
                      <th style={{ padding: '12px 14px' }}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', color: 'var(--color-text-muted)' }}>
                          {new Date(log.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{log.user}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FAF7F2', color: 'var(--color-maroon)' }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{log.target}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-text-charcoal)' }}>{log.details}</td>
                        <td style={{ padding: '12px 14px', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                          {log.reason || 'Standard operational transition'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ADMIN USERS */}
          {activeTab === 'admin-users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                    Granthamale Admin Users & Operations Staff
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Manage institutional personnel accounts, sales counter operators, and dispatch staff with granular access levels.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewStaffModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>Add Staff User</span>
                </button>
              </div>

              {/* Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Staff Users</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                    {staffUsers.length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Personnel</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                    {staffUsers.filter(u => u.status === 'Active').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Super Administrators</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
                    {staffUsers.filter(u => u.role === 'Super Admin').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>2FA Enforcement</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-charcoal)', marginTop: '4px' }}>
                    100% Mandatory
                  </div>
                </div>
              </div>

              {/* Staff Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Staff Name</th>
                      <th style={{ padding: '12px 14px' }}>Institutional Email</th>
                      <th style={{ padding: '12px 14px' }}>Assigned Role</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Last Activity</th>
                      <th style={{ padding: '12px 14px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                          {u.name}
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-text-charcoal)' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FAF7F2', border: '1px solid var(--color-border)', color: 'var(--color-maroon)' }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: u.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                            color: u.status === 'Active' ? '#15803D' : '#6B7280'
                          }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-text-muted)', fontSize: '0.76rem' }}>
                          {u.lastLogin}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                const res = adminService.toggleStaffStatus(u.id);
                                if (res.success) {
                                  showToast(`User ${u.name} status updated.`);
                                } else {
                                  alert(res.error);
                                }
                              }}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            >
                              {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => showToast(`Password reset link dispatched to ${u.email}`)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            >
                              Reset 2FA
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

          {/* TAB 9: ROLES & GRANULAR PERMISSIONS (RBAC) */}
          {activeTab === 'roles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Role-Based Access Control (RBAC) & Granular Permissions
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  No single "isAdmin" boolean. Permissions are divided into 13 fine-grained operational capabilities.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {Object.entries(ROLE_DEFINITIONS).map(([roleName, perms]) => (
                  <div key={roleName} style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 6px 0' }}>
                      {roleName}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '14px' }}>
                      {perms.length} Active Permissions Assigned
                    </span>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {Object.values(ADMIN_PERMISSIONS).map((perm) => {
                        const hasPerm = perms.includes(perm);
                        return (
                          <span
                            key={perm}
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: hasPerm ? '#DCFCE7' : '#F3F4F6',
                              color: hasPerm ? '#15803D' : '#9CA3AF',
                              fontWeight: hasPerm ? 600 : 400
                            }}
                          >
                            {perm}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>
                  Institutional Store Settings & Dispatch Parameters
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Configure physical book house counter addresses, dispatch origins, and free postal delivery thresholds.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px', maxWidth: '750px' }}>
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
                      <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Statutory GST Exemption</label>
                      <input name="gstExemptionCode" type="text" defaultValue={settings.gstExemptionCode} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    </div>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <button type="submit" className="btn btn-primary">
                      <Save size={15} />
                      <span>Save Configuration</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODALS: REASONED SAFETY CONFIRMATION, ORDER DETAILS, STOCK & PRICING */}
      {/* ========================================================================= */}

      {/* MODAL: ADMIN SAFETY CONFIRMATION WITH MANDATORY REASON */}
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
                Operational Reason (Mandatory Audit Requirement) *
              </label>
              <textarea
                rows={3}
                placeholder="State the justification for this action (e.g. 'Customer phone request', 'Binder reprint adjustment', etc.)"
                value={safetyModal.reason}
                onChange={(e) => setSafetyModal({ ...safetyModal, reason: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.84rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSafetyModal({ isOpen: false, title: '', consequence: '', reasonRequired: true, reason: '', confirmLabel: '', onConfirm: null })}
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

      {/* MODAL: ORDER DETAILS DRAWER WITH CHRONOLOGICAL TIMELINE */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '700px', maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '28px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-maroon)', fontWeight: 800 }}>JSS PUBLICATIONS ORDER</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: 'var(--color-text-charcoal)' }}>{selectedOrder.orderId}</h3>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                Purchased Publications (HSN 4901 Exempt)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#FAF7F2', borderRadius: '6px', fontSize: '0.84rem' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>{item.title}</span> ({item.edition || 'Paperback'}) × {item.quantity}
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--color-maroon)' }}>₹{item.total || item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consignment Booking */}
            <div style={{ padding: '14px', backgroundColor: '#FAF7F2', borderRadius: '6px', marginBottom: '18px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                India Post Speed Post Dispatch
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

            {/* Chronological Event Timeline */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                Chronological Audit Timeline
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '8px', borderLeft: '2px solid var(--color-border)' }}>
                {(selectedOrder.timeline || []).map((tl, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', position: 'relative', paddingLeft: '14px' }}>
                    <div style={{ position: 'absolute', left: '-15px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-maroon)' }} />
                    <span style={{ fontWeight: 700, color: 'var(--color-text-charcoal)' }}>{tl.event}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: '8px', fontSize: '0.72rem' }}>
                      ({tl.actor} · {new Date(tl.time).toLocaleTimeString('en-IN')})
                    </span>
                  </div>
                ))}
              </div>
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
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Change Amount (+ or -)</label>
                <input
                  type="number"
                  value={stockAdjustAmount}
                  onChange={(e) => setStockAdjustAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Mandatory Audit Reason</label>
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

      {/* MODAL: PRICE CHANGE WITH AUDIT TRAIL */}
      {isPriceModalOpen && selectedPriceBook && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '440px', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--color-maroon)' }}>
              Change Catalogue Price: {selectedPriceBook.title}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '14px' }}>
              Historical order integrity is preserved: existing orders will never be modified.
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
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Reason for Price Adjustment</label>
                <input
                  type="text"
                  value={priceChangeReason}
                  onChange={(e) => setPriceChangeReason(e.target.value)}
                  placeholder="e.g. Revised reprint edition pricing"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const res = adminService.updateBookPrice(selectedPriceBook.id, newPriceInput, priceChangeReason);
                    if (res.success) {
                      showToast(`Catalogue price changed to ₹${res.newPrice}.`);
                      setIsPriceModalOpen(false);
                    } else {
                      alert(res.error);
                    }
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Confirm Price Change
                </button>
                <button type="button" onClick={() => setIsPriceModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE BILINGUAL FAQ */}
      {isNewFaqModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '540px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
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
                  <option value="Returns">Returns</option>
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

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Answer (Kannada)</label>
                <textarea name="answerKn" rows={3} placeholder="ಕನ್ನಡ ವಿವರಣೆ" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
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
              Create Cultural Promotion Coupon
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
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Total Uses Ceiling</label>
                <input name="maxUsesTotal" type="number" defaultValue="200" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <input name="description" type="text" placeholder="e.g. Student cultural subsidy" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Coupon</button>
                <button type="button" onClick={() => setIsNewCouponModalOpen(false)} className="btn btn-outline">Cancel</button>
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
                    <td style={{ padding: '8px' }}>{it.title} ({it.edition || 'Paperback'})</td>
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

      {/* MODAL: ADD PUBLICATION */}
      {isNewBookModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '640px', maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
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
                  series: fd.get('series'),
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>ISBN</label>
                  <input name="isbn" type="text" placeholder="978-81-94921-xx-x" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Pages</label>
                  <input name="pages" type="number" defaultValue="240" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Weight (g)</label>
                  <input name="weight" type="number" defaultValue="350" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Editorial Monograph Description</label>
                <textarea name="description" rows={3} defaultValue="Published under the patronage of Sri Suttur Veerashimhasana Math." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
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
          <div style={{ width: '640px', maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Publication Changes</button>
                <button type="button" onClick={() => setEditingBook(null)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PROMOTION CAMPAIGN */}
      {isNewPromoModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '480px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-maroon)' }}>
              Create Promotion Campaign
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const res = adminService.createPromotion({
                  name: fd.get('name'),
                  code: fd.get('code'),
                  discountPercent: fd.get('discountPercent'),
                  targetAudience: fd.get('targetAudience'),
                  startDate: fd.get('startDate'),
                  endDate: fd.get('endDate'),
                  description: fd.get('description')
                });
                if (res.success) {
                  showToast('Promotion campaign created.');
                  setIsNewPromoModalOpen(false);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}
            >
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Campaign Name *</label>
                <input name="name" required type="text" placeholder="e.g. Suttur Jathra Pilgrim Book Fair" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Promo Code *</label>
                  <input name="code" required type="text" placeholder="JATHRA25" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', textTransform: 'uppercase' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Discount (%) *</label>
                  <input name="discountPercent" required type="number" defaultValue="20" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Target Beneficiaries</label>
                <select name="targetAudience" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  <option value="Pilgrims & General Public">Pilgrims & General Public</option>
                  <option value="University & College Libraries">University & College Libraries</option>
                  <option value="Viraktamath & Religious Ashrams">Viraktamath & Religious Ashrams</option>
                  <option value="Registered Students & Scholars">Registered Students & Scholars</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Start Date</label>
                  <input name="startDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>End Date</label>
                  <input name="endDate" type="date" defaultValue="2026-12-31" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <input name="description" type="text" placeholder="Subsidy purpose" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Campaign</button>
                <button type="button" onClick={() => setIsNewPromoModalOpen(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PUBLISH NEW PERIODICAL ISSUE */}
      {isNewPeriodicalModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '480px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-maroon)' }}>
              Publish New Periodical Issue
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

      {/* MODAL: CATALOGUE MANUSCRIPT */}
      {isNewVachanaModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '500px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-maroon)' }}>
              Catalogue Palm-Leaf Manuscript (ತಾಳೆಗರಿ)
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const res = adminService.addVachana({
                  manuscriptRef: fd.get('manuscriptRef'),
                  poet: fd.get('poet'),
                  ankita: fd.get('ankita'),
                  vachanaCount: fd.get('vachanaCount'),
                  folios: fd.get('folios'),
                  condition: fd.get('condition'),
                  era: fd.get('era'),
                  status: 'Preservation Lab'
                });
                if (res.success) {
                  showToast('Palm-leaf codex registered in archival repository.');
                  setIsNewVachanaModalOpen(false);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}
            >
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Manuscript Ref ID *</label>
                <input name="manuscriptRef" required type="text" placeholder="e.g. MSS-SUTTUR-109" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', textTransform: 'uppercase' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Sharana Poet *</label>
                  <input name="poet" required type="text" placeholder="e.g. Siddharama" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Ankita (Mudra) *</label>
                  <input name="ankita" required type="text" placeholder="e.g. Kapilasiddha Mallikarjuna" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Vachana Count</label>
                  <input name="vachanaCount" type="number" defaultValue="250" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Leaves / Folios</label>
                  <input name="folios" type="number" defaultValue="85" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Physical Folio Condition</label>
                <input name="condition" type="text" defaultValue="Intact palm leaves treated with citronella and sesame oil" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Historical Period / Century</label>
                <input name="era" type="text" defaultValue="12th Century CE" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Codex Entry</button>
                <button type="button" onClick={() => setIsNewVachanaModalOpen(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE READING PATH */}
      {isNewReadingPathModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '520px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-maroon)' }}>
              Create Curated Reading Path
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const booksRaw = fd.get('books') || '';
                const booksList = booksRaw.split(',').map(s => s.trim()).filter(Boolean);
                const res = adminService.addReadingPath({
                  title: fd.get('title'),
                  titleKn: fd.get('titleKn'),
                  difficulty: fd.get('difficulty'),
                  estimatedHours: fd.get('estimatedHours'),
                  description: fd.get('description'),
                  books: booksList.length ? booksList : ['Sri Basaveshwara Vachana Sangraha', 'Allama Prabhu Shatsthala Vachana']
                });
                if (res.success) {
                  showToast('Reading path published.');
                  setIsNewReadingPathModalOpen(false);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}
            >
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Path Title (English) *</label>
                <input name="title" required type="text" placeholder="e.g. Masterclass in Vachana Philosophy" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Path Title (ಕನ್ನಡ)</label>
                <input name="titleKn" type="text" placeholder="ವಚನ ತತ್ವಚಿಂತನೆ ಪ್ರವೇಶ" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Reader Level</label>
                  <select name="difficulty" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced Scholar">Advanced Scholar</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Estimated Study Hours</label>
                  <input name="estimatedHours" type="number" defaultValue="15" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Curriculum Overview</label>
                <textarea name="description" rows={2} placeholder="Explain what the reader will master..." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Recommended Books (Comma separated titles)</label>
                <input name="books" type="text" placeholder="Vachana Dharmasara, Akka Mahadevi Vachana Deepike" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Reading Path</button>
                <button type="button" onClick={() => setIsNewReadingPathModalOpen(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUPPORT TICKET DETAILS & REPLY */}
      {selectedTicket && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '600px', maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-maroon)', fontWeight: 800 }}>SUPPORT TICKET {selectedTicket.id}</span>
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
                <div><strong>Scholar / Customer:</strong> {selectedTicket.customerName}</div>
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
                placeholder="Type response to scholar..."
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
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Assigned Operational Role</label>
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
    </div>
  );
}
