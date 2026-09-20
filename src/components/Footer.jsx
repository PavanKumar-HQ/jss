import React from 'react';
import { BookOpen, MapPin, Phone, Mail, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Footer({ onNavigate, onOpenLocation, onOpenBulkEnquiry, onOpenTrackingModal }) {
  const handleNav = (target) => {
    if (onNavigate) {
      onNavigate(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#1E0408',
        color: '#FAF7F2',
        paddingTop: '54px',
        paddingBottom: '26px',
        borderTop: '2px solid var(--color-accent-gold)'
      }}
      aria-label="Footer"
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '36px', marginBottom: '44px' }}>
          
          {/* Col 1: Institutional Lineage */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  backgroundColor: '#FAF7F2',
                  padding: '6px',
                  borderRadius: '4px',
                  border: '1px solid #C59B27',
                  flexShrink: 0
                }}
              >
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" rx="12" fill="#5E1624"/>
                  <path d="M20 72 C35 60 50 65 50 82 C50 65 65 60 80 72 L80 35 C65 25 50 30 50 45 C50 30 35 25 20 35 Z" fill="#FBF8F2"/>
                  <path d="M50 82 L50 45" stroke="#C59B27" strokeWidth="4" strokeLinecap="round"/>
                  <circle cx="50" cy="22" r="8" fill="#E5C368"/>
                  <path d="M50 10 Q55 18 50 22 Q45 18 50 10 Z" fill="#B84E1A"/>
                </svg>
              </div>
              <div>
                <span className="text-serif-classical" style={{ fontSize: '1.08rem', fontWeight: 800, letterSpacing: '0.8px', display: 'block', color: '#FFFFFF' }}>
                  JSS PUBLICATIONS
                </span>
                <span style={{ fontSize: '0.72rem', color: '#E5C368', letterSpacing: '0.3px' }}>
                  Jagadguru Sri Shivarathreeshwara Granthamale
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#D6CCA8', lineHeight: 1.65, marginBottom: '16px' }}>
              Dedicated to preserving, researching, and publishing canonical 12th-century Vachana poetry, Veerashaiva philosophy, and classical heritage under the divine guidance of Sri Suttur Math and JSS Mahavidyapeetha.
            </p>

            <span className="text-kannada" style={{ fontSize: '0.84rem', color: '#E5C368', display: 'block' }}>
              ಸಾಹಿತ್ಯದ ಮೂಲಕ ಸಾಮಾಜಿಕ ಹಾಗೂ ಧಾರ್ಮಿಕ ಜಾಗೃತಿ
            </span>
          </div>

          {/* Col 2: Publishing Folios */}
          <div>
            <h4 className="text-serif-classical" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#E5C368', letterSpacing: '0.8px', marginBottom: '14px', textTransform: 'uppercase' }}>
              Publishing Folios
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#D6CCA8' }}>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('books')}
                  style={{ background: 'none', border: 'none', color: '#D6CCA8', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '0.84rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D6CCA8')}
                >
                  All Publications (ಸಮಗ್ರ ಗ್ರಂಥಗಳು)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('categories')}
                  style={{ background: 'none', border: 'none', color: '#D6CCA8', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '0.84rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D6CCA8')}
                >
                  Vachana Literature (ವಚನ ಸಾಹಿತ್ಯ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('categories')}
                  style={{ background: 'none', border: 'none', color: '#D6CCA8', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '0.84rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D6CCA8')}
                >
                  Sharana Samskruti Series (ಶರಣ ಸಂಸ್ಕೃತಿ ಮಾಲೆ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('categories')}
                  style={{ background: 'none', border: 'none', color: '#D6CCA8', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '0.84rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D6CCA8')}
                >
                  Darshana & Vedanta (ದರ್ಶನ ಮತ್ತು ತತ್ವಶಾಸ್ತ್ರ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('categories')}
                  style={{ background: 'none', border: 'none', color: '#D6CCA8', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '0.84rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D6CCA8')}
                >
                  Biographies (ವೀರಶೈವ ಪುಣ್ಯಪುರುಷರ ಮಾಲೆ)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Services */}
          <div>
            <h4 className="text-serif-classical" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#E5C368', letterSpacing: '0.8px', marginBottom: '14px', textTransform: 'uppercase' }}>
              Institutional Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('bulk-orders')}
                  style={{ background: 'none', border: 'none', color: '#D6CCA8', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '0.84rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D6CCA8')}
                >
                  School & Library Bulk Indents
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('contact')}
                  style={{ background: 'none', border: 'none', color: '#D6CCA8', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '0.84rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D6CCA8')}
                >
                  JSS Book House Retail Counter, Mysuru
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('about')}
                  style={{ background: 'none', border: 'none', color: '#D6CCA8', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '0.84rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D6CCA8')}
                >
                  Granthamale History & Mission
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenTrackingModal && onOpenTrackingModal()}
                  style={{ background: 'none', border: 'none', color: '#E5C368', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '0.84rem', fontWeight: 600 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#E5C368')}
                >
                  Track Postal Consignment (India Post)
                </button>
              </li>
              <li style={{ color: '#D6CCA8' }}>Pan-India India Post Registered Dispatch</li>
              <li style={{ color: '#D6CCA8' }}>0% GST on Printed Educational Books</li>
            </ul>
          </div>

          {/* Col 4: Official Contact & Desk */}
          <div>
            <h4 className="text-serif-classical" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#E5C368', letterSpacing: '0.8px', marginBottom: '14px', textTransform: 'uppercase' }}>
              Official Contact
            </h4>
            <address style={{ fontStyle: 'normal', fontSize: '0.84rem', color: '#D6CCA8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={16} color="#C59B27" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru – 570 004, Karnataka</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Phone size={16} color="#C59B27" style={{ flexShrink: 0 }} />
                <span>0821-2548212 / 2548218</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Mail size={16} color="#C59B27" style={{ flexShrink: 0 }} />
                <span>jss@jssonline.org</span>
              </div>
            </address>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(197, 155, 39, 0.2)',
            paddingTop: '18px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#A39B95'
          }}
        >
          <div>
            © 2026 Jagadguru Sri Shivarathreeshwara Granthamale / JSS Mahavidyapeetha, Mysuru.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('about')}>About Us</span>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('contact')}>Contact</span>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('bulk-orders')}>Institutional Requisitions</span>
            <a href="https://jssonline.org" target="_blank" rel="noreferrer" style={{ color: '#E5C368', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span>jssonline.org</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
