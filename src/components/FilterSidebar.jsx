import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { mockCategories, mockSeries, mockLanguages } from '../data/mockData';

const FilterSidebar = React.memo(function FilterSidebar({
  activeCategory,
  setActiveCategory,
  activeSeries,
  setActiveSeries,
  activeLanguage,
  setActiveLanguage,
  priceMax,
  setPriceMax,
  onResetFilters,
  totalMatchingBooks = 49
}) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    series: true,
    languages: true,
    price: true
  });

  const toggleSection = (sec) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const hasActiveFilters = 
    activeCategory !== 'All Categories' || 
    activeSeries !== 'All Series' || 
    activeLanguage !== 'All Languages' || 
    priceMax < 2000;

  return (
    <aside className="filter-sidebar-box" aria-label="Catalogue Filters">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={15} color="var(--color-maroon)" />
          <h2 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Filters
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            style={{ background: 'none', border: 'none', color: 'var(--color-saffron)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
          >
            <RotateCcw size={11} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="filter-group">
        <div className="filter-title" onClick={() => toggleSection('categories')} style={{ cursor: 'pointer' }}>
          <span>Category</span>
          {openSections.categories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {openSections.categories && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {mockCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`filter-item-btn ${isActive ? 'active' : ''}`}
                >
                  <span>{cat}</span>
                  <span className="filter-count">
                    {cat === 'All Categories' ? '49' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Series Filter */}
      <div className="filter-group">
        <div className="filter-title" onClick={() => toggleSection('series')} style={{ cursor: 'pointer' }}>
          <span>Publication Series</span>
          {openSections.series ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {openSections.series && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {mockSeries.map((s) => {
              const isActive = activeSeries === s;
              return (
                <button
                  key={s}
                  onClick={() => setActiveSeries(s)}
                  className={`filter-item-btn ${isActive ? 'active' : ''}`}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Language Filter */}
      <div className="filter-group">
        <div className="filter-title" onClick={() => toggleSection('languages')} style={{ cursor: 'pointer' }}>
          <span>Language</span>
          {openSections.languages ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {openSections.languages && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {mockLanguages.map((l) => {
              const isActive = activeLanguage === l;
              return (
                <button
                  key={l}
                  onClick={() => setActiveLanguage(l)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: 'var(--radius-xs)',
                    border: isActive ? '1px solid var(--color-maroon)' : '1px solid var(--color-border)',
                    backgroundColor: isActive ? 'var(--color-maroon)' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-body)',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer'
                  }}
                >
                  {l === 'Kannada' ? 'ಕನ್ನಡ' : l === 'Tamil' ? 'தமிழ்' : l === 'Telugu' ? 'తెలుగు' : l}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <div className="filter-title" onClick={() => toggleSection('price')} style={{ cursor: 'pointer' }}>
          <span>Maximum Price: ₹{priceMax.toLocaleString('en-IN')}</span>
          {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {openSections.price && (
          <div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-maroon)', cursor: 'pointer' }}
              aria-label="Filter maximum price"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              <span>₹50</span>
              <span>₹2,000</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
});

export default FilterSidebar;
