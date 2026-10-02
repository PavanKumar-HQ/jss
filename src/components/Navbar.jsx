import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, MapPin, Phone, Menu, X, Globe, Truck, ArrowRight, Bookmark } from 'lucide-react';
import { wishlistService, searchService } from '../services';
import jssLogo from '../assets/jss-logo.webp';

const Navbar = React.memo(function Navbar({
  currentRoute,
  onNavigate,
  cartCount,
  searchQuery,
  setSearchQuery,
  languageMode,
  setLanguageMode,
  onSelectBook,
  onOpenTrackingModal,
  onOpenWishlist
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(() => wishlistService.getWishlist().length);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    return wishlistService.subscribe((list) => {
      setWishlistCount(list.length);
    });
  }, []);

  // Intercept mobile back button and Escape key to close mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleMobileBack = () => {
      setIsMobileMenuOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    window.addEventListener('popstate', handleMobileBack);
    window.addEventListener('keydown', handleKeyDown);

    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handleMobileBack);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = (route, e) => {
    if (e) e.preventDefault();
    onNavigate(route);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  // Filter matching books for live autocomplete dropdown using searchService
  const matchingBooks = searchQuery && searchQuery.trim().length >= 2
    ? searchService.getQuickSuggestions(searchQuery, 6)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navItems = [
    { label: 'Home', route: '/' },
    { label: 'Books', route: '/books' },
    { label: 'Categories', route: '/categories' },
    { label: 'About', route: '/about' },
    { label: 'Bulk Orders', route: '/bulk-orders' },
    { label: 'Contact', route: '/contact' }
  ];

  return (
    <header className="site-header" role="banner">
      {/* 1. TOP UTILITY BAR */}
      <div className="header-top-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          {/* Location & Hours & Phone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={12} color="#DFBF5F" />
              <span>JSS Book House, Dr. Shivarathri Rajendra Circle, Mysuru</span>
            </span>
            <span className="desktop-only" style={{ opacity: 0.35 }}>|</span>
            <span className="desktop-only">Mon–Sat: 09:30 AM – 06:00 PM</span>
            <span className="desktop-only" style={{ opacity: 0.35 }}>|</span>
            <a href="tel:08212548212" style={{ color: '#F8F5EE', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.76rem' }}>
              <Phone size={12} color="#DFBF5F" />
              <span>0821-2548212</span>
            </a>
          </div>

          {/* Consignment, Bulk Orders, Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => onOpenTrackingModal && onOpenTrackingModal()}
              className="top-bar-btn top-bar-btn-gold"
              title="Track consignment shipping"
            >
              <Truck size={12} />
              <span className="desktop-only">Track Consignment</span>
              <span className="mobile-only">Track</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/bulk-orders')}
              className="top-bar-btn desktop-only"
              title="Institutional bulk enquiries"
            >
              <span>Bulk Orders</span>
            </button>

            <span className="desktop-only" style={{ opacity: 0.35 }}>|</span>

            <button
              type="button"
              onClick={() => onNavigate('/faqs')}
              className="top-bar-btn desktop-only"
              title="Frequently Asked Questions"
            >
              <span>FAQs</span>
            </button>

            <span className="desktop-only" style={{ opacity: 0.35 }}>|</span>

            <button
              type="button"
              onClick={() => setLanguageMode(languageMode === 'en' ? 'kn' : 'en')}
              className="top-bar-lang-btn"
              title="Toggle English / Kannada"
              aria-label="Toggle language"
            >
              <Globe size={11} />
              <span>{languageMode === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER: [Logo] [Home] [Books] [Categories] [About] [Contact] [Search........................] [Cart] */}
      <div className="container">
        <div className="header-main-bar">
          {/* Logo & Publisher Identity */}
          <a
            href="/"
            onClick={(e) => handleLinkClick('/', e)}
            className="navbar-brand-link"
            aria-label="JSS Publications Home"
          >
            <div className="navbar-logo-wrap">
              <img
                src={jssLogo}
                alt="JSS Publications Emblem Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className="navbar-brand-text-wrap">
              <span className="navbar-brand-title">
                JSS PUBLICATIONS
              </span>
              <span className="navbar-brand-subtitle text-kannada">
                {languageMode === 'kn' ? 'ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ · ಮೈಸೂರು' : 'ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ · Mysuru'}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="desktop-only" aria-label="Main Navigation">
            <ul className="header-nav-links">
              {navItems.map((item) => {
                const isActive = currentRoute === item.route || (item.route !== '/' && currentRoute.startsWith(item.route));
                return (
                  <li key={item.route}>
                    <a
                      href={item.route}
                      onClick={(e) => handleLinkClick(item.route, e)}
                      className={`header-nav-link ${isActive ? 'active' : ''}`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop Search & Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Prominent Search Box */}
            <div ref={searchContainerRef} className="desktop-only" style={{ position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsSearchFocused(false);
                      onNavigate('/books');
                    }
                  }}
                  placeholder="Search books, authors..."
                  style={{
                    width: isSearchFocused || searchQuery ? '240px' : '180px',
                    padding: '7px 12px 7px 32px',
                    fontSize: '0.84rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                />
                <Search
                  size={14}
                  color="var(--color-text-muted)"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Instant Search Autocomplete Dropdown */}
              {isSearchFocused && matchingBooks.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xs)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '6px 10px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', backgroundColor: 'var(--color-bg-neutral)' }}>
                    Matching Publications ({matchingBooks.length})
                  </div>
                  {matchingBooks.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsSearchFocused(false);
                        if (onSelectBook) onSelectBook(item);
                      }}
                      style={{
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        fontSize: '0.84rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-ivory)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <div>
                        <strong style={{ display: 'block', color: 'var(--color-text-charcoal)' }}>{item.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.author} · ₹{item.price}</span>
                      </div>
                      <ArrowRight size={13} color="var(--color-maroon)" />
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setIsSearchFocused(false);
                      onNavigate('/books');
                    }}
                    style={{
                      padding: '8px 10px',
                      textAlign: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--color-maroon)',
                      backgroundColor: 'var(--color-bg-neutral)',
                      cursor: 'pointer'
                    }}
                  >
                    View all matching results in Catalogue →
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Header Action Cluster: Search + Cart + Hamburger (clean spacing, zero overlap) */}
            <button
              type="button"
              className="header-mobile-icon-btn mobile-only"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Toggle mobile search"
            >
              <Search size={18} />
            </button>

            {/* Study Reading List / Wishlist Button (Desktop Only) */}
            <button
              type="button"
              onClick={() => onOpenWishlist && onOpenWishlist()}
              className="btn btn-secondary btn-sm desktop-only"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px'
              }}
              aria-label={`Study Reading List with ${wishlistCount} items`}
              title="View Study Reading List"
            >
              <Bookmark size={15} color="var(--color-maroon)" fill={wishlistCount > 0 ? '#DFBF5F' : 'none'} />
              <span style={{ fontWeight: 600, fontSize: '0.84rem' }}>Study List</span>
              {wishlistCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#C59B27',
                    color: '#2A060E',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-pill)',
                    padding: '1px 6px',
                    lineHeight: 1.2
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button (Desktop Only) */}
            <button
              type="button"
              onClick={() => onNavigate('/cart')}
              className="btn btn-secondary btn-sm desktop-only"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px'
              }}
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag size={16} color="var(--color-maroon)" />
              <span style={{ fontWeight: 600, fontSize: '0.84rem' }}>Cart</span>
              {cartCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--color-maroon)',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-pill)',
                    padding: '1px 6px',
                    lineHeight: 1.2
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Quick Cart Button */}
            <button
              type="button"
              onClick={() => onNavigate('/cart')}
              className="header-mobile-icon-btn mobile-only"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="header-mobile-badge">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="header-mobile-icon-btn mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Expanded Box */}
        {isMobileSearchOpen && (
          <div className="mobile-only" style={{ padding: '8px 0 12px' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsMobileSearchOpen(false);
                onNavigate('/books');
              }}
              style={{ position: 'relative' }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, subjects..."
                className="form-input"
                style={{ padding: '8px 12px 8px 32px', fontSize: '0.86rem' }}
                autoFocus
              />
              <Search
                size={15}
                color="var(--color-text-muted)"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Slide-Over Navigation Drawer with Backdrop Blur */}
      {isMobileMenuOpen && (
        <div
          className="nav-drawer-overlay mobile-only"
          onClick={() => setIsMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          <div
            className="nav-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="nav-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="nav-drawer-logo">
                  <img src={jssLogo} alt="JSS Publications Crest" />
                </div>
                <div>
                  <strong style={{ fontSize: '1rem', color: 'var(--color-maroon)', display: 'block', lineHeight: 1.1 }}>
                    JSS PUBLICATIONS
                  </strong>
                  <span className="text-kannada" style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    ಜೆಎಸ್ಎಸ್ ಮಹಾವಿದ್ಯಾಪೀಠ · ಮೈಸೂರು
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-drawer-close-btn"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Language Switcher Strip inside Drawer */}
            <div className="nav-drawer-lang-strip">
              <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Language / ಭಾಷೆ:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setLanguageMode('en')}
                  className={`nav-drawer-lang-toggle ${languageMode === 'en' ? 'active' : ''}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguageMode('kn')}
                  className={`nav-drawer-lang-toggle ${languageMode === 'kn' ? 'active' : ''}`}
                >
                  ಕನ್ನಡ
                </button>
              </div>
            </div>

            {/* Drawer Navigation Links */}
            <div className="nav-drawer-scroll">
              <ul className="nav-drawer-list">
                {navItems.map((item) => {
                  const isActive = currentRoute === item.route;
                  return (
                    <li key={item.route}>
                      <a
                        href={item.route}
                        onClick={(e) => handleLinkClick(item.route, e)}
                        className={`nav-drawer-link ${isActive ? 'active' : ''}`}
                      >
                        <span>{item.label}</span>
                        <ArrowRight size={14} className="nav-drawer-arrow" />
                      </a>
                    </li>
                  );
                })}

                <li>
                  <a
                    href="/faqs"
                    onClick={(e) => handleLinkClick('/faqs', e)}
                    className={`nav-drawer-link ${currentRoute === '/faqs' ? 'active' : ''}`}
                  >
                    <span>Frequently Asked Questions (FAQs)</span>
                    <ArrowRight size={14} className="nav-drawer-arrow" />
                  </a>
                </li>
              </ul>

              {/* Action Buttons in Drawer */}
              <div className="nav-drawer-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenWishlist) onOpenWishlist();
                  }}
                  className="btn btn-secondary nav-drawer-action-btn"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bookmark size={16} color="var(--color-maroon)" fill={wishlistCount > 0 ? '#DFBF5F' : 'none'} />
                    <span>My Study List</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenTrackingModal) onOpenTrackingModal();
                  }}
                  className="btn btn-outline nav-drawer-action-btn"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: '8px' }}
                >
                  <Truck size={16} color="var(--color-maroon)" />
                  <span>Track Consignment</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/bulk-orders');
                  }}
                  className="btn btn-institutional-gold nav-drawer-action-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Bulk & Institutional Orders</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Quick Contact & Store Info */}
              <div className="nav-drawer-contact-box">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={14} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color="var(--color-maroon)" />
                  <a href="tel:08212548212" style={{ fontSize: '0.8rem', color: 'var(--color-maroon)', fontWeight: 700, textDecoration: 'none' }}>
                    0821-2548212
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

export default Navbar;
