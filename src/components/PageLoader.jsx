import React, { useEffect, useState } from 'react';

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Only show on main initial website load per session
    const hasSeenLoader = sessionStorage.getItem('jss_loader_seen');
    if (!hasSeenLoader) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsFading(true);
        const fadeTimer = setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem('jss_loader_seen', 'true');
        }, 400);
        return () => clearTimeout(fadeTimer);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="initial-page-loader"
      style={{
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? 'none' : 'auto'
      }}
      aria-label="Loading JSS Publications Website"
      role="status"
    >
      <div className="loader-logo-pulse" style={{ textAlign: 'center' }}>
        <svg width="72" height="72" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="#FBF9F5" />
          <path d="M20 72 C35 60 50 65 50 82 C50 65 65 60 80 72 L80 35 C65 25 50 30 50 45 C50 30 35 25 20 35 Z" fill="#5E1624" />
          <path d="M50 82 L50 45" stroke="#C85A17" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="22" r="8" fill="#D97706" />
          <path d="M50 10 Q54 18 50 22 Q46 18 50 10 Z" fill="#C85A17" />
        </svg>
        <h1 className="text-serif" style={{ fontSize: '1.5rem', marginTop: '16px', letterSpacing: '1px' }}>
          JSS PUBLICATIONS
        </h1>
        <p className="text-kannada" style={{ fontSize: '0.95rem', opacity: 0.85, marginTop: '4px' }}>
          ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ, ಮೈಸೂರು
        </p>
      </div>
      <div style={{ marginTop: '32px', display: 'flex', gap: '6px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C85A17', animation: 'pulseLogo 1s infinite 0s' }}></div>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D97706', animation: 'pulseLogo 1s infinite 0.2s' }}></div>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FBF9F5', animation: 'pulseLogo 1s infinite 0.4s' }}></div>
      </div>
    </div>
  );
}
