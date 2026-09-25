import React from 'react';
import { BookOpen, Compass, Layers, ArrowRight, BookMarked, Library } from 'lucide-react';
import { BOOKS } from '../data/mockData';

export default function CategoriesPage({ onNavigate, onSelectCategory }) {
  const categoryDetails = [
    {
      id: 'Spirituality & Yoga',
      name: 'Spirituality & Yoga',
      kannada: 'ಆಧ್ಯಾತ್ಮ ಮತ್ತು ಯೋಗ',
      desc: 'Authentic exegeses on Patanjali Yoga Sutras, Shiva Sutras, Narada Bhakti Sutras, and spiritual commentaries guiding seekers in meditation and inner realization.',
      icon: Compass,
      highlightCount: BOOKS.filter(b => b.category === 'Spirituality & Yoga').length,
      accentColor: '#5E1624'
    },
    {
      id: 'Veerashaiva Philosophy',
      name: 'Veerashaiva Philosophy & Agamas',
      kannada: 'ವೀರಶೈವ ದರ್ಶನ ಮತ್ತು ಆಗಮಗಳು',
      desc: 'Definitive scholarly treatises exploring Indian darshanas, Shaiva Siddhanta, Shatsthala theology, and encyclopedic lexicons such as the celebrated Shivapada Ratnakosha.',
      icon: BookMarked,
      highlightCount: BOOKS.filter(b => b.category === 'Veerashaiva Philosophy').length,
      accentColor: '#5E1624'
    },
    {
      id: 'Vachana Literature',
      name: 'Vachana Literature & Sharana Culture',
      kannada: 'ವಚನ ಸಾಹಿತ್ಯ ಮತ್ತು ಶರಣ ಸಂಸ್ಕೃತಿ',
      desc: 'Canonical 12th-century Sharana poetry and critical editions on Basavanna, Allama Prabhu, Akkamahadevi, and Channabasavanna, translating mystical insight into social egalitarianism.',
      icon: BookOpen,
      highlightCount: BOOKS.filter(b => b.category === 'Vachana Literature').length,
      accentColor: '#5E1624'
    },
    {
      id: 'Biographies & Heritage',
      name: 'Biographies & Monastic Heritage',
      kannada: 'ಜೀವನ ಚರಿತ್ರೆ ಮತ್ತು ಮಠ ಪರಂಪರೆ',
      desc: 'Historical chronicles and authoritative biographical monographs documenting the pontifical lineage of Sri Suttur Math, pivotal social reformers, and cultural stalwarts of Karnataka.',
      icon: Layers,
      highlightCount: BOOKS.filter(b => b.category === 'Biographies & Heritage').length,
      accentColor: '#5E1624'
    },
    {
      id: 'Education & Science',
      name: 'Education, Science & Society',
      kannada: 'ಶಿಕ್ಷಣ, ವಿಜ್ಞಾನ ಮತ್ತು ಸಮಾಜ',
      desc: 'Publications bridging classical scholarship with modern scientific thought, including Golden Jubilee endowment lectures on space technology and addresses by Dr. A.P.J. Abdul Kalam.',
      icon: Library,
      highlightCount: BOOKS.filter(b => b.category === 'Education & Science').length,
      accentColor: '#5E1624'
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
    <div style={{ paddingBottom: '70px' }}>
      {/* Page Header */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          padding: '36px 0 28px',
          marginBottom: '32px'
        }}
      >
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '12px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <span
              onClick={() => onNavigate && onNavigate('/')}
              style={{ cursor: 'pointer', color: 'var(--color-maroon)' }}
            >
              Home
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-text-charcoal)', fontWeight: 600 }}>Categories & Subject Folios</span>
          </nav>

          <div style={{ maxWidth: '780px' }}>
            <span
              className="badge badge-maroon"
              style={{ marginBottom: '8px' }}
            >
              Catalogue Classification
            </span>

            <h1
              className="text-serif"
              style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)',
                color: 'var(--color-text-charcoal)',
                lineHeight: 1.2,
                marginBottom: '8px',
                fontWeight: 700
              }}
            >
              Publications by Subject Series
            </h1>
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Established under the vision of Mantra Maharshi His Holiness Sri Shivarathri Rajendra Mahaswamiji, JSS Granthamale publishes verified critical editions classified across spiritual, philosophical, literary, and contemporary disciplines.
            </p>
          </div>
        </div>
      </header>

      {/* Main Category Cards */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {categoryDetails.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onClick={() => handleCategoryClick(cat.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-maroon)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--color-bg-neutral)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-maroon)'
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="badge badge-maroon">
                      {cat.highlightCount} Publications
                    </span>
                  </div>

                  <h2
                    className="text-serif"
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-text-charcoal)',
                      marginBottom: '4px',
                      lineHeight: 1.25
                    }}
                  >
                    {cat.name}
                  </h2>

                  <span
                    className="text-kannada"
                    style={{
                      display: 'block',
                      fontSize: '0.88rem',
                      color: 'var(--color-maroon-dark)',
                      fontWeight: 600,
                      marginBottom: '10px'
                    }}
                  >
                    {cat.kannada}
                  </span>

                  <p style={{ fontSize: '0.86rem', color: 'var(--color-text-body)', lineHeight: 1.55, marginBottom: '16px' }}>
                    {cat.desc}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', color: 'var(--color-maroon)', fontWeight: 600 }}>
                  <span>Browse Category</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
