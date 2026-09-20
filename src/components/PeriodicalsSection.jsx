import React from 'react';
import { BookOpen, Calendar, Mail, CheckCircle, Award } from 'lucide-react';
import { mockPeriodicals } from '../data/mockData';

export default function PeriodicalsSection({ onAddToCart, languageMode }) {
  return (
    <section
      id="periodicals-section"
      style={{
        backgroundColor: '#F3ECE0',
        padding: '64px 0',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative'
      }}
      aria-label="JSS Periodicals and Annual Panchangas"
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(197, 155, 39, 0.15)',
              border: '1px solid var(--color-gold-border)',
              marginBottom: '12px'
            }}
          >
            <Award size={13} color="#C59B27" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8C6B14', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Annual Postal Subscriptions & Calendars
            </span>
          </div>

          <h2
            className="text-serif-display"
            style={{
              fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
              fontWeight: 700,
              color: '#2E060D',
              lineHeight: 1.2,
              marginBottom: '10px'
            }}
          >
            {languageMode === 'kn' ? 'ನಿಯತಕಾಲಿಕೆಗಳು ಹಾಗೂ ವಾರ್ಷಿಕ ಪಂಚಾಂಗ' : 'JSS Periodicals & Sacred Almanac'}
          </h2>

          <p style={{ fontSize: '0.94rem', color: '#524944', lineHeight: 1.6 }}>
            {languageMode === 'kn'
              ? '೧೯೬೭ ರಿಂದ ನಿರಂತರವಾಗಿ ಪ್ರಕಟವಾಗುತ್ತಿರುವ ಜೆ.ಎಸ್.ಎಸ್ ಸಾಂಸ್ಕೃತಿಕ ಪತ್ರಿಕೆಗಳು. ಅಂಚೆ ಮೂಲಕ ನೇರವಾಗಿ ನಿಮ್ಮ ಮನೆಗೆ ತಲುಪಿಸಲಾಗುವುದು.'
              : 'Subscribe to prestigious cultural journals published by JSS Granthamale since 1967. Delivered directly to your doorstep across India.'}
          </p>
        </div>

        {/* Periodicals Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '26px' }}>
          {mockPeriodicals.map((p) => (
            <div
              key={p.id}
              className="card-book"
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Vintage Journal Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '14px' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                    {p.frequency}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#79706A', fontWeight: 600 }}>
                    Est. {p.foundedYear} • ISSN: {p.issn || 'Registered'}
                  </span>
                </div>

                <h3 className="text-serif-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1615', marginBottom: '8px' }}>
                  {p.name}
                </h3>

                <p style={{ fontSize: '0.86rem', color: '#524944', marginBottom: '20px', lineHeight: 1.55 }}>
                  {p.description}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--color-border-subtle)',
                  paddingTop: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4A0E17', fontFamily: 'var(--font-serif-display)' }}>
                    ₹{p.priceYearly}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#79706A', display: 'block' }}>
                    Annual Postal Subscription
                  </span>
                </div>

                <button
                  onClick={() =>
                    onAddToCart({
                      id: `periodical-${p.id}`,
                      title: p.name,
                      price: p.priceYearly,
                      imageUrl: p.coverUrl,
                      variant: 'Annual Subscription',
                      category: 'Periodicals'
                    })
                  }
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Mail size={14} />
                  <span>Subscribe</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
