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
import FlippingBookLoader from './components/FlippingBookLoader';
import useScrollReveal from './hooks/useScrollReveal';
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

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('jss_granthamale_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jss_granthamale_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not persist cart:', e);
    }
  }, [cart]);

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

  // Memoized Cart Operations
  const handleAddToCart = useCallback((bookToAdd) => {
    const format = bookToAdd.selectedVariant || bookToAdd.format || 'Paperback';
    const qty = bookToAdd.quantity || 1;
    const price = bookToAdd.price;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === bookToAdd.id && (item.format || 'Paperback') === format
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      }
      return [
        ...prevCart,
        {
          id: bookToAdd.id,
          title: bookToAdd.title,
          titleKannada: bookToAdd.titleKannada,
          author: bookToAdd.author,
          category: bookToAdd.category,
          cover_image: bookToAdd.cover_image || bookToAdd.imageUrl,
          webpImage: bookToAdd.webpImage,
          price: price,
          format: format,
          quantity: qty
        }
      ];
    });

    showToast(`Added "${bookToAdd.title}" to cart`);
  }, [showToast]);

  const handleUpdateQuantity = useCallback((id, format, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => !(item.id === id && (item.format || 'Paperback') === (format || 'Paperback'))));
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && (item.format || 'Paperback') === (format || 'Paperback')
          ? { ...item, quantity: newQty }
          : item
      )
    );
  }, []);

  const handleRemoveFromCart = useCallback((id, format) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === id && (item.format || 'Paperback') === (format || 'Paperback'))
      )
    );
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
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
    const path = currentRoute.split('?')[0];

    // Book Detail Route: /books/:id or /books/:slug
    if (path.startsWith('/books/')) {
      const bookSlug = path.replace('/books/', '').trim();
      const matchedBook = products.find(
        (b) => String(b.id) === String(bookSlug) || (b.slug && b.slug === bookSlug)
      );
      return { type: 'book-detail', data: matchedBook, slug: bookSlug };
    }

    if (path === '/books') return { type: 'books' };
    if (path === '/categories') return { type: 'categories' };
    if (path === '/bulk-orders') return { type: 'bulk-orders' };
    if (path === '/about') return { type: 'about' };
    if (path === '/contact') return { type: 'contact' };
    if (path === '/cart') return { type: 'cart' };
    if (path === '/checkout') return { type: 'checkout' };

    return { type: 'home' };
  }, [currentRoute, products]);

  // Set Page Title for Institutional SEO
  useEffect(() => {
    switch (routeView.type) {
      case 'books':
        document.title = 'Catalogue of Publications | JSS Granthamale, Mysuru';
        break;
      case 'book-detail':
        document.title = routeView.data
          ? `${routeView.data.title} | JSS Publications`
          : 'Book Details | JSS Publications';
        break;
      case 'categories':
        document.title = 'Publishing Folios & Series | JSS Granthamale';
        break;
      case 'bulk-orders':
        document.title = 'Institutional & Library Procurement | JSS Publications';
        break;
      case 'about':
        document.title = 'Heritage & History | JSS Granthamale, Mysuru';
        break;
      case 'contact':
        document.title = 'Contact & Retail Counter | JSS Book House';
        break;
      case 'cart':
        document.title = 'Shopping Cart | JSS Publications';
        break;
      case 'checkout':
        document.title = 'Postal Dispatch & Checkout | JSS Publications';
        break;
      default:
        document.title = 'JSS Publications | Jagadguru Sri Shivarathreeshwara Granthamale, Mysuru';
    }
  }, [routeView]);

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
