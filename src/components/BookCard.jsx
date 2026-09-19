import React, { useState } from 'react';
import { ShoppingBag, Eye, BookOpen, Star, Check } from 'lucide-react';

export default function BookCard({ book, onSelectBook, onAddToCart, isAddedToCart }) {
  const [imgError, setImgError] = useState(false);

  // Fallback placeholder cover SVG
  const fallbackCover = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%235E1624"/><rect x="15" y="15" width="270" height="390" fill="none" stroke="%23D97706" stroke-width="2"/><text x="50%" y="45%" fill="%23FBF9F5" font-size="20" font-family="serif" text-anchor="middle" font-weight="bold">${encodeURIComponent(book.title)}</text><text x="50%" y="55%" fill="%23C85A17" font-size="14" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(book.author || 'JSS Publications')}</text></svg>`;

  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Cover Image Container */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#F3EFE6',
          height: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        onClick={() => onSelectBook(book)}
      >
        <img
          src={imgError ? fallbackCover : book.imageUrl}
          onError={() => setImgError(true)}
          alt={`Cover image of ${book.title} published by JSS Publications`}
          style={{
            maxHeight: '210px',
            maxWidth: '150px',
            objectFit: 'contain',
            boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
            transition: 'transform 0.3s ease'
          }}
          className="book-cover-hover"
        />

        {/* Category & Variant Badge Overlays */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {book.variant && (
            <span className="badge badge-burgundy" style={{ backgroundColor: '#5E1624', color: '#FFF' }}>
              {book.variant}
            </span>
          )}
          {book.hasVariants && (
            <span className="badge badge-gold" style={{ backgroundColor: '#D97706', color: '#FFF' }}>
              Multiple Editions
            </span>
          )}
        </div>

        {/* Quick Preview Hover Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectBook(book);
          }}
          className="btn btn-sm btn-secondary"
          style={{
            position: 'absolute',
            bottom: '12px',
            padding: '6px 14px',
            fontSize: '0.8rem',
            opacity: 0.95
          }}
        >
          <Eye size={14} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Book Information Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: '#C85A17', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            {book.category || 'General Publication'}
          </span>

          <h3
            className="text-serif"
            onClick={() => onSelectBook(book)}
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: '4px',
              color: '#1C1917',
              cursor: 'pointer'
            }}
          >
            {book.title}
          </h3>

          {book.titleKannada && (
            <span className="text-kannada" style={{ fontSize: '0.88rem', color: '#57534E', display: 'block', marginBottom: '8px' }}>
              {book.titleKannada}
            </span>
          )}

          <p style={{ fontSize: '0.82rem', color: '#57534E', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {book.author ? `By ${book.author}` : 'JSS Publications Division'}
          </p>
        </div>

        {/* Price & Action Row */}
        <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#5E1624' }}>
              ₹{book.price.toLocaleString('en-IN')}
            </span>
            {book.specialPrice && (
              <span style={{ fontSize: '0.78rem', color: '#57534E', display: 'block' }}>
                Deluxe: ₹{book.specialPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span style={{ fontSize: '0.72rem', color: '#166534', display: 'block', fontWeight: 600 }}>
              GST Exempt (0%)
            </span>
          </div>

          <button
            onClick={() => onAddToCart(book)}
            className={`btn btn-sm ${isAddedToCart ? 'btn-outline' : 'btn-primary'}`}
            style={{
              borderColor: isAddedToCart ? '#166534' : undefined,
              color: isAddedToCart ? '#166534' : undefined
            }}
            aria-label={`Add ${book.title} to shopping bag`}
          >
            {isAddedToCart ? <Check size={14} /> : <ShoppingBag size={14} />}
            <span>{isAddedToCart ? 'In Bag' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
