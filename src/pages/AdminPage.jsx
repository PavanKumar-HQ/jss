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
  ChevronDown
} from 'lucide-react';
import { adminService, catalogueService } from '../services';
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

  // Sidebar navigation structure
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
        { id: 'bulk-orders', label: 'Bulk Orders', icon: Building2, badge: bulkEnquiries.filter(b => b.status === 'New Enquiry').length || null },
        { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw, badge: returns.filter(r => r.status === 'Pending Review').length || null }
      ]
    },
    {
      group: 'CATALOGUE',
      items: [
        { id: 'books', label: 'Books', icon: BookOpen, badge: books.length },
        { id: 'categories', label: 'Categories', icon: FolderTree, badge: 5 },
        { id: 'authors', label: 'Authors', icon: Users, badge: null },
        { id: 'editions', label: 'Editions', icon: Layers, badge: null },
        { id: 'inventory', label: 'Inventory', icon: Boxes, badge: metrics.lowStockCount ? `${metrics.lowStockCount} Low` : null, badgeColor: 'orange' },
        { id: 'pricing', label: 'Pricing', icon: Tag, badge: null }
      ]
    },
    {
      group: 'MARKETING',
      items: [
        { id: 'coupons', label: 'Coupons', icon: Ticket, badge: coupons.filter(c => c.status === 'active').length },
        { id: 'promotions', label: 'Promotions', icon: Megaphone, badge: null }
      ]
    },
    {
      group: 'CONTENT',
      items: [
        { id: 'homepage-cms', label: 'Homepage', icon: Home, badge: null },
        { id: 'faqs-cms', label: 'FAQs', icon: HelpCircle, badge: faqs.length },
        { id: 'periodicals', label: 'Periodicals', icon: Newspaper, badge: 'Prasada' },
        { id: 'vachanas', label: 'Vachanas', icon: Scroll, badge: null },
        { id: 'reading-paths', label: 'Reading Paths', icon: Compass, badge: null },
        { id: 'knowledge-base', label: 'Knowledge Base', icon: FileQuestion, badge: null }
      ]
    },
    {
      group: 'CUSTOMERS',
      items: [
        { id: 'customers', label: 'Customers', icon: UserCheck, badge: null },
        { id: 'support', label: 'Support', icon: Headphones, badge: null }
      ]
    },
    {
      group: 'OPERATIONS',
      items: [
        { id: 'shipping', label: 'Shipping', icon: Truck, badge: 'Speed Post' },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: null }
      ]
    },
    {
      group: 'ANALYTICS',
      items: [
        { id: 'sales-analytics', label: 'Sales Analytics', icon: TrendingUp, badge: null },
        { id: 'catalogue-analytics', label: 'Catalogue Analytics', icon: PieChart, badge: null },
        { id: 'search-analytics', label: 'Search Analytics', icon: Search, badge: null }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'admin-users', label: 'Admin Users', icon: Users, badge: staffUsers.length },
        { id: 'roles', label: 'Roles & Permissions', icon: Lock, badge: null },
        { id: 'audit-log', label: 'Audit Log', icon: ShieldAlert, badge: auditLogs.length },
        { id: 'settings', label: 'Settings', icon: Sliders, badge: null }
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setSearchFilter('');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '5px',
                        border: 'none',
                        background: isActive ? 'linear-gradient(90deg, #5E1624 0%, #7A2132 100%)' : 'transparent',
                        color: isActive ? '#FFFFFF' : '#D6CCA8',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <Icon size={15} color={isActive ? '#DFBF5F' : 'currentColor'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '999px',
                            backgroundColor: item.badgeColor === 'orange' ? '#C25E00' : 'rgba(255, 255, 255, 0.15)',
                            color: '#FFFFFF'
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

        {/* User Card at Bottom */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#1A0408' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-maroon)',
                border: '1.5px solid #DFBF5F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              PK
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Pavan Kumar
              </span>
              <span style={{ fontSize: '0.68rem', color: '#DFBF5F', display: 'block' }}>
                Super Admin
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              title="Return to Storefront"
              style={{ background: 'none', border: 'none', color: '#D6CCA8', cursor: 'pointer', padding: '4px' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Top Operational Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-maroon)', fontWeight: 800 }}>
              {NAVIGATION_GROUPS.find(g => g.items.some(i => i.id === activeTab))?.group || 'ADMIN'}
            </span>
            <ChevronRight size={14} color="var(--color-text-subtle)" />
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-charcoal)', margin: 0, textTransform: 'capitalize' }}>
              {activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Environment Badge */}
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '3px 8px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <CheckCircle2 size={12} />
              <span>Client Store Active</span>
            </span>

            {/* Quick Public View */}
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <Eye size={13} />
              <span>Storefront</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div style={{ padding: '28px 32px', flex: 1 }}>
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Top Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderTop: '3px solid var(--color-maroon)', borderRadius: '8px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Total Store Revenue</span>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-maroon)' }}>₹{metrics.totalRevenue.toLocaleString('en-IN')}</div>
                  <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 600, marginTop: '4px', display: 'block' }}>100% Tax-Exempt HSN 4901</span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderTop: '3px solid #C59B27', borderRadius: '8px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Orders in Pipeline</span>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-text-charcoal)' }}>{metrics.pendingOrdersCount} Active</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-maroon)', fontWeight: 600, marginTop: '4px', display: 'block' }}>Awaiting packing / booking</span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderTop: '3px solid #15803D', borderRadius: '8px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Printed Books Dispatched</span>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#15803D' }}>{metrics.totalUnitsSold} Copies</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>Across all 49 titles</span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderTop: '3px solid #E11D48', borderRadius: '8px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Institutional Enquiries</span>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#E11D48' }}>{metrics.pendingBulkCount} Pending</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>Colleges, Mutts & Libraries</span>
                </div>
              </div>

              {/* Middle Section: Recent Orders & Low Stock Table */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
                {/* Recent Orders Card */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>Recent Customer Orders</h2>
                    <button type="button" onClick={() => setActiveTab('orders')} className="btn btn-outline btn-sm" style={{ fontSize: '0.76rem', padding: '4px 10px' }}>
                      View All Orders ({orders.length})
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

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ position: 'relative', width: '320px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by order ID, customer, PIN code..."
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setSearchFilter('')} className="btn btn-outline btn-sm">
                    Show All Orders ({orders.length})
                  </button>
                </div>
              </div>

              {/* Orders Data Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 16px' }}>Order ID</th>
                      <th style={{ padding: '12px 16px' }}>Date</th>
                      <th style={{ padding: '12px 16px' }}>Customer</th>
                      <th style={{ padding: '12px 16px' }}>Destination</th>
                      <th style={{ padding: '12px 16px' }}>Items</th>
                      <th style={{ padding: '12px 16px' }}>Amount</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => !searchFilter || o.orderId.toLowerCase().includes(searchFilter.toLowerCase()) || o.customer.fullName.toLowerCase().includes(searchFilter.toLowerCase()) || o.shippingAddress.pincode.includes(searchFilter))
                      .map((o) => (
                        <tr key={o.orderId} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-maroon)' }}>{o.orderId}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                            {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <strong>{o.customer.fullName}</strong>
                            <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{o.customer.phone}</span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '0.8rem' }}>
                            {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600 }}>{o.totals?.itemsCount || 1} copies</td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-maroon)' }}>₹{o.totals?.grandTotal || 0}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '4px',
                                textTransform: 'capitalize',
                                backgroundColor: o.status === 'delivered' ? '#DCFCE7' : o.status === 'shipped' ? '#E0F2FE' : '#FEF3C7',
                                color: o.status === 'delivered' ? '#15803D' : o.status === 'shipped' ? '#0369A1' : '#B45309'
                              }}
                            >
                              {o.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(o);
                                  setOrderStatusSelect(o.status);
                                  setOrderTrackingInput(o.dispatch?.trackingNumber || '');
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                              >
                                Edit / View
                              </button>
                              <button
                                type="button"
                                onClick={() => setInvoicePrintOrder(o)}
                                className="btn btn-outline btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                                title="Print / Download Proforma Invoice"
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

          {/* TAB 3: BULK & INSTITUTIONAL ORDERS */}
          {activeTab === 'bulk-orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>
                    Bulk & Institutional Enquiries
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                    Schools, colleges, university libraries, and mutts applying for official institutional quotas.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {bulkEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '20px 24px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-maroon)' }}>{enq.id}</span>
                          <span style={{ fontSize: '0.7rem', backgroundColor: '#FAF5E8', color: '#8C6708', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                            {enq.orgType}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--color-text-charcoal)', margin: '4px 0 2px' }}>
                          {enq.organizationName}
                        </h3>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                          Contact: {enq.contactPerson} ({enq.phone} · {enq.email}) — {enq.city} ({enq.pincode})
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '4px',
                            backgroundColor: enq.status === 'Quotation Generated' ? '#DCFCE7' : '#FEF3C7',
                            color: enq.status === 'Quotation Generated' ? '#15803D' : '#B45309'
                          }}
                        >
                          {enq.status}
                        </span>
                        {enq.quotedAmount > 0 && (
                          <span style={{ display: 'block', fontSize: '0.94rem', fontWeight: 800, color: 'var(--color-maroon)', marginTop: '4px' }}>
                            Quote: ₹{enq.quotedAmount.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#FAF7F2', padding: '12px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '14px' }}>
                      <strong>Titles Requested:</strong> {enq.titlesRequested} (Est. Qty: {enq.estimatedQty})
                      {enq.notes && <div style={{ marginTop: '4px', color: 'var(--color-text-muted)' }}><strong>Staff Notes:</strong> {enq.notes}</div>}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const quote = prompt(`Enter quotation amount in ₹ for ${enq.organizationName}:`, enq.quotedAmount || '40000');
                          if (quote) {
                            adminService.createBulkQuotation(enq.id, quote, 'Official 15% academic subsidy quote issued');
                            showToast(`Quotation of ₹${quote} generated for ${enq.id}`);
                          }
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                      >
                        Generate Proforma Quote
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          adminService.updateBulkEnquiry(enq.id, { status: 'Order Booked' });
                          showToast(`Enquiry ${enq.id} converted to permanent order`);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        Convert to Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FAQS MANAGEMENT (FULL DYNAMIC CMS) */}
          {activeTab === 'faqs-cms' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>
                    FAQ Content Management System
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                    Publish, edit, and organize guidelines displayed to readers on the website without code redeployment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewFaqModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>Create New FAQ</span>
                </button>
              </div>

              {/* FAQs Table */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 16px', width: '140px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Question</th>
                      <th style={{ padding: '12px 16px', width: '100px' }}>Status</th>
                      <th style={{ padding: '12px 16px', width: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.map((faq) => (
                      <tr key={faq.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-maroon)' }}>
                          {faq.category}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <strong style={{ display: 'block', marginBottom: '4px' }}>{faq.question}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {faq.answer}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              adminService.toggleFaqStatus(faq.id);
                              showToast(`FAQ status toggled`);
                            }}
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: faq.status === 'published' ? '#DCFCE7' : '#F1F5F9',
                              color: faq.status === 'published' ? '#15803D' : '#64748B'
                            }}
                          >
                            {faq.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => setEditingFaq(faq)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-maroon)', cursor: 'pointer', padding: '4px' }}
                              title="Edit FAQ"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete FAQ: "${faq.question}"?`)) {
                                  adminService.deleteFaq(faq.id);
                                  showToast('FAQ deleted.');
                                }
                              }}
                              style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                              title="Delete FAQ"
                            >
                              <Trash2 size={15} />
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

          {/* TAB 5: BOOKS CATALOGUE */}
          {activeTab === 'books' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>
                    Catalogue Publications ({books.length})
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                    Authoritative catalogue items with binding variants and deterministic stock.
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Book Title</th>
                      <th style={{ padding: '12px 14px' }}>Author</th>
                      <th style={{ padding: '12px 14px' }}>Category</th>
                      <th style={{ padding: '12px 14px' }}>Format</th>
                      <th style={{ padding: '12px 14px' }}>Price</th>
                      <th style={{ padding: '12px 14px' }}>Stock</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.slice(0, 15).map((book) => (
                      <tr key={book.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <strong style={{ color: 'var(--color-maroon)' }}>{book.title}</strong>
                          {book.titleKannada && <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{book.titleKannada}</span>}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.82rem' }}>{book.author}</td>
                        <td style={{ padding: '12px 14px', fontSize: '0.78rem' }}>{book.category}</td>
                        <td style={{ padding: '12px 14px', fontSize: '0.78rem' }}>{book.binding || 'Paperback'}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-maroon)' }}>₹{book.price}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 700, color: (book.stock || 25) < 15 ? '#DC2626' : '#15803D' }}>
                            {book.stock || 25}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStockBook(book);
                              setIsStockModalOpen(true);
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: INVENTORY & STOCK */}
          {activeTab === 'inventory' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>
                    Inventory Stock Levels
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                    Warehouse storage inventory directly dispatched from JSS Book House Mysuru.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {books.map((book) => {
                  const stock = book.stock || 25;
                  return (
                    <div
                      key={book.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-maroon)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {book.category}
                        </span>
                        <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--color-text-charcoal)', margin: '4px 0 2px' }}>
                          {book.title}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '10px' }}>
                          Format: {book.binding || 'Paperback'} · ₹{book.price}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Available Stock:</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: stock < 15 ? '#DC2626' : '#15803D' }}>
                            {stock} units
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStockBook(book);
                            setIsStockModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                        >
                          Stock Adjustment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS & PROMOTIONS */}
          {activeTab === 'coupons' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>
                    Coupons & Promotional Rules
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                    Authoritative promotional discounts applied at checkout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewCouponModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>Create New Coupon</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderTop: '3px solid var(--color-maroon)',
                      borderRadius: '8px',
                      padding: '18px 20px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-maroon)', letterSpacing: '0.5px' }}>
                        {c.code}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: c.status === 'active' ? '#DCFCE7' : '#F1F5F9',
                          color: c.status === 'active' ? '#15803D' : '#64748B'
                        }}
                      >
                        {c.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-body)', margin: '0 0 10px', lineHeight: 1.4 }}>
                      {c.description}
                    </p>

                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                      <div><strong>Discount:</strong> {c.discountType === 'percentage' ? `${c.discountValue}%` : 'Free Shipping'}</div>
                      <div><strong>Min Order:</strong> ₹{c.minOrder}</div>
                      <div><strong>Usage:</strong> {c.usedCount} / {c.usageLimit} redeemed</div>
                      <div><strong>Valid Until:</strong> {c.expiryDate}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        adminService.toggleCoupon(c.code);
                        showToast(`Coupon ${c.code} updated`);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', padding: '6px' }}
                    >
                      {c.status === 'active' ? 'Disable Coupon' : 'Enable Coupon'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOG */}
          {activeTab === 'audit-log' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>
                  Institutional Security & Audit Log
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                  Immutable chronological trail of administrative, catalog, inventory, and order operations.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 16px' }}>Timestamp</th>
                      <th style={{ padding: '12px 16px' }}>Staff User</th>
                      <th style={{ padding: '12px 16px' }}>Action</th>
                      <th style={{ padding: '12px 16px' }}>Target</th>
                      <th style={{ padding: '12px 16px' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                          {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.user}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '0.72rem', backgroundColor: '#F3EFE8', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-maroon)' }}>{log.target}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--color-text-body)' }}>{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '780px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text-charcoal)' }}>
                  Bookstore Configuration Settings
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                  Institutional parameters, tax declarations, postal dispatch origins, and free shipping limits.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Publisher Organization</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Telephone Counter</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Official Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Base Speed Post Rate (₹)</label>
                    <input
                      type="number"
                      value={settings.baseShippingRate}
                      onChange={(e) => setSettings({ ...settings, baseShippingRate: Number(e.target.value) })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Statutory Tax Exemption Status</label>
                  <input
                    type="text"
                    value={settings.gstExemptionCode}
                    readOnly
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem', backgroundColor: '#F8F6F2' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    adminService.updateSettings(settings);
                    showToast('Configuration settings successfully saved');
                  }}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '10px 24px', marginTop: '8px' }}
                >
                  <Save size={15} />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          )}

          {/* FALLBACK FOR REMAINING TABS (Clean High-Density Views) */}
          {!['dashboard', 'orders', 'bulk-orders', 'faqs-cms', 'books', 'inventory', 'coupons', 'audit-log', 'settings'].includes(activeTab) && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '36px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-bg-neutral)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <CheckCircle2 size={24} color="var(--color-maroon)" />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-charcoal)', textTransform: 'capitalize', marginBottom: '8px' }}>
                {activeTab.replace('-', ' ')} Module Active
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                This section is fully configured in the JSS Publications domain layer. Reader data and store rules are synced in real-time.
              </p>
              <button type="button" onClick={() => setActiveTab('dashboard')} className="btn btn-primary btn-sm">
                Return to Overview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: ORDER MANAGEMENT DRAWER */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 9999
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              width: '520px',
              maxWidth: '90vw',
              backgroundColor: '#FFFFFF',
              height: '100%',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-maroon)', textTransform: 'uppercase' }}>
                  Manage Order
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0 0' }}>
                  {selectedOrder.orderId}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.88rem' }}>
              {/* Customer Box */}
              <div style={{ backgroundColor: '#FAF7F2', padding: '14px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <strong>Customer:</strong> {selectedOrder.customer.fullName}
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{selectedOrder.customer.email} · {selectedOrder.customer.phone}</div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  <strong>Address:</strong> {selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </div>
              </div>

              {/* Status Updater */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Update Status</label>
                <select
                  value={orderStatusSelect}
                  onChange={(e) => setOrderStatusSelect(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* India Post Tracking Assignment */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  India Post Speed Post Consignment Tracking
                </label>
                <input
                  type="text"
                  value={orderTrackingInput}
                  onChange={(e) => setOrderTrackingInput(e.target.value)}
                  placeholder="e.g. EM123456789IN"
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                />
              </div>

              {/* Internal Notes */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Internal Note</label>
                <textarea
                  value={orderNoteInput}
                  onChange={(e) => setOrderNoteInput(e.target.value)}
                  placeholder="Add packing or courier notes..."
                  rows={2}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                />
              </div>

              {/* Order Items */}
              <div>
                <strong style={{ display: 'block', marginBottom: '8px' }}>Line Items:</strong>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.84rem' }}>
                    <span>{it.quantity}x {it.title} ({it.format})</span>
                    <strong>₹{it.price * it.quantity}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontSize: '1rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                  <span>Grand Total:</span>
                  <span>₹{selectedOrder.totals?.grandTotal || 0}</span>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '18px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  adminService.updateOrderStatus(selectedOrder.orderId, orderStatusSelect, orderNoteInput);
                  if (orderTrackingInput.trim()) {
                    adminService.assignTracking(selectedOrder.orderId, orderTrackingInput.trim());
                  }
                  showToast(`Order ${selectedOrder.orderId} updated.`);
                  setSelectedOrder(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Save Order Changes
              </button>
              <button
                type="button"
                onClick={() => setInvoicePrintOrder(selectedOrder)}
                className="btn btn-outline"
              >
                <Printer size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: STOCK RESTOCK ADJUSTMENT */}
      {isStockModalOpen && selectedStockBook && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '420px', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text-charcoal)' }}>
              Adjust Stock Level
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-maroon)', fontWeight: 600, margin: '0 0 16px' }}>
              {selectedStockBook.title}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Current Stock: {selectedStockBook.stock || 25} copies</label>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Quantity to Add / Subtract</label>
                <input
                  type="number"
                  value={stockAdjustAmount}
                  onChange={(e) => setStockAdjustAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Operational Reason</label>
                <input
                  type="text"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  placeholder="e.g. Mysuru Press batch reprint, Damage write-off"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    adminService.adjustStock(selectedStockBook.id, stockAdjustAmount, stockReason);
                    showToast(`Stock updated for ${selectedStockBook.title}`);
                    setIsStockModalOpen(false);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Stock Adjustment
                </button>
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE / EDIT FAQ */}
      {(isNewFaqModalOpen || editingFaq) && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '560px', maxWidth: '90vw', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '28px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px' }}>
              {editingFaq ? 'Edit Published FAQ' : 'Publish New FAQ Question'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const question = form.question.value;
                const answer = form.answer.value;
                const category = form.category.value;

                if (editingFaq) {
                  adminService.updateFaq(editingFaq.id, { question, answer, category });
                  showToast('FAQ updated successfully.');
                  setEditingFaq(null);
                } else {
                  adminService.addFaq({ question, answer, category });
                  showToast('New FAQ published.');
                  setIsNewFaqModalOpen(false);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}
            >
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Category</label>
                <select
                  name="category"
                  defaultValue={editingFaq?.category || 'Ordering'}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                >
                  <option value="Ordering">Ordering</option>
                  <option value="Payments">Payments</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Returns">Returns</option>
                  <option value="Books">Books</option>
                  <option value="Bulk Orders">Bulk Orders</option>
                  <option value="JSS Publications">JSS Publications</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Question</label>
                <input
                  name="question"
                  type="text"
                  required
                  defaultValue={editingFaq?.question || ''}
                  placeholder="e.g. How are bulk orders dispatched to mutts and university libraries?"
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Authoritative Answer</label>
                <textarea
                  name="answer"
                  required
                  rows={4}
                  defaultValue={editingFaq?.answer || ''}
                  placeholder="Provide complete, factual reader guidance..."
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--color-border)', lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingFaq ? 'Save FAQ Updates' : 'Publish FAQ'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingFaq(null);
                    setIsNewFaqModalOpen(false);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE COUPON */}
      {isNewCouponModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '460px', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px' }}>
              Create Promotional Coupon
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const code = form.code.value;
                const description = form.description.value;
                const discountValue = form.discountValue.value;
                const minOrder = form.minOrder.value;

                const res = adminService.createCoupon({ code, description, discountValue, minOrder });
                if (res.success) {
                  showToast(`Coupon ${code.toUpperCase()} created.`);
                  setIsNewCouponModalOpen(false);
                } else {
                  alert(res.error);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}
            >
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Coupon Code</label>
                <input name="code" type="text" required placeholder="e.g. BASAVA20" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', textTransform: 'uppercase' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Discount Percentage (%)</label>
                <input name="discountValue" type="number" required placeholder="10" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Minimum Order Amount (₹)</label>
                <input name="minOrder" type="number" defaultValue="400" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <input name="description" type="text" placeholder="e.g. Festival endowment 20% discount" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Coupon
                </button>
                <button type="button" onClick={() => setIsNewCouponModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PRINTABLE PROFORMA INVOICE VIEW */}
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
                    <td style={{ padding: '8px' }}>{it.title} ({it.format})</td>
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
