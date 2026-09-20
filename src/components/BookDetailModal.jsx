import React, { useState } from 'react';
import { X, ShoppingBag, BookOpen, ShieldCheck, Check, Truck, ArrowRight, ExternalLink } from 'lucide-react';

export default function BookDetailModal({ book, onClose, onAddToCart, onOpenExcerpt, onNavigate }) {
  const [selectedVariant, setSelectedVariant] = useState('regular');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!book) return null;

  const currentPrice = selectedVariant === 'special' && book.specialPrice ? book.specialPrice : book.price;

  const handleAdd = () => {
    onAddToCart({
      ...book,
      price: currentPrice,
      format: selectedVariant === 'special' ? 'Hardbound' : 'Paperback',
      quantity
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleViewFullPage = () => {
    if (onClose) onClose();
    if (onNavigate) onNavigate(`/books/${book.id}`);
  };

  const fallbackCover = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%235E1624"/><rect x="12" y="12" width="276" height="396" fill="none" stroke="%23E2DACB" stroke-width="1.5"/><text x="50%" y="46%" fill="%23FFFFFF" font-size="17" font-family="serif" text-anchor="middle" font-weight="bold">${encodeURIComponent(book.title)}</text><text x="50%" y="54%" fill="%23E5C368" font-size="12" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(book.author || 'JSS Publications')}</text></svg>`;

  const imageSource = imgError
    ? (book.localImage || fallbackCover)
    : (book.imageUrl || book.localImage || fallbackCover);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-book-title">
      <div className="modal-folio" onClick={(e) => e.stopPropagation()}>
        {/* Folio Top Header Bar */}
        <div
          style={{
            backgroundColor: '#2E050B',
            color: '#FFFFFF',
            padding: '16px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(229, 195, 104, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(229,195,104,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={17} color="#E5C368" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#D6CCA8', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
                Quick Preview • {book.category || 'Vachana Literature'}
              </span>
              <h2 id="modal-book-title" className="text-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                {book.title}
              </h2>
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
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background var(--transition-fast)'
            }}
            aria-label="Close folio modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body Grid */}
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '26px', backgroundColor: 'var(--color-bg-cream)' }}>
          {/* Column 1: Cover & Sample Excerpt Trigger */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--color-border)',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <img
                src={imageSource}
                onError={() => setImgError(true)}
                alt={`Cover of ${book.title}`}
                style={{
                  maxHeight: '250px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  borderRadius: 'var(--radius-xs)'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Excerpt Reader Button */}
              {book.sampleExcerpt && (
                <button
                  type="button"
                  onClick={() => onOpenExcerpt && onOpenExcerpt(book)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', gap: '8px', justifyContent: 'center' }}
                >
                  <BookOpen size={14} />
                  <span>Read Sample Excerpt</span>
                </button>
              )}

              {/* Full Page Navigation Link */}
              <button
                type="button"
                onClick={handleViewFullPage}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', gap: '6px', justifyContent: 'center', fontSize: '0.8rem' }}
              >
                <span>Dedicated Book Page</span>
                <ExternalLink size={13} />
              </button>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--color-green)', fontWeight: 600 }}>
              <Truck size={13} />
              <span>Pan-India Speed Post Dispatch</span>
            </div>
          </div>

          {/* Column 2: Scholarly Metadata & Purchase Controls */}
          <div>
            {book.titleKannada && book.titleKannada !== book.title && (
              <h3 className="text-kannada" style={{ fontSize: '1.15rem', color: 'var(--color-maroon)', marginBottom: '6px', fontWeight: 700 }}>
                {book.titleKannada}
              </h3>
            )}

            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', marginBottom: '12px' }}>
              <strong>Author / Compiler:</strong> {book.author || 'JSS Granthamale Editorial Board'}
            </p>

            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: '18px' }}>
              {book.description || 'Authentic publication preserved and distributed under Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru.'}
            </p>

            {/* Archival Specification Grid */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                fontSize: '0.82rem',
                marginBottom: '18px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 14px'
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: '0.72rem' }}>LANGUAGE</span>
                <strong>{book.language}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: '0.72rem' }}>PAGE COUNT</span>
                <strong>{book.pages || 'N/A'} Pages</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: '0.72rem' }}>SKU / ISBN</span>
                <strong>{book.isbn || `JSS-BK-${book.id}`}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: '0.72rem' }}>PUBLISHER</span>
                <strong>JSS Granthamale, Mysuru</strong>
              </div>
              {book.series && (
                <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--color-border-light)', paddingTop: '6px' }}>
                  <span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: '0.72rem' }}>SERIES</span>
                  <strong style={{ color: 'var(--color-saffron)' }}>{book.series}</strong>
                </div>
              )}
            </div>

            {/* Physical Variant Selector */}
            {book.hasVariants && (
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
                  Select Edition:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedVariant('regular')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedVariant === 'regular' ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                      backgroundColor: selectedVariant === 'regular' ? '#FFFFFF' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700 }}>
                      Paperback
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-maroon)', fontWeight: 800 }}>
                      ₹{book.price.toLocaleString('en-IN')}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVariant('special')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedVariant === 'special' ? '2px solid var(--color-saffron)' : '1px solid var(--color-border)',
                      backgroundColor: selectedVariant === 'special' ? '#FFFBF0' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700 }}>
                      Deluxe Hardbound
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-saffron)', fontWeight: 800 }}>
                      ₹{book.specialPrice?.toLocaleString('en-IN')}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Price & Quantity & Add to Cart Row */}
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-maroon)', fontFamily: 'var(--font-serif-heading)' }}>
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-green)', display: 'block', fontWeight: 600 }}>
                  0% GST (Exempted Book)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Quantity Modifier */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: '#FFFFFF' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', fontWeight: 700 }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span style={{ padding: '0 6px', fontSize: '0.88rem', fontWeight: 600 }}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', fontWeight: 700 }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                >
                  {isAdded ? <Check size={15} /> : <ShoppingBag size={15} />}
                  <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
