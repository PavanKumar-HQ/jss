import React, { useState } from 'react';
import { ShoppingBag, Check, BookOpen, ArrowRight } from 'lucide-react';


const BookCard = React.memo(function BookCard({ book, onSelectBook, onAddToCart, isAddedToCart, staggerDelay = 0 }) {
  const [imgError, setImgError] = useState(false);

  // Fallback clean book cover SVG in deep maroon
  const fallbackCover = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%235E1624"/><rect x="12" y="12" width="276" height="396" fill="none" stroke="%23E2DACB" stroke-width="1.5"/><text x="50%" y="46%" fill="%23FFFFFF" font-size="17" font-family="serif" text-anchor="middle" font-weight="bold">${encodeURIComponent(book.title)}</text><text x="50%" y="54%" fill="%23E5C368" font-size="12" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(book.author || 'JSS Publications')}</text></svg>`;

  const imageSource = imgError 
    ? (book.localImage || fallbackCover)
    : (book.webpImage || book.localImage || book.imageUrl || fallbackCover);

  return (
    <article
      className="book-card animate-fade-in"
      aria-label={`${book.title} by ${book.author}`}
      style={{
        animationDelay: `${staggerDelay}ms`,
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Book Cover Container with Micro-interaction */}
      <div
        className="book-card-cover-wrap"
        onClick={() => onSelectBook && onSelectBook(book)}
        title="Click to preview volume & sacred excerpt"
      >
        <picture>
          {!imgError && book.webpImage && <source srcSet={book.webpImage} type="image/webp" />}
          {!imgError && book.localImage && <source srcSet={book.localImage} type="image/jpeg" />}
          <img
            src={imageSource}
            onError={() => setImgError(true)}
            alt={`Cover of ${book.title}`}
            className="book-card-cover-img"
            loading="lazy"
            decoding="async"
          />
        </picture>

        {/* Hover Quick Action Cue */}
        <div
          className="book-cover-overlay-cue"
          style={{
            position: 'absolute',
            bottom: '10px',
            backgroundColor: 'rgba(35, 4, 8, 0.88)',
            color: '#FAF7F2',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.72rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            opacity: 0,
            transform: 'translateY(6px)',
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
            border: '1px solid rgba(229, 195, 104, 0.3)'
          }}
        >
          <BookOpen size={11} color="#E5C368" />
          <span>Peek Inside</span>
        </div>
      </div>

      {/* Book Details */}
      <div className="book-card-details" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '14px 14px 12px' }}>
        <div>
          {/* Category */}
          <span className="book-card-category">
            {book.category || 'Vachana Literature'}
          </span>

          {/* Book Title */}
          <h3
            className="book-card-title"
            onClick={() => onSelectBook && onSelectBook(book)}
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Kannada Title */}
          {book.titleKannada && book.titleKannada !== book.title && (
            <span className="book-card-kannada">
              {book.titleKannada}
            </span>
          )}

          {/* Author */}
          <p className="book-card-author">
            {book.author}
          </p>

          {/* Language & Metadata */}
          <div className="book-card-meta">
            <span>{book.language ? (book.language.includes('(') ? book.language.split('(')[0].trim() : book.language) : 'Kannada'}</span>
            {book.pages && <span> · {book.pages} pp</span>}
            {book.hasVariants ? (
              <span style={{ color: 'var(--color-saffron)', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                Paperback & Hardbound
              </span>
            ) : (
              <span> · Standard Folio</span>
            )}
          </div>
        </div>

        {/* Price & Primary Action Buttons */}
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--color-border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span className="book-card-price">
              ₹{book.price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-green)', fontWeight: 600 }}>
              0% GST
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {/* Merged Preview & Excerpt Button */}
            <button
              type="button"
              onClick={() => onSelectBook && onSelectBook(book)}
              className="btn btn-outline btn-sm"
              style={{
                padding: '6px 6px',
                fontSize: '0.78rem',
                gap: '4px',
                justifyContent: 'center',
                borderRadius: 'var(--radius-pill)',
                borderColor: 'var(--color-border-dark)',
                minHeight: '34px'
              }}
              title="Preview details and read sacred excerpt"
            >
              <BookOpen size={13} color="var(--color-maroon)" />
              <span>Preview</span>
            </button>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={() => onAddToCart && onAddToCart(book)}
              className={`btn btn-sm ${isAddedToCart ? 'btn-secondary' : 'btn-primary'}`}
              style={{
                padding: '6px 8px',
                fontSize: '0.78rem',
                gap: '4px',
                justifyContent: 'center',
                borderRadius: 'var(--radius-pill)',
                borderColor: isAddedToCart ? 'var(--color-green)' : undefined,
                color: isAddedToCart ? 'var(--color-green)' : undefined,
                minHeight: '34px'
              }}
              title={`Add ${book.title} to cart`}
              aria-label={`Add ${book.title} to cart`}
            >
              {isAddedToCart ? <Check size={13} /> : <ShoppingBag size={13} />}
              <span>{isAddedToCart ? 'Added' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

export default BookCard;
