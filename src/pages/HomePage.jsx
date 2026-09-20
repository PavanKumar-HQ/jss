import React from 'react';
import { Search, BookOpen, ArrowRight, Layers, MapPin, Phone, CheckCircle2, Award, BookMarked } from 'lucide-react';

import HeroParallax from '../components/HeroParallax';
import BookCard from '../components/BookCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomePage({
  products,
  onNavigate,
  onSelectBook,
  onOpenExcerpt,
  onAddToCart,
  cart = [],
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  languageMode
}) {
  const [featuredRef] = useScrollReveal();
  const [periodicalsRef] = useScrollReveal();
  const [briefRef] = useScrollReveal();

  // Select featured books from verified actual titles
  const featuredBooks = products.slice(0, 4);

  const quickCategories = [
    "Vachana Literature",
    "Veerashaiva Philosophy",
    "Spirituality & Yoga",
    "Biographies & Heritage"
  ];

  return (
    <div>
      {/* SECTION 1 — UNIQUE ROYAL STAGE (3D BOOK SPOTLIGHT, VACHANA TICKER, EDITORIAL SPLIT) */}
      <HeroParallax
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        languageMode={languageMode}
        onNavigate={onNavigate}
        onInspectBook={onSelectBook}
      />


      {/* SECTION 2 — QUICK SEARCH BAR */}
      <section className="home-search-container" aria-label="Quick Search">
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onNavigate('/books');
              }}
              style={{ position: 'relative', marginBottom: '12px' }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books by title, author, category or ISBN..."
                className="form-input"
                style={{
                  padding: '12px 18px 12px 42px',
                  fontSize: '0.94rem',
                  borderRadius: 'var(--radius-pill)'
                }}
              />
              <Search
                size={17}
                color="var(--color-text-muted)"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', borderRadius: 'var(--radius-pill)', padding: '6px 16px' }}
              >
                Search
              </button>
            </form>

            {/* Quick Category Suggestions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Popular:
              </span>
              {quickCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    if (setActiveCategory) setActiveCategory(cat);
                    onNavigate('/books');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-maroon)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '2px 4px'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURED PUBLICATIONS WITH PREVIEW & EXCERPTS */}
      <section ref={featuredRef} className="featured-books-section reveal-on-scroll" aria-label="Featured Publications">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-saffron)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Editorial Selection
              </span>
              <h2 className="text-serif" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-maroon)', marginTop: '2px' }}>
                Featured Publications
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/books')}
              className="btn btn-outline btn-sm"
              style={{ gap: '6px', borderRadius: 'var(--radius-pill)' }}
            >
              <span>View All 49 Publications</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="books-grid">
            {featuredBooks.map((book, idx) => (
              <BookCard
                key={book.id}
                book={book}
                staggerDelay={idx * 80}
                onSelectBook={onSelectBook}
                onAddToCart={onAddToCart}
                isAddedToCart={cart.some((item) => item.id === book.id)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4 — PERIODICALS & ANNUAL PANCHANGAS */}
      <section ref={periodicalsRef} className="periodicals-summary-section reveal-on-scroll" aria-label="JSS Periodicals">
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto 26px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-saffron)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Continuous Journals & Almanacs
            </span>
            <h2 className="text-serif" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-maroon)', marginTop: '2px' }}>
              Periodicals & Annual Panchangas
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', marginTop: '6px' }}>
              Published by JSS Granthamale for over five decades. Subscriptions are dispatched by post across India.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '22px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-maroon">Bimonthly</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--color-text-subtle)' }}>Est. 1967</span>
              </div>
              <h3 className="text-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>
                Prasada (ಪ್ರಸಾದ)
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                Flagship cultural and philosophical journal featuring scholarly articles on Vachana literature, Lingayat tradition, and spiritual heritage.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-maroon)' }}>₹300 / Year</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: 'var(--radius-pill)' }}
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '22px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-gold">Bi-Annual</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--color-text-subtle)' }}>Est. 1990</span>
              </div>
              <h3 className="text-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>
                Sharanapatha (ಶರಣಪಥ)
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                Scholarly English research journal dedicated to introducing Vachana philosophy and Indian spirituality to international readers and universities.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-maroon)' }}>₹200 / Year</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: 'var(--radius-pill)' }}
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '22px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-terracotta">Annual Almanac</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--color-text-subtle)' }}>2026 Edition</span>
              </div>
              <h3 className="text-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>
                JSS Kannada Panchanga 2026
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                Official astronomical calendar detailing tithi, nakshatra, religious festivals, and auspicious timings calculated according to sidereal astronomy.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-maroon)' }}>₹80</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/books')}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: 'var(--radius-pill)' }}
                >
                  Order Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — INSTITUTIONAL BRIEF WITH ROUNDED CARDS */}
      <section ref={briefRef} className="institution-brief-section reveal-on-scroll" aria-label="About JSS Publications">
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-bg-cream)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px 28px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px'
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <span className="badge badge-maroon" style={{ marginBottom: '8px' }}>
                Sri Suttur Math Lineage
              </span>
              <h2 className="text-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '8px' }}>
                Social Transformation Through Accessible Literature
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
                Founded by the 22nd Jagadguru Mantra Maharshi His Holiness Sri Shivarathri Rajendra Mahaswamiji, JSS Granthamale publishes verified classical texts at non-profit rates to ensure students, researchers, and rural libraries can build enduring cultural collections.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onNavigate('/bulk-orders')}
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-pill)' }}
              >
                Bulk Institutional Indents
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className="btn btn-outline"
                style={{ borderRadius: 'var(--radius-pill)' }}
              >
                Read History
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
