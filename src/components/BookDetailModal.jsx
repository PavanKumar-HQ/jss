import React, { useState } from 'react';
import { X, ShoppingBag, BookOpen, ShieldCheck, Check, Info, FileText, Share2 } from 'lucide-react';

export default function BookDetailModal({ book, onClose, onAddToCart, onOpenExcerpt }) {
  const [selectedVariant, setSelectedVariant] = useState('regular');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!book) return null;

  const currentPrice = selectedVariant === 'special' && book.specialPrice ? book.specialPrice : book.price;

  const handleAdd = () => {
    onAddToCart({ ...book, price: currentPrice, selectedVariant });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-book-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '0', overflow: 'hidden' }}>
        {/* Header Bar */}
        <div style={{ backgroundColor: '#5E1624', color: '#FFF', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.78rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              JSS Publications Catalogue Item #{book.id}
            </span>
            <h2 id="modal-book-title" className="text-serif" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {book.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '4px' }}
            aria-label="Close product details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body Grid */}
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) 2fr', gap: '24px' }}>
          {/* Cover & Sample Reading Trigger */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: '#F3EFE6', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <img
                src={book.imageUrl}
                alt={`Cover of ${book.title}`}
                style={{ maxHeight: '240px', maxWidth: '100%', objectFit: 'contain', boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}
              />
            </div>

            {book.sampleExcerpt && (
              <button
                onClick={() => onOpenExcerpt(book)}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', gap: '6px' }}
              >
                <BookOpen size={15} color="#C85A17" />
                <span>Read Sample Excerpt</span>
              </button>
            )}
          </div>

          {/* Book Metadata & Purchasing Options */}
          <div>
            {book.titleKannada && (
              <h3 className="text-kannada" style={{ fontSize: '1.1rem', color: '#5E1624', marginBottom: '8px' }}>
                {book.titleKannada}
              </h3>
            )}

            <p style={{ fontSize: '0.9rem', color: '#57534E', marginBottom: '16px' }}>
              {book.author ? <strong>Author:</strong> : 'Published by:'} {book.author || 'JSS Granthamale Editorial Board'}
            </p>

            {/* Spec Attributes Table */}
            <div style={{ backgroundColor: '#FBF9F5', border: '1px solid #E7E5E4', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><strong style={{ color: '#57534E' }}>Language:</strong> {book.language}</div>
              <div><strong style={{ color: '#57534E' }}>Pages:</strong> {book.pages} Pages</div>
              <div><strong style={{ color: '#57534E' }}>ISBN:</strong> {book.isbn || 'Registered JSS SKU'}</div>
              <div><strong style={{ color: '#57534E' }}>Publisher:</strong> {book.publisher}</div>
              {book.series && <div style={{ gridColumn: 'span 2' }}><strong style={{ color: '#57534E' }}>Series:</strong> {book.series}</div>}
            </div>

            {/* Physical Variant Selector */}
            {book.hasVariants && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1C1917', marginBottom: '8px' }}>
                  Select Physical Binding Edition:
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setSelectedVariant('regular')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: selectedVariant === 'regular' ? '2px solid #C85A17' : '1px solid #D6D3D1',
                      backgroundColor: selectedVariant === 'regular' ? 'rgba(200,90,23,0.06)' : '#FFF',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Regular Edition</span>
                    <span style={{ fontSize: '0.8rem', color: '#5E1624', fontWeight: 700 }}>₹{book.price}</span>
                  </button>

                  <button
                    onClick={() => setSelectedVariant('special')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: selectedVariant === 'special' ? '2px solid #C85A17' : '1px solid #D6D3D1',
                      backgroundColor: selectedVariant === 'special' ? 'rgba(200,90,23,0.06)' : '#FFF',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Collector Special</span>
                    <span style={{ fontSize: '0.8rem', color: '#5E1624', fontWeight: 700 }}>₹{book.specialPrice}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Description Text */}
            <p style={{ fontSize: '0.9rem', color: '#1C1917', lineHeight: 1.5, marginBottom: '20px' }}>
              {book.description}
            </p>

            {/* Price & Add to Cart Controls */}
            <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#5E1624' }}>
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#166534', display: 'block', fontWeight: 600 }}>
                  Tax Exempt (0% GST) • Free Delivery above ₹500
                </span>
              </div>

              <button
                onClick={handleAdd}
                className="btn btn-primary"
                style={{ padding: '12px 24px', gap: '8px' }}
              >
                {isAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
                <span>{isAdded ? 'Added to Bag!' : 'Add to Bag'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
