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
        { id: 'promotions', label: 'Promotions', icon: Megaphone, badge: null }
      ]
    },
    {
      group: 'CONTENT',
      items: [
        { id: 'homepage-cms', label: 'Homepage CMS', icon: Home, badge: null },
        { id: 'faqs-cms', label: 'FAQs & Bilingual', icon: HelpCircle, badge: faqs.length },
        { id: 'periodicals', label: 'Periodicals', icon: Newspaper, badge: 'Prasada' },
        { id: 'vachanas', label: 'Vachanas & MSS', icon: Scroll, badge: null },
        { id: 'reading-paths', label: 'Reading Paths', icon: Compass, badge: null }
      ]
    },
    {
      group: 'OPERATIONS',
      items: [
        { id: 'customers', label: 'Customers', icon: UserCheck, badge: customers.length },
        { id: 'shipping', label: 'Shipping & PINs', icon: Truck, badge: 'Speed Post' },
        { id: 'support', label: 'Support Desk', icon: Headphones, badge: null }
      ]
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { id: 'operations-alerts', label: 'Alerts Radar', icon: AlertTriangle, badge: operationsAlerts.length ? `${operationsAlerts.length}` : null, badgeColor: '#DC2626' },
        { id: 'fraud-radar', label: 'Fraud & Abuse', icon: ShieldAlert, badge: fraudAlerts.filter(f => f.status === 'Under Review').length || null, badgeColor: '#D97706' },
        { id: 'sales-analytics', label: 'Sales Analytics', icon: TrendingUp, badge: null },
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F6F2', color: '#1C1917', fontFamily: 'var(--font-sans)' }}>
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

      {/* LEFT SIDEBAR */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#26060C',
          color: '#EDE7DC',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(197, 155, 39, 0.25)',
          overflowY: 'auto'
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

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Control Bar */}
        <header
          style={{
            height: '56px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            flexShrink: 0
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
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
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

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
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

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
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

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
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
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
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
              </div>

              {/* Books Grid / Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
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
                      .filter(b => !searchFilter || b.title.toLowerCase().includes(searchFilter.toLowerCase()))
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
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  textTransform: 'capitalize',
                                  backgroundColor: status === 'published' ? '#DCFCE7' : status === 'archived' ? '#F3F4F6' : '#FEF3C7',
                                  color: status === 'published' ? '#15803D' : status === 'archived' ? '#6B7280' : '#B45309'
                                }}
                              >
                                {status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', gap: '6px' }}>
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
                                {status !== 'archived' && (
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

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
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

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
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
    </div>
  );
}
