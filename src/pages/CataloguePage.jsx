import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import BookCard from '../components/BookCard';
import FilterSidebar from '../components/FilterSidebar';
import { searchService } from '../services';

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

  // Execute domain search and faceted filtering via searchService
  const searchResult = useMemo(() => {
    return searchService.search({
      query: searchQuery,
      category: activeCategory,
      series: activeSeries,
      language: activeLanguage,
      priceMax,
      sortBy
    });
  }, [searchQuery, activeCategory, activeSeries, activeLanguage, priceMax, sortBy]);

  const filteredProducts = searchResult.books;

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
        <div className="mobile-only" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="btn btn-outline"
              style={{ justifyContent: 'center', gap: '6px', minHeight: '40px' }}
            >
              <SlidersHorizontal size={15} color="var(--color-maroon)" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.84rem', padding: '8px 10px', minHeight: '40px' }}
              aria-label="Sort publications"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="title-asc">Title: A–Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Quick Horizontal Category Scroll Bar on Mobile */}
        <div className="catalogue-category-scroll-bar mobile-only">
          {['All Categories', 'Vachana Literature', 'Veerashaiva Philosophy', 'Spirituality & Yoga', 'Biographies & Heritage', 'Education & Science'].map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`catalogue-cat-pill ${isSelected ? 'active' : ''}`}
              >
                <span>{cat === 'All Categories' ? 'All (49)' : cat}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Filter Drawer Overlay */}
        {isMobileFilterOpen && (
          <div
            className="catalogue-filter-drawer-overlay"
            onClick={() => setIsMobileFilterOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Catalogue Filters"
          >
            <div
              className="catalogue-filter-drawer-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="catalogue-filter-drawer-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={16} color="var(--color-maroon)" />
                  <strong style={{ color: 'var(--color-maroon)', fontSize: '0.94rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Catalogue Filters ({filteredProducts.length})
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="catalogue-filter-drawer-close"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="catalogue-filter-drawer-body">
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

              <div className="catalogue-filter-drawer-footer">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onResetFilters) onResetFilters();
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, minHeight: '38px' }}
                  >
                    Reset All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 2, justifyContent: 'center', minHeight: '38px' }}
                >
                  Show {filteredProducts.length} Books
                </button>
              </div>
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
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 9px', fontSize: '0.74rem', minHeight: '26px' }}
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
                  padding: '44px 20px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <BookOpen size={36} color="var(--color-text-subtle)" style={{ marginBottom: '10px' }} />
                <h3 className="text-serif" style={{ fontSize: '1.28rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>
                  No publications match your criteria
                </h3>

                {/* Did You Mean Suggestion */}
                {searchResult.didYouMean && (
                  <div style={{ margin: '14px auto', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: 'var(--color-accent-gold-subtle)', border: '1px solid #DFBF5F', borderRadius: 'var(--radius-xs)', fontSize: '0.86rem' }}>
                    <Sparkles size={14} color="var(--color-accent-gold)" />
                    <span>Did you mean:</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery(searchResult.didYouMean)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-maroon)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                    >
                      {searchResult.didYouMean}
                    </button>
                  </div>
                )}

                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                  Try exploring one of our canonical discovery pathways or reset your filters to view all 49 publications preserved under Sri Suttur Math.
                </p>

                {/* Popular Discovery Pathways */}
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-subtle)', display: 'block', marginBottom: '8px' }}>
                    Popular Literary Pathways
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['Vachana', 'Patanjali', 'Basavanna', 'Shiva Sutras', 'Suttur Math'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearchQuery(tag)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.76rem', minHeight: '26px' }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={onResetFilters} className="btn btn-primary btn-sm">
                  Reset All Filters
                </button>

                {/* Recommended Alternatives */}
                {searchResult.suggestedAlternatives?.length > 0 && (
                  <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'left' }}>
                    <h4 className="text-serif" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '16px' }}>
                      Recommended Foundational Publications:
                    </h4>
                    <div className="books-grid">
                      {searchResult.suggestedAlternatives.map((altBook) => (
                        <BookCard
                          key={altBook.id}
                          book={altBook}
                          onSelectBook={onSelectBook}
                          onAddToCart={onAddToCart}
                          isAddedToCart={cartIdSet.has(altBook.id)}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </div>
                  </div>
                )}
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
