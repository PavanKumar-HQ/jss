import React from 'react';
import { BookOpen, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onOpenLocation, onOpenBulkEnquiry, languageMode }) {
  return (
    <footer style={{ backgroundColor: '#3F0E18', color: '#FBF9F5', paddingTop: '48px', paddingBottom: '24px', borderTop: '4px solid #C85A17' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          {/* Col 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ backgroundColor: '#FBF9F5', padding: '4px', borderRadius: '6px' }}>
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" rx="16" fill="#5E1624"/>
                  <path d="M20 72 C35 60 50 65 50 82 C50 65 65 60 80 72 L80 35 C65 25 50 30 50 45 C50 30 35 25 20 35 Z" fill="#FBF9F5"/>
                  <path d="M50 82 L50 45" stroke="#C85A17" strokeWidth="4" strokeLinecap="round"/>
                  <circle cx="50" cy="22" r="8" fill="#D97706"/>
                </svg>
              </div>
              <span className="text-serif" style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                JSS PUBLICATIONS
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', opacity: 0.85, lineHeight: 1.6, marginBottom: '16px' }}>
              Jagadguru Sri Shivarathreeshwara Granthamale is dedicated to publishing authentic Vachana literature, Veerashaiva philosophy, educational research, and spiritual books under JSS Mahavidyapeetha, Mysuru.
            </p>

            <span className="text-kannada" style={{ fontSize: '0.82rem', color: '#D97706', display: 'block' }}>
              ಸಾಹಿತ್ಯದ ಮೂಲಕ ಸಾಮಾಜಿಕ ಹಾಗೂ ಧಾರ್ಮಿಕ ಜಾಗೃತಿ
            </span>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-serif" style={{ fontSize: '1rem', fontWeight: 600, color: '#D97706', marginBottom: '14px' }}>
              Catalogue Sections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', opacity: 0.9 }}>
              <li>Vachana Literature (ವಚನ ಸಾಹಿತ್ಯ)</li>
              <li>Sharana Samskruti Series (ಶರಣ ಸಂಸ್ಕೃತಿ ಮಾಲೆ)</li>
              <li>Vachana Vyakyana Series (ವಚನ ವ್ಯಾಖ್ಯಾನ)</li>
              <li>Periodicals (*Prasada* & *Sharanapatha*)</li>
              <li>Annual Panchangas & Calendars</li>
              <li>Audio & Video Disc Collections</li>
            </ul>
          </div>

          {/* Col 3: Institutional Services */}
          <div>
            <h4 className="text-serif" style={{ fontSize: '1rem', fontWeight: 600, color: '#D97706', marginBottom: '14px' }}>
              Institutional Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', opacity: 0.9 }}>
              <li>
                <button onClick={onOpenBulkEnquiry} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  School & College Bulk Procurement
                </button>
              </li>
              <li>Public Library Supply Terms</li>
              <li>
                <button onClick={onOpenLocation} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  JSS Book House Retail Outlet
                </button>
              </li>
              <li>Pan-India Postal Shipping Policy</li>
              <li>Tax Exemption (0% GST on Printed Books)</li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="text-serif" style={{ fontSize: '1rem', fontWeight: 600, color: '#D97706', marginBottom: '14px' }}>
              Official Contact
            </h4>
            <address style={{ fontStyle: 'normal', fontSize: '0.85rem', opacity: 0.88, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <MapPin size={16} color="#C85A17" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru – 570 004</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Phone size={16} color="#C85A17" style={{ flexShrink: 0 }} />
                <span>0821-2548212 / 2548218</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Mail size={16} color="#C85A17" style={{ flexShrink: 0 }} />
                <span>jss@jssonline.org</span>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '0.78rem', opacity: 0.75 }}>
          <div>
            © 2026 JSS Mahavidyapeetha / JSS Publications, Mysuru. All Rights Reserved. Compliant with DPDP Act 2023.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Sale</span>
            <span>Shipping Policy</span>
            <span>Return Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
