import React from 'react';
import { MapPin, Phone, Mail, HelpCircle, Shield, FileText, Lock, Settings } from 'lucide-react';
import jssLogo from '../assets/jss-logo.webp';

// Social media channels with authentic brand identities and hover states
const SOCIAL_LINKS = [
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    brandColor: '#FF0000',
    svgPath: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    brandColor: '#1877F2',
    svgPath: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    name: 'Twitter (X)',
    url: 'https://x.com',
    brandColor: '#000000',
    hoverBorder: '#FFFFFF',
    svgPath: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    isGradient: true,
    brandGradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    svgPath: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    name: 'WhatsApp',
    url: 'https://whatsapp.com',
    brandColor: '#25D366',
    svgPath: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    brandColor: '#0A66C2',
    svgPath: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  }
];

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
          {/* Col 1: JSS Publications Identity & Social Channels */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                <img
                  src={jssLogo}
                  alt="JSS Publications Logo"
                  style={{ width: '28px', height: '28px', objectFit: 'contain' }}
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

            <p style={{ fontSize: '0.82rem', color: '#D6CCA8', lineHeight: 1.6, marginBottom: '14px' }}>
              Official publication division of JSS Mahavidyapeetha, Mysuru. Dedicated to critical research, scholarly preservation, and subsidized dissemination of classical 12th-century Vachana literature, Shaiva Agamas, and Indian spiritual philosophy.
            </p>

            <span className="text-kannada" style={{ fontSize: '0.8rem', color: '#DFBF5F', display: 'block', marginBottom: '18px' }}>
              ಸಾಹಿತ್ಯದ ಮೂಲಕ ಸಾಮಾಜಿಕ ಹಾಗೂ ಧಾರ್ಮಿಕ ಜಾಗೃತಿ
            </span>

            {/* Social Media Channels with Exact Respective Brand Color on Hover */}
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#E5DFD5', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                Follow JSS Granthamale
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Follow JSS Publications on ${social.name}`}
                    aria-label={`Official JSS Publications ${social.name} channel`}
                    className="social-footer-btn"
                    style={{
                      '--social-hover-bg': social.brandColor || '#FFFFFF',
                      '--social-hover-gradient': social.brandGradient || 'none',
                      '--social-border': social.hoverBorder || 'transparent'
                    }}
                  >
                    {social.svgPath}
                  </a>
                ))}
              </div>
            </div>
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

          {/* Col 3: Reader Assistance & FAQs */}
          <div>
            <h4 className="footer-title">Reader Support</h4>
            <ul className="footer-links">
              <li>
                <button
                  type="button"
                  onClick={(e) => handleNav('/faqs', e)}
                  style={{ color: '#DFBF5F', fontWeight: 700 }}
                >
                  Frequently Asked Questions (FAQs)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenTrackingModal && onOpenTrackingModal()}
                  style={{ color: '#FFFFFF', fontWeight: 600 }}
                >
                  Track Consignment (India Post)
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/privacy', e)}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/terms', e)}>
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handleNav('/contact', e)}>
                  Postal Shipping Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Counter */}
          <div>
            <h4 className="footer-title">JSS Book House Counter</h4>
            <div style={{ fontSize: '0.82rem', color: '#D6CCA8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <MapPin size={14} color="#DFBF5F" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Phone size={14} color="#DFBF5F" style={{ flexShrink: 0 }} />
                <a href="tel:08212548212" style={{ color: '#D6CCA8', textDecoration: 'none' }}>0821-2548212</a>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={14} color="#DFBF5F" style={{ flexShrink: 0 }} />
                <a href="mailto:publications@jssonline.org" style={{ color: '#D6CCA8', textDecoration: 'none' }}>publications@jssonline.org</a>
              </div>
              <div style={{ paddingTop: '6px', fontSize: '0.78rem', color: '#B5AA9A' }}>
                Counter Timings: Mon–Sat 09:30 AM – 06:00 PM IST
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Policies & Admin Entry */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale, Mysuru. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s ease' }} onClick={() => handleNav('/faqs')}>FAQs</span>
            <span>·</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s ease' }} onClick={() => handleNav('/privacy')}>Privacy Policy</span>
            <span>·</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s ease' }} onClick={() => handleNav('/terms')}>Terms & Conditions</span>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleNav('/admin')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(223, 191, 95, 0.4)',
                color: '#DFBF5F',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
              title="Launch JSS Publications Enterprise Admin Suite"
            >
              <Settings size={12} />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
