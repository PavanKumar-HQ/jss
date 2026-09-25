import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, MapPin, Phone, Menu, X, Globe, Truck, ArrowRight } from 'lucide-react';
import { BOOKS } from '../data/mockData';
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
  onOpenTrackingModal
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const handleLinkClick = (route, e) => {
    if (e) e.preventDefault();
    onNavigate(route);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  // Filter matching books for live autocomplete dropdown
  const matchingBooks = searchQuery && searchQuery.trim().length >= 2
    ? BOOKS.filter((b) => {
        const q = searchQuery.toLowerCase();
        return (
          b.title?.toLowerCase().includes(q) ||
          b.titleKannada?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
        );
      }).slice(0, 5)
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
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          {/* Location & Hours & Phone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={12} color="#DFBF5F" />
              <span>JSS Book House, Dr. Shivarathri Rajendra Circle, Mysuru</span>
            </span>
            <span className="desktop-only" style={{ opacity: 0.35 }}>|</span>
            <span className="desktop-only">Mon–Sat: 09:30 AM – 06:00 PM</span>
            <span className="desktop-only" style={{ opacity: 0.35 }}>|</span>
            <a href="tel:08212548212" style={{ color: '#F8F5EE', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={12} color="#DFBF5F" />
              <span>0821-2548212</span>
            </a>
          </div>

          {/* Consignment, Bulk Orders, Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => onOpenTrackingModal && onOpenTrackingModal()}
              style={{
                background: 'none',
                border: 'none',
                color: '#DFBF5F',
                cursor: 'pointer',
                fontSize: '0.76rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0
              }}
            >
              <Truck size={12} />
              <span>Track Consignment</span>
            </button>

            <span style={{ opacity: 0.35 }}>|</span>

            <button
              type="button"
              onClick={() => onNavigate('/bulk-orders')}
              style={{
                background: 'none',
                border: 'none',
                color: '#F8F5EE',
                cursor: 'pointer',
                fontSize: '0.76rem',
                fontWeight: 500,
                padding: 0
              }}
            >
              Bulk Orders
            </button>

            <span style={{ opacity: 0.35 }}>|</span>

            <button
              type="button"
              onClick={() => setLanguageMode(languageMode === 'en' ? 'kn' : 'en')}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                padding: '2px 7px',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Toggle English / Kannada"
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
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
            aria-label="JSS Publications Home"
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(197, 155, 39, 0.4)',
                boxShadow: '0 2px 8px rgba(94, 22, 36, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px',
                flexShrink: 0,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="navbar-logo-wrap"
            >
              <img
                src={jssLogo}
                alt="JSS Publications Emblem Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <span className="text-brand" style={{ fontSize: '1.24rem', fontWeight: 800, letterSpacing: '0.8px', color: 'var(--color-maroon)', display: 'block', lineHeight: 1.1 }}>
                JSS PUBLICATIONS
              </span>
              <span className="text-kannada" style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', display: 'block', lineHeight: 1.2, fontWeight: 500 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                  placeholder="Search books, authors, subjects..."
                  style={{
                    width: isSearchFocused || searchQuery ? '300px' : '260px',
                    padding: '7px 12px 7px 32px',
                    fontSize: '0.84rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--color-border-dark)',
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

            {/* Mobile Search Toggle Icon */}
            <button
              type="button"
              className="mobile-only"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-charcoal)', cursor: 'pointer', padding: '6px' }}
              aria-label="Toggle mobile search"
            >
              <Search size={20} />
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => onNavigate('/cart')}
              className="btn btn-secondary btn-sm"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px'
              }}
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag size={16} color="var(--color-maroon)" />
              <span className="desktop-only" style={{ fontWeight: 600, fontSize: '0.84rem' }}>Cart</span>
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

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-charcoal)', cursor: 'pointer', padding: '6px' }}
              aria-label="Toggle mobile navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-only"
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: '#FFFFFF',
            padding: '16px 20px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
          }}
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {navItems.map((item) => (
              <li key={item.route}>
                <a
                  href={item.route}
                  onClick={(e) => handleLinkClick(item.route, e)}
                  style={{
                    fontSize: '1rem',
                    fontWeight: currentRoute === item.route ? 700 : 500,
                    color: currentRoute === item.route ? 'var(--color-maroon)' : 'var(--color-text-charcoal)',
                    display: 'block'
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('/bulk-orders');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.9rem', cursor: 'pointer', padding: 0 }}
              >
                Bulk & Institutional Orders
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
});

export default Navbar;
