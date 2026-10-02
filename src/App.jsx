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
import FaqsPage from './pages/FaqsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AdminPage from './pages/AdminPage';
import BookPreviewModal from './components/BookPreviewModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import WishlistDrawer from './components/WishlistDrawer';
import FlippingBookLoader from './components/FlippingBookLoader';
import MobileBottomNav from './components/MobileBottomNav';
import useScrollReveal from './hooks/useScrollReveal';
import { catalogueService, cartService, recentlyViewedService, wishlistService } from './services';
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

  const [wishlistCount, setWishlistCount] = useState(() => wishlistService.getWishlist().length);

  useEffect(() => {
    return wishlistService.subscribe((list) => {
      setWishlistCount(list.length);
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

  // Scroll Restoration Map
  const scrollPositions = React.useRef({});

  // Central Router Dispatcher with scroll memory
  const navigate = useCallback((to) => {
    let clean = to;
    if (!clean.startsWith('/')) {
      clean = `/${clean}`;
    }
    if (clean === '/home') {
      clean = '/';
    }

    // Save scroll position for current route before navigating
    if (typeof window !== 'undefined') {
      scrollPositions.current[currentRoute] = window.scrollY;
    }

    try {
      window.history.pushState({ path: clean }, '', clean);
    } catch (e) {
      window.location.hash = clean;
    }

    setCurrentRoute(clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  // Unified Mobile & Desktop In-App Back Navigation Key
  const goBack = useCallback((fallback = '/') => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      navigate(fallback);
    }
  }, [navigate]);

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

  // Modal Handlers with Mobile History Layer Integration
  const handleSelectBook = useCallback((book) => {
    try {
      window.history.pushState({ modal: 'book-preview' }, '');
    } catch (e) {}
    setSelectedBook(book);
  }, []);

  const handleOpenExcerpt = useCallback((book) => {
    try {
      window.history.pushState({ modal: 'book-excerpt' }, '');
    } catch (e) {}
    setSelectedBook({ ...book, initialTab: 'excerpt' });
  }, []);

  const handleCloseBookModal = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.state?.modal) {
      window.history.back();
    } else {
      setSelectedBook(null);
    }
  }, []);

  const handleOpenTrackingModal = useCallback(() => {
    try {
      window.history.pushState({ modal: 'tracking' }, '');
    } catch (e) {}
    setIsTrackingModalOpen(true);
  }, []);

  const handleCloseTrackingModal = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.state?.modal) {
      window.history.back();
    } else {
      setIsTrackingModalOpen(false);
    }
  }, []);

  const handleOpenWishlist = useCallback(() => {
    try {
      window.history.pushState({ modal: 'wishlist' }, '');
    } catch (e) {}
    setIsWishlistOpen(true);
  }, []);

  const handleCloseWishlist = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.state?.modal) {
      window.history.back();
    } else {
      setIsWishlistOpen(false);
    }
  }, []);

  // Lock background body scroll whenever a modal or drawer is active on mobile/desktop
  useEffect(() => {
    const isModalActive = Boolean(selectedBook || isTrackingModalOpen || isWishlistOpen);
    if (isModalActive) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [selectedBook, isTrackingModalOpen, isWishlistOpen]);

  // Mobile Back Navigation Key & Browser PopState Interception
  useEffect(() => {
    const handlePopState = (event) => {
      // 1. Edge Case: If any modal or drawer is open on mobile, Back key dismisses it!
      if (selectedBook || isTrackingModalOpen || isWishlistOpen) {
        setSelectedBook(null);
        setIsTrackingModalOpen(false);
        setIsWishlistOpen(false);
        return; // Prevent navigating away from the page behind the modal
      }

      // 2. Normal Route Back Navigation
      const hash = window.location.hash.replace(/^#/, '');
      const target = hash ? (hash.startsWith('/') ? hash : `/${hash}`) : (window.location.pathname || '/');
      setCurrentRoute(target);

      // 3. Edge Case: Restore reader's scroll position on Back Navigation
      const savedY = scrollPositions.current[target];
      if (savedY !== undefined && savedY > 0) {
        setTimeout(() => {
          window.scrollTo({ top: savedY, behavior: 'auto' });
        }, 20);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedBook, isTrackingModalOpen, isWishlistOpen]);

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
    if (path === '/faqs') return { type: 'faqs' };
    if (path === '/privacy') return { type: 'privacy' };
    if (path === '/terms') return { type: 'terms' };
    if (path === '/admin' || path.startsWith('/admin')) return { type: 'admin' };

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

  // Dedicated Full-Screen Workspace for JSS Publications Enterprise Admin Suite
  if (routeView.type === 'admin') {
    return (
      <AdminPage onNavigate={navigate} />
    );
  }

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
        onOpenWishlist={handleOpenWishlist}
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
              onGoBack={goBack}
            />
          )}

          {routeView.type === 'book-detail' && (
            <BookDetailPage
              book={routeView.data}
              allBooks={products}
              onNavigate={navigate}
              onGoBack={goBack}
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
              onGoBack={goBack}
              onSelectCategory={(catName) => {
                setActiveCategory(catName);
                navigate('/books');
              }}
            />
          )}

          {routeView.type === 'bulk-orders' && (
            <BulkOrdersPage onNavigate={navigate} onGoBack={goBack} />
          )}

          {routeView.type === 'about' && (
            <AboutPage onNavigate={navigate} onGoBack={goBack} />
          )}

          {routeView.type === 'contact' && (
            <ContactPage onNavigate={navigate} onGoBack={goBack} />
          )}

          {routeView.type === 'cart' && (
            <CartPage
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onNavigate={navigate}
              onGoBack={goBack}
            />
          )}

          {routeView.type === 'checkout' && (
            <CheckoutPage
              cart={cart}
              onClearCart={handleClearCart}
              onNavigate={navigate}
              onGoBack={goBack}
            />
          )}

          {routeView.type === 'faqs' && (
            <FaqsPage onNavigate={navigate} onGoBack={goBack} />
          )}

          {routeView.type === 'privacy' && (
            <PrivacyPage onNavigate={navigate} onGoBack={goBack} />
          )}

          {routeView.type === 'terms' && (
            <TermsPage onNavigate={navigate} onGoBack={goBack} />
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
                  onClick={() => goBack('/')}
                  className="btn btn-outline"
                  style={{ padding: '12px 24px' }}
                >
                  Return to Previous Page
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

      {/* Floating Mobile Bottom Navigation Bar (≤ 768px Viewports) */}
      <MobileBottomNav
        currentRoute={currentRoute}
        onNavigate={navigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistCount}
        onOpenWishlist={handleOpenWishlist}
        onOpenMobileSearch={() => navigate('/books')}
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
          onClose={handleCloseWishlist}
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
