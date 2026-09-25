import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, BookOpen, RotateCcw } from 'lucide-react';
import BookCard from '../components/BookCard';
import FilterSidebar from '../components/FilterSidebar';

export default function CataloguePage({
  products = [],
  onSelectBook,
  onOpenExcerpt,
  onAddToCart,
  cart = [],
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  activeSeries,
  setActiveSeries,
  activeLanguage,
  setActiveLanguage,
  priceMax,
  setPriceMax,
  onResetFilters,
  onNavigate
}) {
  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q) || (p.titleKannada && p.titleKannada.toLowerCase().includes(q));
        const matchAuthor = p.author && p.author.toLowerCase().includes(q);
        const matchCat = (p.category && p.category.toLowerCase().includes(q)) || (p.rawCategory && p.rawCategory.toLowerCase().includes(q));
        const matchSeries = p.series && p.series.toLowerCase().includes(q);
        const matchIsbn = p.isbn && p.isbn.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchCat && !matchSeries && !matchIsbn) return false;
      }
      if (activeCategory !== 'All Categories' && p.category !== activeCategory) return false;
      if (activeSeries !== 'All Series' && p.series !== activeSeries) return false;
      if (activeLanguage !== 'All Languages' && !p.language.includes(activeLanguage)) return false;
      if (p.price > priceMax) return false;
      return true;
    });

    if (sortBy === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'pages-desc') {
      list.sort((a, b) => (b.pages || 0) - (a.pages || 0));
    }

    return list;
  }, [products, searchQuery, activeCategory, activeSeries, activeLanguage, priceMax, sortBy]);

  const hasActiveFilters = 
    (searchQuery && searchQuery.trim() !== '') ||
    activeCategory !== 'All Categories' || 
    activeSeries !== 'All Series' || 
    activeLanguage !== 'All Languages' || 
    priceMax < 2000;

  // O(1) set lookup to prevent 49x linear search on every render
  const cartIdSet = useMemo(() => new Set(cart.map((item) => item.id)), [cart]);

  const visibleBooks = filteredProducts.slice(0, visibleCount);

  return (
    <div className="catalogue-page-section">
      <div className="container">
        {/* Mobile Filter & Sort Triggers */}
        <div className="mobile-only" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="btn btn-outline"
              style={{ justifyContent: 'center', gap: '6px' }}
            >
              <SlidersHorizontal size={14} color="var(--color-maroon)" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.84rem', padding: '8px' }}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="title-asc">Title: A–Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Drawer Overlay */}
        {isMobileFilterOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1100,
              display: 'flex'
            }}
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <div
              style={{
                width: '300px',
                height: '100%',
                backgroundColor: '#FFFFFF',
                padding: '20px',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                <strong style={{ color: 'var(--color-maroon)', fontSize: '0.94rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Catalogue Filters
                </strong>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              <FilterSidebar
                activeCategory={activeCategory}
                setActiveCategory={(cat) => { setActiveCategory(cat); setIsMobileFilterOpen(false); }}
                activeSeries={activeSeries}
                setActiveSeries={(s) => { setActiveSeries(s); setIsMobileFilterOpen(false); }}
                activeLanguage={activeLanguage}
                setActiveLanguage={(l) => { setActiveLanguage(l); setIsMobileFilterOpen(false); }}
                priceMax={priceMax}
                setPriceMax={setPriceMax}
                onResetFilters={onResetFilters}
                totalMatchingBooks={filteredProducts.length}
              />
            </div>
          </div>
        )}

        {/* Main Catalogue Layout: Left Filters, Right Products */}
        <div className="catalogue-container-grid">
          {/* Desktop Left Sidebar */}
          <div className="desktop-only">
            <FilterSidebar
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeSeries={activeSeries}
              setActiveSeries={setActiveSeries}
              activeLanguage={activeLanguage}
              setActiveLanguage={setActiveLanguage}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              onResetFilters={onResetFilters}
              totalMatchingBooks={filteredProducts.length}
            />
          </div>

          {/* Right Product Catalogue */}
          <div>
            {/* Header Bar */}
            <div style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h1 className="text-serif" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '2px' }}>
                    {activeCategory === 'All Categories' ? 'Catalogue of Publications' : activeCategory}
                  </h1>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                    Showing {filteredProducts.length} of {products.length} publications in print · Jagadguru Sri Shivarathreeshwara Granthamale
                  </p>
                </div>

                {/* Desktop Sort Dropdown */}
                <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="cat-sort-select" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Sort by:
                  </label>
                  <select
                    id="cat-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-select"
                    style={{ padding: '5px 10px', fontSize: '0.84rem', width: 'auto' }}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="title-asc">Title: A–Z</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="pages-desc">Page Count</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-subtle)', fontWeight: 600 }}>Active Filters:</span>

                  {searchQuery && (
                    <span className="badge badge-maroon">
                      Search: "{searchQuery}"
                      <X size={11} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  {activeCategory !== 'All Categories' && (
                    <span className="badge badge-maroon">
                      {activeCategory}
                      <X size={11} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setActiveCategory('All Categories')} />
                    </span>
                  )}
                  {activeSeries !== 'All Series' && (
                    <span className="badge badge-gold">
                      Series: {activeSeries}
                      <X size={11} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setActiveSeries('All Series')} />
                    </span>
                  )}
                  {activeLanguage !== 'All Languages' && (
                    <span className="badge badge-neutral">
                      Language: {activeLanguage}
                      <X size={11} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setActiveLanguage('All Languages')} />
                    </span>
                  )}
                  {priceMax < 2000 && (
                    <span className="badge badge-neutral">
                      ≤ ₹{priceMax}
                      <X size={11} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setPriceMax(2000)} />
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={onResetFilters}
                    style={{ background: 'none', border: 'none', color: 'var(--color-maroon)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Book Results Grid */}
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 20px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <BookOpen size={36} color="var(--color-text-subtle)" style={{ marginBottom: '10px' }} />
                <h3 className="text-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>
                  No publications match your criteria
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto 16px' }}>
                  Try adjusting your search terms or clearing the selected filters to view all 49 publications.
                </p>
                <button type="button" onClick={onResetFilters} className="btn btn-primary btn-sm">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="books-grid">
                  {visibleBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onSelectBook={onSelectBook}
                      onAddToCart={onAddToCart}
                      isAddedToCart={cartIdSet.has(book.id)}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>

                {/* Progressive Load More if not all are visible */}
                {visibleCount < filteredProducts.length && (
                  <div style={{ textAlign: 'center', marginTop: '36px' }}>
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 24)}
                      className="btn btn-secondary"
                      style={{ padding: '10px 24px' }}
                    >
                      Load More Publications ({filteredProducts.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
