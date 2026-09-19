import React, { useState, useEffect } from 'react';
import { DataService } from './data/mockData';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import HeroParallax from './components/HeroParallax';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import SampleExcerptModal from './components/SampleExcerptModal';
import FilterSidebar from './components/FilterSidebar';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import PeriodicalsSection from './components/PeriodicalsSection';
import InstitutionalEnquiryModal from './components/InstitutionalEnquiryModal';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
import { BookOpen, AlertCircle, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeSeries, setActiveSeries] = useState('All Series');
  const [activeLanguage, setActiveLanguage] = useState('All Languages');
  const [priceMax, setPriceMax] = useState(2000);
  const [languageMode, setLanguageMode] = useState('en');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Modal / Drawer States
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedExcerptBook, setSelectedExcerptBook] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBulkEnquiryOpen, setIsBulkEnquiryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initial Data Ingestion
  useEffect(() => {
    DataService.getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Toast Notification Trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Add to Bag Logic
  const handleAddToCart = (bookToAdd) => {
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.id === bookToAdd.id && item.selectedVariant === (bookToAdd.selectedVariant || 'regular')
      );
      if (existing) {
        return prevCart.map((item) =>
          item.id === bookToAdd.id && item.selectedVariant === (bookToAdd.selectedVariant || 'regular')
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...bookToAdd, quantity: 1, selectedVariant: bookToAdd.selectedVariant || 'regular' }];
    });
    showToast(`Added "${bookToAdd.title}" to Shopping Bag`);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('All Categories');
    setActiveSeries('All Series');
    setActiveLanguage('All Languages');
    setPriceMax(2000);
  };

  // Filter Computation
  const filteredProducts = products.filter((p) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q) || (p.titleKannada && p.titleKannada.toLowerCase().includes(q));
      const matchAuthor = p.author && p.author.toLowerCase().includes(q);
      const matchCat = p.category && p.category.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchCat) return false;
    }
    if (activeCategory !== 'All Categories' && p.category !== activeCategory) return false;
    if (activeSeries !== 'All Series' && p.series !== activeSeries) return false;
    if (activeLanguage !== 'All Languages' && !p.language.includes(activeLanguage)) return false;
    if (p.price > priceMax) return false;
    return true;
  });

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      {/* Initial Session Page Loader (Shows only on main site load once) */}
      <PageLoader />

      {/* Navigation Bar */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocation={() => {
          const locElem = document.getElementById('store-location-section');
          if (locElem) locElem.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenBulkEnquiry={() => setIsBulkEnquiryOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        languageMode={languageMode}
        setLanguageMode={setLanguageMode}
      />

      {/* Parallax Hero Banner */}
      <HeroParallax
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        languageMode={languageMode}
      />

      {/* Main Content Area - Fluid Full Screen Space Usage */}
      <main className="container" style={{ flex: 1, padding: '36px 20px', width: '100%' }}>
        {/* Mobile Filter Toggle */}
        <div className="mobile-only" style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} color="#C85A17" />
              <span>Filter Publications ({filteredProducts.length} items)</span>
            </span>
            <span className="badge badge-burgundy">{activeCategory}</span>
          </button>
        </div>

        {/* Collision Aware Main Grid */}
        <div className="main-layout-grid">
          {/* Sidebar Filter Container */}
          <div className={`sidebar-container ${isMobileFilterOpen ? 'mobile-filter-drawer-open' : ''}`}>
            <FilterSidebar
              activeCategory={activeCategory}
              setActiveCategory={(cat) => { setActiveCategory(cat); setIsMobileFilterOpen(false); }}
              activeSeries={activeSeries}
              setActiveSeries={(s) => { setActiveSeries(s); setIsMobileFilterOpen(false); }}
              activeLanguage={activeLanguage}
              setActiveLanguage={(l) => { setActiveLanguage(l); setIsMobileFilterOpen(false); }}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 className="text-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#5E1624' }}>
                  {activeCategory === 'All Categories' ? 'All 49 Published Titles' : activeCategory}
                </h2>
                <span style={{ fontSize: '0.88rem', color: '#57534E' }}>
                  Showing {filteredProducts.length} authentic books from JSS Granthamale Catalogue
                </span>
              </div>

              {(searchQuery || activeCategory !== 'All Categories' || activeSeries !== 'All Series' || activeLanguage !== 'All Languages') && (
                <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
                  Clear Active Filters
                </button>
              )}
            </div>

            {/* Products Grid - Collision-Aware Auto-Fill */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E7E5E4' }}>
                <BookOpen size={48} color="#D6D3D1" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1C1917' }}>
                  No publications found matching your search criteria
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#57534E', marginTop: '4px', marginBottom: '16px' }}>
                  Try resetting filters or searching with a different term like "Basavanna" or "Yoga".
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="products-fluid-grid">
                {filteredProducts.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelectBook={(b) => setSelectedBook(b)}
                    onAddToCart={(b) => handleAddToCart(b)}
                    isAddedToCart={cart.some((item) => item.id === book.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Periodicals & Annual Panchanga Section */}
      <PeriodicalsSection
        onAddToCart={handleAddToCart}
        languageMode={languageMode}
      />

      {/* Physical Store Location Section */}
      <div id="store-location-section">
        <LocationSection />
      </div>

      {/* Footer */}
      <Footer
        onOpenLocation={() => {
          const locElem = document.getElementById('store-location-section');
          if (locElem) locElem.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenBulkEnquiry={() => setIsBulkEnquiryOpen(true)}
        languageMode={languageMode}
      />

      {/* Modals & Drawers */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToCart={handleAddToCart}
          onOpenExcerpt={(b) => setSelectedExcerptBook(b)}
        />
      )}

      {selectedExcerptBook && (
        <SampleExcerptModal
          book={selectedExcerptBook}
          onClose={() => setSelectedExcerptBook(null)}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={() => {
          setCart([]);
          setIsCheckoutOpen(false);
        }}
      />

      <InstitutionalEnquiryModal
        isOpen={isBulkEnquiryOpen}
        onClose={() => setIsBulkEnquiryOpen(false)}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#5E1624',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            zIndex: 9999,
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Sparkles size={16} color="#D97706" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
