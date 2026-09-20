import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, MapPin, Phone, Menu, X, Globe, Truck, BookOpen, ChevronRight, ArrowRight } from 'lucide-react';
import { BOOKS } from '../data/mockData';

export default function Navbar({
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const handleLinkClick = (route, e) => {
    e.preventDefault();
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  // Filter matching books for the live search dropdown
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
    { label: 'Bulk Orders', route: '/bulk-orders' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' }
  ];

  return (
    <header className="site-header" role="banner" style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      {/* Top Utility Strip */}
      <div className="header-top-bar" style={{ backgroundColor: 'var(--color-maroon)', color: '#FAF7F2', padding: '5px 0', fontSize: '0.78rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={12} color="#E5C368" />
              <span>JSS Book House, Dr. Shivarathri Rajendra Circle, Mysuru</span>
            </span>
            <span className="desktop-only" style={{ opacity: 0.4 }}>|</span>
            <span className="desktop-only">Mon–Sat: 09:30 AM – 06:00 PM</span>
            <span className="desktop-only" style={{ opacity: 0.4 }}>|</span>
            <a href="tel:08212548212" style={{ color: '#FAF7F2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={12} color="#E5C368" />
              <span>0821-2548212</span>
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Track Consignment Button */}
            <button
              onClick={() => onOpenTrackingModal && onOpenTrackingModal()}
              style={{
                background: 'none',
                border: 'none',
                color: '#E5C368',
                cursor: 'pointer',
                fontSize: '0.76rem',
                fontWeight: 600,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
            >
              <Truck size={12} />
              <span>Track Consignment</span>
            </button>

            <span className="desktop-only" style={{ opacity: 0.4 }}>|</span>

            <button
              className="desktop-only"
              onClick={() => onNavigate('/bulk-orders')}
              style={{ background: 'none', border: 'none', color: '#FAF7F2', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, padding: 0 }}
            >
              Bulk Orders
            </button>

            <span style={{ opacity: 0.4 }}>|</span>

            <button
              onClick={() => setLanguageMode(languageMode === 'en' ? 'kn' : 'en')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.74rem',
                whiteSpace: 'nowrap'
              }}
              title="Toggle English / Kannada Display"
            >
              <Globe size={11} />
              <span>{languageMode === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container">
        <div className="header-main-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          {/* JSS Publications Brand Identity */}
          <a
            href="/"
            onClick={(e) => handleLinkClick('/', e)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
            aria-label="JSS Publications Home"
          >
            <div
              style={{
                backgroundColor: 'var(--color-maroon)',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(94, 22, 36, 0.2)'
              }}
            >
              <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="14" fill="#5E1624"/>
                <path d="M20 72 C35 60 50 65 50 82 C50 65 65 60 80 72 L80 35 C65 25 50 30 50 45 C50 30 35 25 20 35 Z" fill="#FAF7F2"/>
                <path d="M50 82 L50 45" stroke="#B84E1A" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="50" cy="22" r="8" fill="#E5C368"/>
              </svg>
            </div>
            <div>
              <span className="text-brand" style={{ fontSize: '1.18rem', fontWeight: 700, letterSpacing: '0.6px', color: 'var(--color-maroon)', display: 'block', lineHeight: 1.15 }}>
                JSS PUBLICATIONS
              </span>
              <span className="text-kannada" style={{ fontSize: '0.78rem', color: 'var(--color-saffron)', display: 'block', lineHeight: 1.2 }}>
                {languageMode === 'kn' ? 'ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ' : 'Jagadguru Sri Shivarathreeshwara Granthamale'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="desktop-only" aria-label="Main Navigation">
            <ul className="header-nav-links" style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
              {navItems.map((item) => {
                const isActive = currentRoute === item.route || (item.route !== '/' && currentRoute.startsWith(item.route));
                return (
                  <li key={item.route}>
                    <a
                      href={item.route}
                      onClick={(e) => handleLinkClick(item.route, e)}
                      className={`header-nav-link ${isActive ? 'active' : ''}`}
                      style={{
                        textDecoration: 'none',
                        fontSize: '0.92rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--color-accent-maroon)' : 'var(--color-text-charcoal)',
                        padding: '6px 4px',
                        borderBottom: isActive ? '2px solid var(--color-accent-gold)' : '2px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Actions: Live Search & Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Live Search Bar with Instant Autocomplete Dropdown */}
            <div ref={searchContainerRef} style={{ position: 'relative' }} className="desktop-only">
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
                    width: isSearchFocused || searchQuery ? '240px' : '190px',
                    padding: '7px 12px 7px 32px',
                    fontSize: '0.84rem',
                    borderRadius: 'var(--radius-pill)',
                    border: isSearchFocused ? '1px solid var(--color-accent-gold)' : '1px solid var(--color-border)',
                    backgroundColor: isSearchFocused ? '#FFFFFF' : 'var(--color-bg-cream)',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: isSearchFocused ? '0 0 0 3px rgba(197, 155, 39, 0.15)' : 'none'
                  }}
                />
                <Search
                  size={14}
                  color="var(--color-text-muted)"
                  style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: 'var(--color-text-muted)'
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Floating Instant Search Dropdown Popover */}
              {isSearchFocused && matchingBooks.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '380px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-subtle)',
                    boxShadow: '0 12px 32px rgba(94, 22, 36, 0.15)',
                    zIndex: 9999,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease-out'
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      backgroundColor: 'var(--color-bg-cream)',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-accent-maroon)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Suggested Publications
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      {matchingBooks.length} results
                    </span>
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {matchingBooks.map((book) => {
                      const coverSrc = book.cover_image || `/${book.slug}/cover.jpg`;
                      return (
                        <div
                          key={book.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            if (onSelectBook) {
                              onSelectBook(book);
                            } else {
                              onNavigate(`/books/${book.id}`);
                            }
                          }}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            padding: '10px 14px',
                            borderBottom: '1px solid var(--color-border-light)',
                            cursor: 'pointer',
                            alignItems: 'center',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-primary)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                        >
                          <img
                            src={coverSrc}
                            alt={book.title}
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="85" viewBox="0 0 60 85"><rect width="100%" height="100%" fill="%235E1624"/><text x="50%" y="50%" fill="%23FAF7F2" font-size="16" text-anchor="middle" dominant-baseline="middle">JSS</text></svg>';
                            }}
                            style={{
                              width: '38px',
                              height: '52px',
                              objectFit: 'cover',
                              borderRadius: '3px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {book.title}
                            </div>
                            {book.titleKannada && (
                              <div className="text-kannada" style={{ fontSize: '0.74rem', color: 'var(--color-accent-saffron)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {book.titleKannada}
                              </div>
                            )}
                            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                              {book.author}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-accent-maroon)' }}>
                              ₹{book.price}
                            </span>
                            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-accent-saffron)' }}>
                              Quick View →
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setIsSearchFocused(false);
                      onNavigate('/books');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'var(--color-bg-cream)',
                      border: 'none',
                      borderTop: '1px solid var(--color-border-subtle)',
                      color: 'var(--color-accent-maroon)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>View all matching books in catalogue</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => onNavigate('/cart')}
              className="btn btn-primary btn-sm"
              style={{ gap: '6px', borderRadius: 'var(--radius-pill)', padding: '6px 14px' }}
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag size={15} />
              <span className="desktop-only">Cart</span>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-maroon)',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-only btn btn-outline btn-sm"
              style={{ padding: '6px 10px' }}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--color-border)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-md)'
          }}
          className="mobile-only"
        >
          <div style={{ marginBottom: '14px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentRoute !== '/books') onNavigate('/books');
              }}
              placeholder="Search books by title, author, category..."
              className="form-input"
              style={{ padding: '8px 12px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => (
              <a
                key={item.route}
                href={item.route}
                onClick={(e) => handleLinkClick(item.route, e)}
                style={{
                  color: currentRoute === item.route ? 'var(--color-maroon)' : 'var(--color-text-charcoal)',
                  fontWeight: currentRoute === item.route ? 700 : 500,
                  fontSize: '0.95rem',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--color-border-light)'
                }}
              >
                {item.label}
              </a>
            ))}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenTrackingModal) onOpenTrackingModal();
              }}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '8px 0',
                color: 'var(--color-accent-maroon)',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Truck size={16} />
              <span>Track Consignment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
