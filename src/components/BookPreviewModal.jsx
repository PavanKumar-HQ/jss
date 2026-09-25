import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, BookOpen, Quote, ArrowRight, Check, Loader2 } from 'lucide-react';

export default function BookPreviewModal({ book, onClose, onAddToCart, onNavigate }) {
  const [activeTab, setActiveTab] = useState(book?.initialTab || 'overview');
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (book?.initialTab) {
      setActiveTab(book.initialTab);
    }
  }, [book]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!book) return null;

  const handleAdd = () => {
    if (isAdding) return;
    setIsAdding(true);
    if (onAddToCart) {
      onAddToCart(book);
    }
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1600);
    }, 400);
  };

  const handleViewFullPage = () => {
    if (onClose) onClose();
    if (onNavigate) onNavigate(`/books/${book.slug || book.id}`);
  };

  const fallbackCover = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="100%" height="100%" fill="%23FAF7F2"/><rect x="12" y="12" width="276" height="376" fill="%235E1624" rx="3"/><text x="50%" y="48%" fill="%23FFFFFF" font-size="16" font-family="serif" text-anchor="middle" font-weight="bold">${encodeURIComponent(book.title)}</text><text x="50%" y="56%" fill="%23DFBF5F" font-size="12" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(book.author || 'JSS Publications')}</text></svg>`;

  const imageSource = imgError
    ? (book.localImage || fallbackCover)
    : (book.webpImage || book.localImage || book.imageUrl || fallbackCover);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div
        className="modal-folio"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simple Maroon Header Strip */}
        <div
          style={{
            backgroundColor: 'var(--color-maroon)',
            color: '#FFFFFF',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#DFBF5F', fontWeight: 600, display: 'block' }}>
              JSS Granthamale · Quick Preview
            </span>
            <h2 id="preview-modal-title" className="text-serif" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
              {book.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: 'var(--radius-xs)',
              width: '28px',
              height: '28px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close preview"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Selector: Overview | Sample Excerpt */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-neutral)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              background: activeTab === 'overview' ? '#FFFFFF' : 'transparent',
              borderBottom: activeTab === 'overview' ? '2px solid var(--color-maroon)' : '2px solid transparent',
              color: activeTab === 'overview' ? 'var(--color-maroon)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'overview' ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={14} />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('excerpt')}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              background: activeTab === 'excerpt' ? '#FFFFFF' : 'transparent',
              borderBottom: activeTab === 'excerpt' ? '2px solid var(--color-maroon)' : '2px solid transparent',
              color: activeTab === 'excerpt' ? 'var(--color-maroon)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'excerpt' ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Quote size={14} />
            <span>Sample Excerpt</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'overview' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px', alignItems: 'start' }}>
              {/* Left: Book Cover */}
              <div
                style={{
                  aspectRatio: '3 / 4',
                  backgroundColor: 'var(--color-bg-neutral)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <picture>
                  {!imgError && book.webpImage && <source srcSet={book.webpImage} type="image/webp" />}
                  {!imgError && book.localImage && <source srcSet={book.localImage} type="image/jpeg" />}
                  <img
                    src={imageSource}
                    onError={() => setImgError(true)}
                    alt={`Cover of ${book.title}`}
                    style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </picture>
              </div>

              {/* Right: Metadata */}
              <div>
                <span className="badge badge-maroon" style={{ marginBottom: '6px' }}>
                  {book.category}
                </span>

                <h3 className="text-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>
                  {book.title}
                </h3>

                {book.titleKannada && book.titleKannada !== book.title && (
                  <span className="text-kannada" style={{ fontSize: '0.94rem', color: 'var(--color-maroon-dark)', display: 'block', marginBottom: '6px' }}>
                    {book.titleKannada}
                  </span>
                )}

                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                  <strong>Author:</strong> {book.author}
                </p>

                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-body)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {book.description}
                </p>

                <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginBottom: '14px' }}>
                  <span><strong>Language:</strong> {book.language}</span>
                  {book.pages && <span><strong>Length:</strong> {book.pages} pp</span>}
                  {book.isbn && <span><strong>SKU:</strong> {book.isbn}</span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                    ₹{book.price}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-green)', fontWeight: 600 }}>
                    0% GST · In Stock
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '8px 4px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '8px' }}>
                Canonical Excerpt & Verses
              </span>

              {book.sampleExcerpt ? (
                <div style={{ backgroundColor: 'var(--color-bg-neutral)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)', padding: '16px', marginBottom: '16px' }}>
                  <p className="text-kannada" style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--color-text-charcoal)', fontStyle: 'italic', marginBottom: '8px' }}>
                    "{book.sampleExcerpt}"
                  </p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    — Excerpted from {book.title} (JSS Granthamale Archives)
                  </span>
                </div>
              ) : (
                <div style={{ backgroundColor: 'var(--color-bg-neutral)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)', padding: '16px', marginBottom: '16px' }}>
                  <p className="text-kannada" style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--color-text-charcoal)' }}>
                    ಈ ಗ್ರಂಥವು ಶ್ರೀ ಜಗದ್ಗುರು ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆಯ ಅಧಿಕೃತ ಪ್ರಕಾಶನವಾಗಿದ್ದು, ಆಧ್ಯಾತ್ಮಿಕ, ತಾತ್ವಿಕ ಹಾಗೂ ವಚನ ಸಾಹಿತ್ಯದ ಸಂಶೋಧನೆಯನ್ನು ಒಳಗೊಂಡಿದೆ.
                  </p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '6px' }}>
                    — Jagadguru Sri Shivarathreeshwara Granthamale, Mysuru
                  </span>
                </div>
              )}

              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
                Full introductory essays, exegeses, indexes, and scholarly glossaries are provided in the complete printed volume.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: 'var(--color-bg-neutral)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <button
            type="button"
            onClick={handleViewFullPage}
            className="btn btn-outline btn-sm"
          >
            <span>View Full Book Page</span>
            <ArrowRight size={13} />
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary btn-sm"
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 size={13} style={{ animation: 'spin 0.6s linear infinite' }} />
                <span>Adding...</span>
              </>
            ) : isAdded ? (
              <>
                <Check size={13} color="var(--color-green)" />
                <span>Added to Cart ✓</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                <span>Add to Cart (₹{book.price})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
