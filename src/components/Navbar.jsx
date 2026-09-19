import React, { useState } from 'react';
import { ShoppingBag, Search, MapPin, Phone, BookOpen, Heart, Menu, X, Layers, Globe } from 'lucide-react';

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenLocation,
  onOpenBulkEnquiry,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  languageMode,
  setLanguageMode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 900, backgroundColor: '#5E1624', color: '#FFFFFF', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
      {/* Top Utility Announcement Bar */}
      <div style={{ backgroundColor: '#3F0E18', padding: '6px 0', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenLocation}
              style={{ background: 'none', border: 'none', color: '#FBF9F5', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
              aria-label="View JSS Book House Mysuru Store Location & Hours"
            >
              <MapPin size={13} color="#C85A17" />
              <span>JSS Book House, Mysuru (09:30 AM – 06:00 PM)</span>
            </button>
            <span style={{ opacity: 0.4 }}>|</span>
            <a href="tel:08212548212" style={{ color: '#FBF9F5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={13} color="#C85A17" />
              <span>0821-2548212</span>
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onOpenBulkEnquiry}
              style={{ background: 'none', border: 'none', color: '#D97706', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Institutional & School Bulk Orders
            </button>
            <button
              onClick={() => setLanguageMode(languageMode === 'en' ? 'kn' : 'en')}
              style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
              title="Toggle Kannada / English Language Display"
            >
              <Globe size={12} />
              <span>{languageMode === 'en' ? 'ಕನ್ನಡ Display' : 'English Display'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="container" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#FBF9F5', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="16" fill="#5E1624"/>
              <path d="M20 72 C35 60 50 65 50 82 C50 65 65 60 80 72 L80 35 C65 25 50 30 50 45 C50 30 35 25 20 35 Z" fill="#FBF9F5"/>
              <path d="M50 82 L50 45" stroke="#C85A17" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="22" r="8" fill="#D97706"/>
            </svg>
          </div>
          <div>
            <span className="text-serif" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px', display: 'block', lineHeight: 1.2 }}>
              JSS PUBLICATIONS
            </span>
            <span className="text-kannada" style={{ fontSize: '0.78rem', opacity: 0.88, display: 'block', marginTop: '2px' }}>
              {languageMode === 'kn' ? 'ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ' : 'Jagadguru Sri Shivarathreeshwara Granthamale'}
            </span>
          </div>
        </div>

        {/* Live Search Input (Desktop) */}
        <div style={{ flex: 1, maxWidth: '420px', margin: '0 16px', position: 'relative' }} className="desktop-only">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={languageMode === 'kn' ? "ಪುಸ್ತಕ, ಲೇಖಕ ಅಥವಾ ವಚನ ಹುಡುಕಿ..." : "Search title, author, or series (e.g. Basavanna, Yoga)..."}
            style={{
              width: '100%',
              padding: '10px 16px 10px 38px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <Search size={16} color="#FBF9F5" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', opacity: 0.7 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Quick Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onOpenCart}
            className="btn btn-primary btn-sm"
            aria-label={`View Shopping Bag with ${cartCount} items`}
            style={{ position: 'relative' }}
          >
            <ShoppingBag size={18} />
            <span>Bag</span>
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '4px' }}
            className="mobile-only"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div style={{ backgroundColor: '#3F0E18', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalogue..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#FFF',
                fontSize: '0.9rem'
              }}
            />
            <Search size={16} color="#FFF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => { onOpenBulkEnquiry(); setIsMobileMenuOpen(false); }}
              style={{ textAlign: 'left', background: 'none', border: 'none', color: '#D97706', padding: '8px 0', fontWeight: 600, fontSize: '0.95rem' }}
            >
              Institutional & School Bulk Enquiries
            </button>
            <button
              onClick={() => { onOpenLocation(); setIsMobileMenuOpen(false); }}
              style={{ textAlign: 'left', background: 'none', border: 'none', color: '#FFF', padding: '8px 0', fontSize: '0.95rem' }}
            >
              JSS Book House Location & Operating Hours
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
