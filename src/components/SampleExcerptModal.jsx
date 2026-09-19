import React from 'react';
import { X, BookOpen, Check } from 'lucide-react';

export default function SampleExcerptModal({ book, onClose }) {
  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="excerpt-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '0' }}>
        {/* Reader Header */}
        <div style={{ backgroundColor: '#3F0E18', color: '#FBF9F5', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="#D97706" />
            <div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>Sample Excerpt Preview</span>
              <h3 id="excerpt-title" className="text-serif" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {book.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
            aria-label="Close sample preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Reader Content Body */}
        <div style={{ padding: '24px', backgroundColor: '#FBF9F5', minHeight: '260px' }}>
          <div style={{ borderLeft: '3px solid #C85A17', paddingLeft: '16px', marginBottom: '20px' }}>
            <p className="text-serif" style={{ fontSize: '1rem', fontStyle: 'italic', color: '#5E1624' }}>
              " {book.sampleExcerpt || 'Authentic publication excerpt preserved under JSS Granthamale.'} "
            </p>
          </div>

          <p style={{ fontSize: '0.92rem', color: '#1C1917', lineHeight: 1.7 }}>
            This preview offers a glimpse into the scholarly depth and cultural significance of this publication. To read the complete text, add the book to your bag for direct home delivery anywhere in India or internationally.
          </p>
        </div>

        {/* Reader Footer */}
        <div style={{ padding: '12px 20px', backgroundColor: '#F3EFE6', borderTop: '1px solid #E7E5E4', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
