import React from 'react';
import { BookOpen, Compass, Layers, ArrowRight, BookMarked, Library, ChevronRight } from 'lucide-react';
import { CATEGORIES, BOOKS } from '../data/mockData';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function CategoriesPage({ onNavigate, onSelectCategory }) {
  useScrollReveal();

  const categoryDetails = [
    {
      id: 'Vachana Literature',
      name: 'Vachana Literature & Philosophy',
      kannada: 'ವಚನ ಸಾಹಿತ್ಯ ಮತ್ತು ವ್ಯಾಖ್ಯಾನ',
      desc: 'Canonical 12th-century Sharana poetry and definitive exegeses on Basavanna, Allama Prabhu, Akkamahadevi, and Channabasavanna. Features scholarly commentaries translating mystical realization into social egalitarianism.',
      icon: BookOpen,
      series: 'Vachana Vyakyana Male & Canonical Folios',
      highlightCount: BOOKS.filter(b => b.category === 'Vachana Literature').length || 14,
      accentColor: '#5E1624'
    },
    {
      id: 'Sharana Culture',
      name: 'Sharana Samskruti Series',
      kannada: 'ಶರಣ ಸಂಸ್ಕೃತಿ ಮಾಲೆ',
      desc: 'An ambitious institutional series conceived to introduce the cultural, ethical, and spiritual dimensions of the Sharana revolution to school/college students and general seekers. Comprises over 69 published monograph volumes.',
      icon: Layers,
      series: 'Sharana Samskruti Male (Monographs)',
      highlightCount: BOOKS.filter(b => b.category === 'Sharana Culture').length || 18,
      accentColor: '#B84E1A'
    },
    {
      id: 'Philosophy',
      name: 'Darshana, Vedanta & Spiritual Studies',
      kannada: 'ದರ್ಶನ ಮತ್ತು ತತ್ವಶಾಸ್ತ್ರ',
      desc: 'Scholarly treatises exploring Indian darshanas, Shaiva Siddhanta, comparative religion (Vishwa Dharma Darshana), and classical Sanskrit-Kannada translations preserving spiritual epistemology.',
      icon: Compass,
      series: 'Darshana & Comparative Religion Series',
      highlightCount: BOOKS.filter(b => b.category === 'Philosophy').length || 8,
      accentColor: '#C59B27'
    },
    {
      id: 'Biography',
      name: 'Biographies & Monastic Heritage',
      kannada: 'ಜೀವನ ಚರಿತ್ರೆ ಮತ್ತು ಪರಂಪರೆ',
      desc: 'Chronicles detailing the selfless contributions of the Pontiffs of Sri Suttur Math, pivotal social reformers, institution builders, and eminent cultural figures of Karnataka.',
      icon: BookMarked,
      series: 'Virashaiva Punya Purusharu Male',
      highlightCount: BOOKS.filter(b => b.category === 'Biography').length || 6,
      accentColor: '#2E7D32'
    },
    {
      id: 'Contemporary',
      name: 'Contemporary Studies, Science & Society',
      kannada: 'ಸಮಕಾಲೀನ ಅಧ್ಯಯನ ಮತ್ತು ವಿಜ್ಞಾನ',
      desc: 'Publications bridging classical values with modern challenges, including Golden Jubilee endowment lectures on space technology, educational reforms, and addresses by national luminaries including Dr. A.P.J. Abdul Kalam.',
      icon: Library,
      series: 'Golden Jubilee Endowment Series',
      highlightCount: BOOKS.filter(b => b.category === 'Contemporary').length || 3,
      accentColor: '#1565C0'
    }
  ];

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    if (onNavigate) {
      onNavigate('/books');
    }
  };

  return (
    <div className="categories-page animate-fade-in" style={{ backgroundColor: 'var(--color-bg-cream)', minHeight: '80vh', paddingBottom: '70px' }}>
      {/* Page Header */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          padding: '40px 0 32px',
          marginBottom: '36px'
        }}
      >
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '12px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <span
              onClick={() => onNavigate && onNavigate('/home')}
              style={{ cursor: 'pointer', color: 'var(--color-maroon)' }}
            >
              Home
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-text-charcoal)', fontWeight: 600 }}>Publishing Folios & Categories</span>
          </nav>

          <div style={{ maxWidth: '820px' }}>
            <span
              className="badge badge-maroon"
              style={{ marginBottom: '10px' }}
            >
              Institutional Classification
            </span>
            <h1
              className="text-serif"
              style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)',
                color: 'var(--color-maroon)',
                lineHeight: 1.22,
                marginBottom: '10px'
              }}
            >
              Publications by Subject Series
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
              Established under the vision of Mantra Maharshi His Holiness Sri Shivarathri Rajendra Mahaswamiji, JSS Granthamale categorizes its titles into specialized scholastic series catering to research scholars, spiritual seekers, and students alike.
            </p>
          </div>
        </div>
      </header>

      {/* Main Category Cards with Distinct Framing & Shadows */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '26px', marginBottom: '44px' }}>
          {categoryDetails.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className={`category-showcase-card reveal-on-scroll reveal-stagger-${(idx % 4) + 1}`}
                style={{
                  borderTop: `4px solid ${cat.accentColor}`
                }}
              >
                <div>
                  {/* Top Bar: Icon + Count Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-bg-neutral)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: cat.accentColor
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: cat.accentColor,
                        backgroundColor: 'var(--color-bg-cream)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {cat.highlightCount} Publications
                    </span>
                  </div>

                  <h2
                    className="text-serif"
                    style={{
                      fontSize: '1.28rem',
                      fontWeight: 700,
                      color: 'var(--color-text-charcoal)',
                      marginBottom: '4px',
                      lineHeight: 1.3
                    }}
                  >
                    {cat.name}
                  </h2>

                  <span
                    className="text-kannada"
                    style={{
                      display: 'block',
                      fontSize: '0.96rem',
                      color: cat.accentColor,
                      fontWeight: 600,
                      marginBottom: '14px'
                    }}
                  >
                    {cat.kannada}
                  </span>

                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                    {cat.desc}
                  </p>

                  <div
                    style={{
                      backgroundColor: 'var(--color-bg-cream)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      marginBottom: '20px'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '2px' }}>
                      Primary Series Lineage
                    </span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-charcoal)' }}>
                      {cat.series}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-pill)',
                    borderColor: 'var(--color-border-dark)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = cat.accentColor;
                    e.currentTarget.style.borderColor = cat.accentColor;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--color-border-dark)';
                    e.currentTarget.style.color = 'var(--color-text-body)';
                  }}
                >
                  <span>Browse {cat.id} Titles</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Institutional Callout Banner */}
        <div
          className="reveal-on-scroll"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 30px',
            boxShadow: 'var(--shadow-card)',
            borderLeft: '5px solid var(--color-maroon)'
          }}
        >
          <div style={{ maxWidth: '860px' }}>
            <h3
              className="text-serif"
              style={{ fontSize: '1.35rem', color: 'var(--color-maroon)', marginBottom: '8px', fontWeight: 700 }}
            >
              Preserving Spiritual Epistemology Through Accessible Print
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', lineHeight: 1.65, marginBottom: '16px' }}>
              All publications of JSS Granthamale adhere strictly to scholarly authenticity. Manuscripts are reviewed by eminent scholars of Karnataka before publication. Volumes are priced non-profitably to ensure students, research scholars, and rural libraries can acquire core heritage literature effortlessly.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/bulk-orders')}
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-pill)' }}
              >
                Institutional & Library Procurement
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/about')}
                className="btn btn-outline"
                style={{ borderRadius: 'var(--radius-pill)' }}
              >
                Read Publications History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
