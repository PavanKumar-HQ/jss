import React from 'react';
import { BookOpen, Calendar, Mail, CheckCircle } from 'lucide-react';
import { mockPeriodicals } from '../data/mockData';

export default function PeriodicalsSection({ onAddToCart, languageMode }) {
  return (
    <section style={{ backgroundColor: '#F3EFE6', padding: '48px 0', borderTop: '1px solid #E7E5E4', borderBottom: '1px solid #E7E5E4' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 36px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#C85A17', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Periodical Subscriptions & Calendars
          </span>
          <h2 className="text-serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#5E1624', marginTop: '6px' }}>
            {languageMode === 'kn' ? 'ನಿಯತಕಾಲಿಕೆಗಳು ಹಾಗೂ ಪಂಚಾಂಗ' : 'JSS Periodicals & Annual Panchangas'}
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#57534E', marginTop: '8px' }}>
            Subscribe to continuous cultural journals published by JSS Granthamale since 1967. Delivered directly to your postal address.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {mockPeriodicals.map((p) => (
            <div key={p.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '8px', marginBottom: '12px' }}>
                  <span className="badge badge-burgundy" style={{ backgroundColor: '#5E1624', color: '#FFF' }}>
                    {p.frequency}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#57534E' }}>Est. {p.foundedYear}</span>
                </div>

                <h3 className="text-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                  {p.name}
                </h3>

                <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '16px', lineHeight: 1.5 }}>
                  {p.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#5E1624' }}>
                    ₹{p.priceYearly}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#57534E', display: 'block' }}>Annual Postal Subscription</span>
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
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
