import React from 'react';
import { Home, BookOpen, Search, Bookmark, ShoppingBag } from 'lucide-react';

export default function MobileBottomNav({
  currentRoute,
  onNavigate,
  cartCount = 0,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenMobileSearch
}) {
  const isHome = currentRoute === '/' || currentRoute === '/home';
  const isBooks = currentRoute === '/books' || currentRoute.startsWith('/book/');
  const isCart = currentRoute === '/cart';

  const handleNav = (target, e) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <button
        type="button"
        onClick={(e) => handleNav('/', e)}
        className={`mobile-bottom-nav-item ${isHome ? 'active' : ''}`}
        aria-label="Home"
      >
        <div className="mobile-bottom-icon-wrap">
          <Home size={20} strokeWidth={isHome ? 2.4 : 1.8} />
        </div>
        <span className="mobile-bottom-label">Home</span>
      </button>

      <button
        type="button"
        onClick={(e) => handleNav('/books', e)}
        className={`mobile-bottom-nav-item ${isBooks ? 'active' : ''}`}
        aria-label="Books Catalogue"
      >
        <div className="mobile-bottom-icon-wrap">
          <BookOpen size={20} strokeWidth={isBooks ? 2.4 : 1.8} />
        </div>
        <span className="mobile-bottom-label">Books</span>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (onOpenMobileSearch) {
            onOpenMobileSearch();
          } else {
            handleNav('/books', e);
          }
        }}
        className="mobile-bottom-nav-item"
        aria-label="Search Publications"
      >
        <div className="mobile-bottom-icon-wrap">
          <Search size={20} strokeWidth={1.8} />
        </div>
        <span className="mobile-bottom-label">Search</span>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (onOpenWishlist) {
            onOpenWishlist();
          }
        }}
        className="mobile-bottom-nav-item"
        aria-label={`Study Reading List with ${wishlistCount} saved titles`}
      >
        <div className="mobile-bottom-icon-wrap">
          <Bookmark size={20} strokeWidth={1.8} fill={wishlistCount > 0 ? '#DFBF5F' : 'none'} color={wishlistCount > 0 ? '#8C6708' : 'currentColor'} />
          {wishlistCount > 0 && (
            <span className="mobile-bottom-badge mobile-bottom-badge-gold">
              {wishlistCount > 9 ? '9+' : wishlistCount}
            </span>
          )}
        </div>
        <span className="mobile-bottom-label">Study List</span>
      </button>

      <button
        type="button"
        onClick={(e) => handleNav('/cart', e)}
        className={`mobile-bottom-nav-item ${isCart ? 'active' : ''}`}
        aria-label={`Shopping Cart with ${cartCount} items`}
      >
        <div className="mobile-bottom-icon-wrap">
          <ShoppingBag size={20} strokeWidth={isCart ? 2.4 : 1.8} />
          {cartCount > 0 && (
            <span className="mobile-bottom-badge">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
        <span className="mobile-bottom-label">Cart</span>
      </button>
    </nav>
  );
}
