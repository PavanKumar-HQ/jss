import React from 'react';
import { MapPin, Phone, Mail, Truck, ShieldCheck } from 'lucide-react';
import jssLogo from '../assets/jss-logo.webp';

export default function Footer({ onNavigate, onOpenLocation, onOpenBulkEnquiry, onOpenTrackingModal }) {
  const handleNav = (target, e) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        {/* 4 Clean Columns */}
        <div className="footer-grid">
          {/* Col 1: JSS Publications Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <img
                  src={jssLogo}
                  alt="JSS Publications Logo"
                  style={{ width: '26px', height: '26px', objectFit: 'contain' }}
                />
              </div>
              <div>
                <span className="text-brand" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'block', letterSpacing: '0.6px' }}>
                  JSS PUBLICATIONS
                </span>
                <span style={{ fontSize: '0.74rem', color: '#DFBF5F' }}>
                  Jagadguru Sri Shivarathreeshwara Granthamale
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#D6CCA8', lineHeight: 1.6, marginBottom: '12px' }}>
              Official publication wing of JSS Mahavidyapeetha, Mysuru. Dedicated to preserving, researching, and publishing classical 12th-century Vachana poetry, Veerashaiva philosophy, and Indian spiritual scholarship.
            </p>

            <span className="text-kannada" style={{ fontSize: '0.8rem', color: '#DFBF5F' }}>
              ಸಾಹಿತ್ಯದ ಮೂಲಕ ಸಾಮಾಜಿಕ ಹಾಗೂ ಧಾರ್ಮಿಕ ಜಾಗೃತಿ
            </span>
          </div>

          {/* Col 2: Publications & Catalogue */}
          <div>
            <h4 className="footer-title">Publications</h4>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={(e) => handleNav('/books', e)}>
                  All Books (49 Titles)
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/categories', e)}>
                  Subject Categories
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/bulk-orders', e)}>
                  Bulk & Library Orders
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/about', e)}>
                  About JSS Granthamale
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/contact', e)}>
                  Contact Bookstore
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div>
            <h4 className="footer-title">Customer Support</h4>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={(e) => handleNav('/contact', e)}>
                  Shipping & India Post Dispatch
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenTrackingModal && onOpenTrackingModal()}
                  style={{ color: '#DFBF5F', fontWeight: 600 }}
                >
                  Track Consignment
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/contact', e)}>
                  Returns & Exchange Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/contact', e)}>
                  Periodical Subscriptions
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/contact', e)}>
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Counter */}
          <div>
            <h4 className="footer-title">JSS Book House</h4>
            <div style={{ fontSize: '0.82rem', color: '#D6CCA8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <MapPin size={14} color="#DFBF5F" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Phone size={14} color="#DFBF5F" style={{ flexShrink: 0 }} />
                <a href="tel:08212548212" style={{ color: '#D6CCA8' }}>0821-2548212</a>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={14} color="#DFBF5F" style={{ flexShrink: 0 }} />
                <a href="mailto:publications@jssonline.org" style={{ color: '#D6CCA8' }}>publications@jssonline.org</a>
              </div>
              <div style={{ paddingTop: '4px', fontSize: '0.78rem', color: '#B5AA9A' }}>
                Working Hours: Mon–Sat 09:30 AM – 06:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('/about')}>Privacy Policy</span>
            <span>·</span>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('/contact')}>Terms & Conditions</span>
            <span>·</span>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('/contact')}>Postal Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
