import React from 'react';
import { Filter, RotateCcw, ChevronRight } from 'lucide-react';
import { mockCategories, mockSeries, mockLanguages } from '../data/mockData';

export default function FilterSidebar({
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
  return (
    <aside
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E7E5E4',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
      aria-label="Filter Catalogue"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #E7E5E4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="#C85A17" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#5E1624' }}>
            Filter Catalogue
          </h2>
        </div>
        <button
          onClick={onResetFilters}
          style={{ background: 'none', border: 'none', color: '#57534E', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1C1917', marginBottom: '10px' }}>
          Category
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {mockCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                textAlign: 'left',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeCategory === cat ? 'rgba(94,22,36,0.08)' : 'transparent',
                color: activeCategory === cat ? '#5E1624' : '#57534E',
                fontWeight: activeCategory === cat ? 600 : 400,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{cat}</span>
              {activeCategory === cat && <ChevronRight size={14} color="#5E1624" />}
            </button>
          ))}
        </div>
      </div>

      {/* Series Filter */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1C1917', marginBottom: '10px' }}>
          Publication Series
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {mockSeries.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSeries(s)}
              style={{
                textAlign: 'left',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSeries === s ? 'rgba(200,90,23,0.08)' : 'transparent',
                color: activeSeries === s ? '#C85A17' : '#57534E',
                fontWeight: activeSeries === s ? 600 : 400,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1C1917', marginBottom: '10px' }}>
          Language
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {mockLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLanguage(lang)}
              style={{
                padding: '4px 10px',
                borderRadius: '14px',
                border: activeLanguage === lang ? '1px solid #5E1624' : '1px solid #E7E5E4',
                backgroundColor: activeLanguage === lang ? '#5E1624' : '#FFF',
                color: activeLanguage === lang ? '#FFF' : '#57534E',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Maximum Price Filter Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1C1917' }}>Max Price</h3>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5E1624' }}>₹{priceMax}</span>
        </div>
        <input
          type="range"
          min="50"
          max="2000"
          step="50"
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#C85A17', cursor: 'pointer' }}
        />
      </div>
    </aside>
  );
}
