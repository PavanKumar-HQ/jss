import React, { useState } from 'react';
import { ShoppingBag, Check, BookOpen, Loader2 } from 'lucide-react';

function BookCard({
  book,
  onSelectBook,
  onAddToCart,
  isAddedToCart,
  onNavigate
}) {
  const [imgError, setImgError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Clean fallback SVG book cover with authentic institutional styling
  const fallbackCover = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="100%" height="100%" fill="%23FAF7F2"/><rect x="12" y="12" width="276" height="376" fill="%235E1624" rx="3"/><rect x="20" y="20" width="260" height="360" fill="none" stroke="%23E5DFD5" stroke-width="1.2"/><text x="50%" y="46%" fill="%23FFFFFF" font-size="16" font-family="serif" text-anchor="middle" font-weight="bold">${encodeURIComponent(book.title)}</text><text x="50%" y="54%" fill="%23DFBF5F" font-size="12" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(book.author || 'JSS Publications')}</text></svg>`;

  const imageSource = imgError
    ? fallbackCover
    : (book.webpImage || fallbackCover);

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    if (onAddToCart) {
      onAddToCart(book);
    }
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleProductClick = (e) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(`/books/${book.slug || book.id}`);
    } else if (onSelectBook) {
      onSelectBook(book);
    }
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    if (onSelectBook) {
      onSelectBook(book);
    }
  };

  // Language formatting
  const langText = book.language
    ? (book.language.includes('(') ? book.language.split('(')[0].trim() : book.language)
    : 'Kannada';

  return (
    <article
      className="book-card"
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* Book Cover Container with perfect square canvas & 3D tilt */}
      <div
        className="book-card-cover-wrap"
        onClick={handleProductClick}
        title={`View details for ${book.title}`}
      >
        <picture>
          {!imgError && book.webpImage && <source srcSet={book.webpImage} type="image/webp" />}
          <img
            src={imageSource}
            onError={() => setImgError(true)}
            alt={`Cover of ${book.title}`}
            className="book-card-cover-img"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <span className="book-card-hover-tag">
          <BookOpen size={11} />
          <span>Quick View</span>
        </span>
      </div>

      {/* Book Details */}
      <div className="book-card-details">
        <div>
          {/* Category */}
          <span className="book-card-category">
            {book.category || 'Vachana Literature'}
          </span>

          {/* Book Title */}
          <h3
            className="book-card-title"
            onClick={handleProductClick}
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Kannada Title if distinct */}
          {book.titleKannada && book.titleKannada !== book.title && (
            <span className="book-card-kannada">
              {book.titleKannada}
            </span>
          )}

          {/* Author */}
          <p className="book-card-author">
            {book.author}
          </p>

          {/* Language & Page Count */}
          <div className="book-card-meta">
            <span>{langText}</span>
            {book.pages && <span> · {book.pages} pp</span>}
          </div>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="book-card-price-row">
            <span className="book-card-price">
              ₹{book.price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-green)', fontWeight: 600 }}>
              0% GST
            </span>
          </div>

          <div className="book-card-actions-grid">
            <button
              type="button"
              onClick={handlePreviewClick}
              className="btn btn-outline btn-sm btn-action-preview"
              title="Quick preview & excerpt"
            >
              <BookOpen size={13} color="var(--color-maroon)" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={handleAddClick}
              className={`btn btn-sm btn-action-add ${isAddedToCart ? 'btn-secondary' : 'btn-primary'}`}
              title={`Add ${book.title} to cart`}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 size={13} style={{ animation: 'spin 0.6s linear infinite' }} />
                  <span className="btn-text-full">Adding...</span>
                  <span className="btn-text-short">...</span>
                </>
              ) : isAddedToCart ? (
                <>
                  <Check size={13} color="var(--color-green)" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={13} />
                  <span className="btn-text-full">Add to Cart</span>
                  <span className="btn-text-short">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default React.memo(BookCard, (prevProps, nextProps) => {
  return (
    prevProps.book.id === nextProps.book.id &&
    prevProps.book.price === nextProps.book.price &&
    prevProps.isAddedToCart === nextProps.isAddedToCart
  );
});

