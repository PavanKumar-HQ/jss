import React, { useState } from 'react';
import { X, ShoppingBag, BookOpen, Quote, Truck, Check, ExternalLink, Bookmark, ShieldCheck } from 'lucide-react';


export default function BookPreviewModal({ book, onClose, onAddToCart, onNavigate }) {
  const [activeTab, setActiveTab] = useState(book?.initialTab || 'overview'); // 'overview' | 'excerpt'
  const [selectedVariant, setSelectedVariant] = useState('regular'); // 'regular' (Paperback) | 'special' (Hardbound)
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    if (book?.initialTab) {
      setActiveTab(book.initialTab);
    }
  }, [book]);

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
    : (book.webpImage || book.localImage || book.imageUrl || fallbackCover);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="merged-modal-title">
      <div
        className="modal-folio"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
      >
        {/* Folio Top Header Bar */}
        <div
          style={{
            backgroundColor: '#230408',
            color: '#FFFFFF',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(229, 195, 104, 0.28)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(229, 195, 104, 0.16)',
                border: '1px solid rgba(229, 195, 104, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E5C368'
              }}
            >
              {activeTab === 'overview' ? <BookOpen size={18} /> : <Quote size={18} />}
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#E5C368', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', fontWeight: 600 }}>
                JSS Granthamale Folio #{book.id} • {book.category || 'Vachana Literature'}
              </span>
              <h2 id="merged-modal-title" className="text-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
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
              padding: '7px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Overview vs Excerpt */}
        <div
          style={{
            backgroundColor: '#FAF7F2',
            borderBottom: '1px solid var(--color-border)',
            padding: '8px clamp(12px, 3.5vw, 24px) 0',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '10px clamp(10px, 2.5vw, 18px)',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '3px solid var(--color-maroon)' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'overview' ? 'var(--color-maroon)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'overview' ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all var(--transition-fast)'
            }}
          >
            <BookOpen size={15} />
            <span>Overview & Specs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('excerpt')}
            style={{
              padding: '10px clamp(10px, 2.5vw, 18px)',
              border: 'none',
              borderBottom: activeTab === 'excerpt' ? '3px solid var(--color-saffron)' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'excerpt' ? 'var(--color-saffron)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'excerpt' ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all var(--transition-fast)'
            }}
          >
            <Quote size={15} />
            <span>Sample Excerpt (ವಚನ)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: 'clamp(14px, 3.5vw, 24px)', overflowY: 'auto', flex: 1, backgroundColor: activeTab === 'overview' ? '#FFFFFF' : '#FAF7F2' }}>
          
          {/* TAB 1: BOOK OVERVIEW & PURCHASE CONTROLS */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '26px' }}>
              
              {/* Left: Book Cover & Badges */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-neutral)',
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-card)',
                    marginBottom: '14px',
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
                      decoding="async"
                      style={{
                        maxHeight: '260px',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        borderRadius: 'var(--radius-xs)',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.18)'
                      }}
                    />
                  </picture>
                </div>

                {/* Quick tab trigger to excerpt */}
                <button
                  type="button"
                  onClick={() => setActiveTab('excerpt')}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', gap: '6px', justifyContent: 'center', marginBottom: '8px', borderRadius: 'var(--radius-pill)' }}
                >
                  <Quote size={13} />
                  <span>Peek Inside: Read Excerpt</span>
                </button>

                <button
                  type="button"
                  onClick={handleViewFullPage}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', gap: '6px', justifyContent: 'center', borderRadius: 'var(--radius-pill)' }}
                >
                  <span>Open Full Dedicated Page</span>
                  <ExternalLink size={13} />
                </button>

                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--color-green)', fontWeight: 600 }}>
                  <Truck size={13} />
                  <span>Pan-India Speed Post Dispatch</span>
                </div>
              </div>

              {/* Right: Meta & Purchase Controls */}
              <div>
                {book.titleKannada && book.titleKannada !== book.title && (
                  <h3 className="text-kannada" style={{ fontSize: '1.2rem', color: 'var(--color-maroon)', marginBottom: '6px', fontWeight: 700 }}>
                    {book.titleKannada}
                  </h3>
                )}

                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)', marginBottom: '10px' }}>
                  <strong>Author / Compiler:</strong> {book.author || 'JSS Granthamale Editorial Board'}
                </p>

                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {book.description || 'Authentic publication preserved and distributed under Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru.'}
                </p>

                {/* Bibliographic Spec Table */}
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-cream)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontSize: '0.82rem',
                    marginBottom: '16px',
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
                    <span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: '0.72rem' }}>CATALOGUE SKU</span>
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

                {/* Edition Selector */}
                {book.hasVariants && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
                      Binding Edition:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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

                {/* Price & Quantity & Add to Cart */}
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
                      0% GST (Exempted Publication)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                      style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: 'var(--radius-pill)' }}
                    >
                      {isAdded ? <Check size={15} /> : <ShoppingBag size={15} />}
                      <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANUSCRIPT EXCERPT & READING SAMPLE */}
          {activeTab === 'excerpt' && (
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              
              {/* Manuscript Parchment Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '28px 24px',
                  boxShadow: 'var(--shadow-card)',
                  marginBottom: '20px',
                  position: 'relative'
                }}
              >
                {/* Ornamental Top Header */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--color-saffron)', fontWeight: 700 }}>
                    — ಗ್ರಂಥ ಪ್ರವೇಶ ದರ್ಶನ • SACRED MANUSCRIPT PASSAGE —
                  </span>
                </div>

                {/* Kannada Verse Block */}
                <div
                  style={{
                    borderLeft: '4px solid var(--color-saffron)',
                    padding: '16px 20px',
                    backgroundColor: 'rgba(184, 78, 26, 0.05)',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    marginBottom: '18px'
                  }}
                >
                  <p className="text-kannada" style={{ fontSize: '1.15rem', color: 'var(--color-maroon)', lineHeight: 1.8, fontWeight: 600 }}>
                    "{book.sampleExcerpt || `ವಚನ ಹಾಗೂ ತತ್ತ್ವ ಸಾಹಿತ್ಯದ ಅನರ್ಘ್ಯ ರತ್ನ: ${book.title}. ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆಯ ಪವಿತ್ರ ಸಂಪುಟ.`}"
                  </p>
                </div>

                {/* English Translation / Scholarly Reflection */}
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: '14px' }}>
                  Preserved in the sacred editorial archives of Jagadguru Sri Shivarathreeshwara Granthamale, this volume encapsulates profound philosophical inquiries into spiritual realization, social democracy, and universal human compassion as voiced by Karnataka's 12th-century Sharana tradition.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)', paddingTop: '10px' }}>
                  <Bookmark size={13} color="var(--color-saffron)" />
                  <span>Catalogued in JSS Granthamale Mysuru Permanent Archives</span>
                </div>
              </div>

              {/* Bottom Quick Add Action from Excerpt Tab */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  backgroundColor: '#FFFFFF',
                  padding: '14px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', display: 'block' }}>
                    Authentic Complete Volume ({book.pages || 160} Pages)
                  </span>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--color-maroon)' }}>
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: 'var(--radius-pill)' }}
                  >
                    Back to Details
                  </button>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: 'var(--radius-pill)' }}
                  >
                    {isAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
                    <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
