import React, { useState, useEffect } from 'react';
import { X, Bookmark, Trash2, ShoppingBag, ArrowRight, BookOpen } from 'lucide-react';
import { wishlistService, cartService } from '../services';

export default function WishlistDrawer({ isOpen, onClose, onNavigate, onAddToCart }) {
  const [items, setItems] = useState(() => wishlistService.getWishlist());

  useEffect(() => {
    return wishlistService.subscribe((updatedList) => {
      setItems(updatedList);
    });
  }, []);

  if (!isOpen) return null;

  const handleMoveToCart = (item) => {
    if (onAddToCart) {
      onAddToCart(item);
      wishlistService.removeItem(item.id);
    } else {
      wishlistService.moveToCart(item.id, cartService, item.binding || 'Paperback');
    }
  };

  const handleMoveAllToCart = () => {
    if (onAddToCart) {
      items.forEach((item) => onAddToCart(item));
      wishlistService.clearWishlist();
    } else {
      wishlistService.moveAllToCart(cartService);
    }
  };

  const handleRemove = (productId) => {
    wishlistService.removeItem(productId);
  };

  const handleBookClick = (slugOrId) => {
    onClose();
    if (onNavigate) {
      onNavigate(`/books/${slugOrId}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: 0 }}>
      <div className="drawer-cart" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div
          style={{
            backgroundColor: 'var(--color-maroon-dark)',
            color: '#FFFFFF',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(223, 191, 95, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bookmark size={20} color="#DFBF5F" fill="#DFBF5F" />
            <div>
              <h2 className="text-serif" style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Study Reading List ({items.length})
              </h2>
              <span className="text-kannada" style={{ fontSize: '0.74rem', color: '#DFBF5F', display: 'block' }}>
                ನನ್ನ ಆಯ್ಕೆಯ ಗ್ರಂಥಗಳು · ಜೆಎಸ್‌ಎಸ್ ಪ್ರಕಾಶನ
              </span>
            </div>
          </div>
          <button
            type="button"
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
              justifyContent: 'center'
            }}
            aria-label="Close Reading List"
          >
            <X size={18} />
          </button>
        </div>

        {/* Subtitle Banner */}
        <div
          style={{
            backgroundColor: '#FAF7F2',
            padding: '10px 24px',
            borderBottom: '1px solid var(--color-border)',
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.4
          }}
        >
          Personal study selection of sacred Vachana editions and philosophical commentaries saved for research or subsequent order.
        </div>

        {/* Items List Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 10px', color: 'var(--color-text-muted)' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-bg-neutral)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: '1px solid var(--color-border)'
                }}
              >
                <Bookmark size={28} color="var(--color-maroon)" />
              </div>
              <h3 className="text-serif" style={{ fontSize: '1.2rem', color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
                Your Study List is Empty
              </h3>
              <p style={{ fontSize: '0.86rem', maxWidth: '300px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                Bookmark canonical works and palm-leaf editions while browsing to review or order them later.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate('/books');
                }}
                className="btn btn-primary btn-sm"
              >
                <span>Browse Catalogue (49 Titles)</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleBookClick(item.slug || item.id)}
                    style={{
                      width: '68px',
                      height: '92px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: '1px solid var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    <img
                      src={item.webpImage || item.cover_image || '/patanjali-yoga-sutras/cover.webp'}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info + Actions */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-maroon)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                      {item.category}
                    </span>

                    <h4
                      onClick={() => handleBookClick(item.slug || item.id)}
                      className="text-serif"
                      style={{
                        fontSize: '0.94rem',
                        fontWeight: 700,
                        color: 'var(--color-text-charcoal)',
                        margin: '0 0 2px 0',
                        cursor: 'pointer',
                        lineHeight: 1.3
                      }}
                    >
                      {item.title}
                    </h4>

                    {item.titleKannada && (
                      <span className="text-kannada" style={{ fontSize: '0.8rem', color: 'var(--color-maroon-dark)', display: 'block', marginBottom: '4px' }}>
                        {item.titleKannada}
                      </span>
                    )}

                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                      {item.author} · {item.binding || 'Paperback'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-maroon)' }}>
                        ₹{item.price}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleMoveToCart(item)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '5px 12px', fontSize: '0.78rem', gap: '5px' }}
                        >
                          <ShoppingBag size={12} />
                          <span>Move to Cart</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-subtle)',
                            cursor: 'pointer',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 'var(--radius-xs)'
                          }}
                          title="Remove from Study List"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '18px 24px',
              backgroundColor: '#FAF7F2',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <button
              type="button"
              onClick={handleMoveAllToCart}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', gap: '8px' }}
            >
              <ShoppingBag size={16} />
              <span>Move All {items.length} Books to Cart</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Continue Exploring Catalogue</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
