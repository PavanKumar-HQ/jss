import React, { useEffect, useState } from 'react';
import { BookOpen, Layers, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HeroParallax({ activeCategory, setActiveCategory, languageMode }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero-banner">
      {/* Background Parallax Element */}
      <div
        className="hero-background-parallax"
        style={{
          transform: `translateY(${scrollY * 0.25}px)`
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '900px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(200, 90, 23, 0.2)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(200, 90, 23, 0.4)', marginBottom: '16px' }}>
          <Award size={14} color="#D97706" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px', color: '#FBF9F5' }}>
            {languageMode === 'kn' ? 'ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ, ಮೈಸೂರು' : 'Official Publication Division of JSS Mahavidyapeetha'}
          </span>
        </div>

        <h1 className="text-serif" style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '16px' }}>
          {languageMode === 'kn'
            ? 'ವಚನ ಸಾಹಿತ್ಯ, ಧರ್ಮ ಹಾಗೂ ಭಾರತೀಯ ಸಂಸ್ಕೃತಿಯ ಮಹೋನ್ನತ ಗ್ರಂಥಗಳು'
            : 'Preserving Vachana Literature, Philosophy & Cultural Heritage'}
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#FBF9F5', opacity: 0.9, marginBottom: '28px', maxWidth: '760px', margin: '0 auto 28px' }}>
          Explore authentic editions of 12th-century Vachana poetry, Veerashaiva Siddhanta, Yoga Sutras, academic research, and spiritual literature published under the guidance of Sri Suttur Math, Mysuru.
        </p>

        {/* Quick Category Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[
            { label: 'All Catalogue', category: 'All Categories' },
            { label: 'Vachana Literature', category: 'Vachana Literature' },
            { label: 'Veerashaiva Philosophy', category: 'Veerashaiva Philosophy' },
            { label: 'Spirituality & Yoga', category: 'Spirituality & Yoga' },
            { label: 'Periodicals & Panchangas', category: 'Periodicals & Panchangas' }
          ].map((item) => (
            <button
              key={item.category}
              onClick={() => setActiveCategory(item.category)}
              style={{
                backgroundColor: activeCategory === item.category ? '#C85A17' : 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: activeCategory === item.category ? '1px solid #C85A17' : '1px solid rgba(255,255,255,0.2)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.88rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Heritage Trust Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 700, color: '#D97706' }}>100+ Titles</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Published Publications</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 700, color: '#D97706' }}>69+ Books</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Sharana Samskruti Series</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 700, color: '#D97706' }}>350+ Institutions</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Global Educational Network</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 700, color: '#D97706' }}>Direct Delivery</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Pan-India & International</span>
          </div>
        </div>
      </div>
    </section>
  );
}
