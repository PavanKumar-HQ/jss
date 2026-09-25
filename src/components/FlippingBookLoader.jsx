import React from 'react';

export default function FlippingBookLoader({
  message = 'Loading JSS Granthamale...',
  subtitle = 'ಜ್ಞಾನವೇ ಬೆಳಕು · ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ'
}) {
  return (
    <div
      className="flipping-book-wrapper"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* 3D Perspective Stage */}
      <div className="flipping-book-stage">
        {/* Soft floor shadow */}
        <div className="flipping-book-shadow" />

        {/* The 3D Book Container */}
        <div className="flipping-book">
          {/* Maroon Hardcover Base */}
          <div className="book-cover book-cover-left" />
          <div className="book-cover book-cover-right" />
          <div className="book-spine" />

          {/* Left Static Opened Page with printed script lines */}
          <div className="page-static page-left">
            <div className="script-lines">
              <span /><span /><span /><span /><span />
            </div>
            <div className="kannada-watermark">ವಚನ</div>
          </div>

          {/* Animated Turning Pages */}
          <div className="flip-leaf leaf-1">
            <div className="leaf-front">
              <div className="script-lines"><span /><span /><span /></div>
            </div>
            <div className="leaf-back">
              <div className="script-lines"><span /><span /><span /></div>
            </div>
          </div>
          <div className="flip-leaf leaf-2">
            <div className="leaf-front">
              <div className="script-lines"><span /><span /><span /></div>
            </div>
            <div className="leaf-back">
              <div className="script-lines"><span /><span /><span /></div>
            </div>
          </div>
          <div className="flip-leaf leaf-3">
            <div className="leaf-front">
              <div className="script-lines"><span /><span /><span /></div>
            </div>
            <div className="leaf-back">
              <div className="script-lines"><span /><span /><span /></div>
            </div>
          </div>

          {/* Right Static Base Page */}
          <div className="page-static page-right">
            <div className="script-lines">
              <span /><span /><span /><span /><span />
            </div>
            <div className="kannada-watermark">ಧರ್ಮ</div>
          </div>
        </div>
      </div>

      {/* Editorial Caption */}
      <div className="flipping-book-caption">
        <p className="flipping-book-title text-serif">{message}</p>
        {subtitle && <span className="flipping-book-subtitle text-kannada">{subtitle}</span>}
      </div>
    </div>
  );
}
