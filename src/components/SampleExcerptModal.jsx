import React, { useState } from 'react';
import { X, BookOpen, Quote, Bookmark, Share2, Check } from 'lucide-react';

export default function SampleExcerptModal({ book, onClose }) {
  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="excerpt-title">
      <div
        className="modal-folio"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', overflow: 'hidden' }}
      >
        {/* Manuscript Header Bar */}
        <div
          style={{
            backgroundColor: '#2E060D',
            color: '#FFFFFF',
            padding: '16px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(197, 155, 39, 0.35)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Quote size={18} color="#E5C368" />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#D6CCA8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Literary Sample & Manuscript Reader
              </span>
              <h3 id="excerpt-title" className="text-serif-display" style={{ fontSize: '1.18rem', fontWeight: 700 }}>
                {book.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%'
            }}
            aria-label="Close excerpt reader"
          >
            <X size={18} />
          </button>
        </div>

        {/* Parchment Manuscript Page */}
        <div
          style={{
            padding: '36px 32px',
            backgroundColor: '#FBF8F2',
            backgroundImage: 'radial-gradient(#E8E0D2 0.75px, transparent 0.75px)',
            backgroundSize: '20px 20px',
            minHeight: '280px',
            position: 'relative'
          }}
        >
          {/* Ornamental border box */}
          <div
            style={{
              border: '1px solid #D6CCA8',
              padding: '24px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(46,6,13,0.06)',
              position: 'relative'
            }}
          >
            {/* Top Ornamental Seal */}
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#8C6B14', fontWeight: 700 }}>
                — ಗ್ರಂಥ ಪ್ರವೇಶ ದರ್ಶನ • SACRED PASSAGE —
              </span>
            </div>

            {/* Kannada Literary Excerpt */}
            <div
              style={{
                borderLeft: '4px solid #C59B27',
                paddingLeft: '18px',
                marginBottom: '20px',
                backgroundColor: 'rgba(197, 155, 39, 0.05)',
                padding: '14px 18px',
                borderRadius: '0 6px 6px 0'
              }}
            >
              <p className="text-kannada" style={{ fontSize: '1.15rem', color: '#4A0E17', lineHeight: 1.8, fontWeight: 500 }}>
                "{book.sampleExcerpt || `ವಚನ ಹಾಗೂ ಧರ್ಮ ಸಾಹಿತ್ಯದ ಅನರ್ಘ್ಯ ರತ್ನ: ${book.title}. ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆಯ ಪವಿತ್ರ ಪ್ರಕಟಣೆ...`}"
              </p>
            </div>

            {/* Scholarly English Synopsis & Cultural Context */}
            <p style={{ fontSize: '0.92rem', color: '#48403B', lineHeight: 1.7, marginBottom: '12px' }}>
              Preserved in the sacred editorial archives of Jagadguru Sri Shivarathreeshwara Granthamale, this work encapsulates profound philosophical inquiries into spiritual self-realization, societal equality, and universal ethics as articulated by the 12th-century Sharanas of Karnataka.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#79706A', fontStyle: 'italic', borderTop: '1px solid #F0ECE3', paddingTop: '10px' }}>
              <Bookmark size={13} color="#C59B27" />
              <span>Catalogued in JSS Granthamale Mysore Permanent Archive</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#F3ECE0',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.82rem', color: '#524944' }}>
            Full volume contains <strong>{book.pages || 160} pages</strong> of authentic text.
          </span>

          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Folio
          </button>
        </div>
      </div>
    </div>
  );
}
