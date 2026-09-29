import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { BOOKS } from './data/mockData';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import BookDetailPage from './pages/BookDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import BulkOrdersPage from './pages/BulkOrdersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BookPreviewModal from './components/BookPreviewModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import WishlistDrawer from './components/WishlistDrawer';
import FlippingBookLoader from './components/FlippingBookLoader';
import useScrollReveal from './hooks/useScrollReveal';
import { catalogueService, cartService, recentlyViewedService } from './services';
import { updateSEO } from './utils/seo';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Activate dynamic scroll reveal globally
  useScrollReveal();

  // Loading animation only on first load and browser refresh
  const [initialLoading, setInitialLoading] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeLoader(true);
      const hideTimer = setTimeout(() => {
        setInitialLoading(false);
      }, 400);
      return () => clearTimeout(hideTimer);
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  const [products] = useState(BOOKS);
  const [languageMode, setLanguageMode] = useState('en');

  // Client-Side Routing State
  const getInitialRoute = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) return hash.startsWith('/') ? hash : `/${hash}`;
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);

  // Unified Modal State (Quick Preview & Sample Excerpt Merged)
  const [selectedBook, setSelectedBook] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Cart State (Synchronized with cartService domain layer)
  const [cart, setCart] = useState(() => cartService.getCart());

  useEffect(() => {
    return cartService.subscribe((updatedCart) => {
      setCart(updatedCart);
    });
  }, []);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeSeries, setActiveSeries] = useState('All Series');
  const [activeLanguage, setActiveLanguage] = useState('All Languages');
  const [priceMax, setPriceMax] = useState(2000);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    const timer = setTimeout(() => setToastMessage(''), 2800);
    return () => clearTimeout(timer);
  }, []);

  // Browser Navigation History Listener
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentRoute(hash.startsWith('/') ? hash : `/${hash}`);
      } else {
        setCurrentRoute(window.location.pathname || '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Central Router Dispatcher (Memoized)
  const navigate = useCallback((to) => {
    let clean = to;
    if (!clean.startsWith('/')) {
      clean = `/${clean}`;
    }
    if (clean === '/home') {
      clean = '/';
    }

    try {
      window.history.pushState({}, '', clean);
    } catch (e) {
      window.location.hash = clean;
    }

    setCurrentRoute(clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Domain Service Cart Operations
  const handleAddToCart = useCallback((bookToAdd) => {
    const format = bookToAdd.selectedVariant || bookToAdd.format || 'Paperback';
    const qty = bookToAdd.quantity || 1;
    const result = cartService.addItem(bookToAdd, format, qty);

    if (result.hitMaxLimit) {
      showToast(`Maximum limit of 10 reached for "${bookToAdd.title}"`);
    } else {
      showToast(`Added "${bookToAdd.title}" to cart`);
    }
  }, [showToast]);

  const handleUpdateQuantity = useCallback((id, format, newQty) => {
    cartService.updateQuantity(id, format, newQty);
  }, []);

  const handleRemoveFromCart = useCallback((id, format) => {
    cartService.removeItem(id, format);
  }, []);

  const handleClearCart = useCallback(() => {
    cartService.clearCart();
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('All Categories');
    setActiveSeries('All Series');
    setActiveLanguage('All Languages');
    setPriceMax(2000);
  }, []);

  // Modal Handlers
  const handleSelectBook = useCallback((book) => {
    setSelectedBook(book);
  }, []);

  const handleOpenExcerpt = useCallback((book) => {
    setSelectedBook({ ...book, initialTab: 'excerpt' });
  }, []);

  const handleCloseBookModal = useCallback(() => {
    setSelectedBook(null);
  }, []);

  const handleOpenTrackingModal = useCallback(() => {
    setIsTrackingModalOpen(true);
  }, []);

  const handleCloseTrackingModal = useCallback(() => {
    setIsTrackingModalOpen(false);
  }, []);

  // Parse Route and Determine Active View
  const routeView = useMemo(() => {
    const path = (currentRoute || '/').split('?')[0].trim();

    // Root / Home
    if (path === '/' || path === '' || path === '/home') {
      return { type: 'home' };
    }

    // Book Detail Route: /books/:id or /books/:slug
    if (path.startsWith('/books/')) {
      const bookSlug = path.replace('/books/', '').trim();
      const matchedBook = catalogueService.getBookBySlug(bookSlug) || 
        catalogueService.getBookById(bookSlug) || 
        products.find((b) => String(b.id) === String(bookSlug) || (b.slug && b.slug === bookSlug));
      return { type: 'book-detail', data: matchedBook, slug: bookSlug };
    }

    if (path === '/books') return { type: 'books' };
    if (path === '/categories') return { type: 'categories' };
    if (path === '/bulk-orders') return { type: 'bulk-orders' };
    if (path === '/about') return { type: 'about' };
    if (path === '/contact') return { type: 'contact' };
    if (path === '/cart') return { type: 'cart' };
    if (path === '/checkout') return { type: 'checkout' };

    // Unknown or unmapped route -> dedicated 404 view
    return { type: 'not-found', path };
  }, [currentRoute, products]);

  // Execute Dynamic SEO, AEO, and Schema.org Structured Data Updates
  useEffect(() => {
    updateSEO({
      route: currentRoute,
      routeType: routeView.type,
      book: routeView.data,
      category: activeCategory,
      searchQuery
    });

    if (routeView.type === 'book-detail' && routeView.data?.id) {
      recentlyViewedService.recordView(routeView.data.id);
    }
  }, [routeView, currentRoute, activeCategory, searchQuery]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      
      {/* Institutional Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        languageMode={languageMode}
        setLanguageMode={setLanguageMode}
        onSelectBook={handleSelectBook}
        onOpenTrackingModal={handleOpenTrackingModal}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main Routed Page Content */}
      <main style={{ flex: 1 }}>
        {routeView.type === 'home' && (
            <HomePage
              products={products}
              onNavigate={navigate}
              onSelectBook={handleSelectBook}
              onOpenExcerpt={handleOpenExcerpt}
              onAddToCart={handleAddToCart}
              cart={cart}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              languageMode={languageMode}
            />
          )}

          {routeView.type === 'books' && (
            <CataloguePage
              products={products}
              onSelectBook={handleSelectBook}
              onOpenExcerpt={handleOpenExcerpt}
              onAddToCart={handleAddToCart}
              cart={cart}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeSeries={activeSeries}
              setActiveSeries={setActiveSeries}
              activeLanguage={activeLanguage}
              setActiveLanguage={setActiveLanguage}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              onResetFilters={handleResetFilters}
              onNavigate={navigate}
            />
          )}

          {routeView.type === 'book-detail' && (
            <BookDetailPage
              book={routeView.data}
              allBooks={products}
              onNavigate={navigate}
              onAddToCart={handleAddToCart}
              onBuyNow={(b) => {
                handleAddToCart(b);
                navigate('/cart');
              }}
              cart={cart}
              languageMode={languageMode}
            />
          )}

          {routeView.type === 'categories' && (
            <CategoriesPage
              onNavigate={navigate}
              onSelectCategory={(catName) => {
                setActiveCategory(catName);
                navigate('/books');
              }}
            />
          )}

          {routeView.type === 'bulk-orders' && (
            <BulkOrdersPage onNavigate={navigate} />
          )}

          {routeView.type === 'about' && (
            <AboutPage onNavigate={navigate} />
          )}

          {routeView.type === 'contact' && (
            <ContactPage onNavigate={navigate} />
          )}

          {routeView.type === 'cart' && (
            <CartPage
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onNavigate={navigate}
            />
          )}

          {routeView.type === 'checkout' && (
            <CheckoutPage
              cart={cart}
              onClearCart={handleClearCart}
              onNavigate={navigate}
            />
          )}

          {routeView.type === 'not-found' && (
            <section
              className="container"
              style={{
                padding: '90px 20px',
                textAlign: 'center',
                maxWidth: '680px',
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              aria-label="Page Not Found"
            >
              <span
                className="badge badge-maroon"
                style={{ marginBottom: '16px', letterSpacing: '0.8px', textTransform: 'uppercase' }}
              >
                404 · Archival Reference Missing
              </span>
              <h1
                className="text-serif"
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                  color: 'var(--color-maroon)',
                  marginBottom: '14px',
                  fontWeight: 700
                }}
              >
                Publication or Folio Not Located
              </h1>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '1.02rem',
                  lineHeight: 1.65,
                  marginBottom: '32px'
                }}
              >
                The page or publication you requested at <code>{routeView.path || currentRoute}</code> could not be located in the JSS Granthamale archives. It may have been catalogued under an updated series reference.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => navigate('/books')}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  Browse Complete Catalogue (49 Books)
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-outline"
                  style={{ padding: '12px 24px' }}
                >
                  Return to Home
                </button>
              </div>
            </section>
          )}
      </main>

      {/* Institutional 4-Column Footer */}
      <Footer
        onNavigate={navigate}
        onOpenLocation={() => navigate('/contact')}
        onOpenBulkEnquiry={() => navigate('/bulk-orders')}
        onOpenTrackingModal={handleOpenTrackingModal}
      />

      {/* Suspended Modals */}
      <Suspense fallback={null}>
        {selectedBook && (
          <BookPreviewModal
            book={selectedBook}
            onClose={handleCloseBookModal}
            onAddToCart={handleAddToCart}
            onNavigate={navigate}
          />
        )}

        {isTrackingModalOpen && (
          <OrderTrackingModal
            isOpen={isTrackingModalOpen}
            onClose={handleCloseTrackingModal}
          />
        )}

        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          onNavigate={navigate}
          onAddToCart={handleAddToCart}
        />
      </Suspense>

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--color-maroon)',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: 'var(--radius-xs)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            border: '1px solid #DFBF5F',
            zIndex: 9999,
            fontSize: '0.86rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={16} color="#DFBF5F" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Initial Page Loading Overlay with Flipping Book Animation */}
      {initialLoading && (
        <div
          className="initial-page-loader-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FAF7F2',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: fadeLoader ? 0 : 1,
            pointerEvents: fadeLoader ? 'none' : 'auto',
            transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <FlippingBookLoader
            message="Jagadguru Sri Shivarathreeshwara Granthamale"
            subtitle="ಜ್ಞಾನವೇ ಬೆಳಕು · ಜೆಎಸ್‌ಎಸ್ ಪ್ರಕಾಶನ, ಮೈಸೂರು"
          />
        </div>
      )}

    </div>
  );
}
