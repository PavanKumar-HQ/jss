import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, BookOpen, RotateCcw } from 'lucide-react';
import BookCard from '../components/BookCard';
import FilterSidebar from '../components/FilterSidebar';

export default function CataloguePage({
  products,
  onSelectBook,
  onOpenExcerpt,
  onAddToCart,
  cart,
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
  onResetFilters
}) {
  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);


  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (searchQuery.trim() !== '') {
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
    searchQuery.trim() !== '' ||
    activeCategory !== 'All Categories' || 
    activeSeries !== 'All Series' || 
    activeLanguage !== 'All Languages' || 
    priceMax < 2000;

  return (
    <div className="catalogue-page-section">
      <div className="container">
        {/* Mobile Filter Toggle Button */}
        <div className="mobile-only" style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={16} color="var(--color-maroon)" />
              <span>Filters ({filteredProducts.length} publications)</span>
            </span>
            <span className="badge badge-maroon">{activeCategory}</span>
          </button>
        </div>

        {/* Mobile Filter Drawer */}
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
                <strong style={{ color: 'var(--color-maroon)', fontSize: '1rem' }}>Filters</strong>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
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

        {/* Main Catalogue Grid Layout: Left Sidebar, Right Catalogue */}
        <div className="catalogue-container-grid">
          {/* Desktop Left Filter Sidebar */}
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

          {/* Right Content Area */}
          <div>
            {/* Catalogue Header Bar */}
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                <div>
                  <h1 className="text-serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                    {activeCategory === 'All Categories' ? 'Books' : activeCategory}
                  </h1>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                    Showing {filteredProducts.length} publications from the official JSS Granthamale catalogue
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="sort-select" style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Sort:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-select"
                    style={{ padding: '6px 12px', fontSize: '0.84rem', width: 'auto' }}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', fontWeight: 600 }}>Active Filters:</span>

                  {searchQuery && (
                    <span className="badge badge-maroon">
                      Search: "{searchQuery}"
                      <X size={12} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  {activeCategory !== 'All Categories' && (
                    <span className="badge badge-maroon">
                      {activeCategory}
                      <X size={12} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setActiveCategory('All Categories')} />
                    </span>
                  )}
                  {activeSeries !== 'All Series' && (
                    <span className="badge badge-saffron">
                      Series: {activeSeries}
                      <X size={12} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setActiveSeries('All Series')} />
                    </span>
                  )}
                  {activeLanguage !== 'All Languages' && (
                    <span className="badge badge-neutral">
                      Language: {activeLanguage}
                      <X size={12} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setActiveLanguage('All Languages')} />
                    </span>
                  )}
                  {priceMax < 2000 && (
                    <span className="badge badge-neutral">
                      ≤ ₹{priceMax}
                      <X size={12} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setPriceMax(2000)} />
                    </span>
                  )}

                  <button
                    onClick={onResetFilters}
                    style={{ background: 'none', border: 'none', color: 'var(--color-saffron)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Book Cards Grid or Useful Empty State */}
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '64px 20px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <BookOpen size={40} color="var(--color-border-dark)" style={{ marginBottom: '12px' }} />
                <h3 className="text-serif" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
                  No publications found for your search criteria
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
                  Try another title, author or category, or reset the active filters to browse the complete catalogue.
                </p>
                <button onClick={onResetFilters} className="btn btn-primary btn-sm">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="books-grid">
                {filteredProducts.map((book, idx) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    staggerDelay={Math.min(idx * 35, 400)}
                    onSelectBook={onSelectBook}
                    onAddToCart={onAddToCart}
                    isAddedToCart={cart.some((item) => item.id === book.id)}
                  />
                ))}
              </div>


            )}
          </div>
        </div>
      </div>
    </div>
  );
}
