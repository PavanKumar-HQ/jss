import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus, ShieldCheck, Truck, BookOpen, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function CartPage({ cart = [], onUpdateQuantity, onRemoveItem, onNavigate }) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [headerRef] = useScrollReveal();
  const [contentRef] = useScrollReveal();

  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Free shipping threshold ₹500
  const freeShippingThreshold = 500;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 40;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Discount calculation
  let discountAmount = 0;
  if (appliedDiscount) {
    discountAmount = Math.round(subtotal * appliedDiscount.percentage);
  }

  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'SUTTUR10') {
      setAppliedDiscount({ code: 'SUTTUR10', percentage: 0.1, label: '10% Math Patron Concession' });
      setCouponError('');
    } else if (clean === 'JSSLIB') {
      setAppliedDiscount({ code: 'JSSLIB', percentage: 0.15, label: '15% Educational & Library Concession' });
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try SUTTUR10 or JSSLIB');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '75vh', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '48px 32px',
              boxShadow: '0 4px 20px rgba(94, 22, 36, 0.04)'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'var(--color-accent-maroon)',
                border: '1px solid rgba(94, 22, 36, 0.15)'
              }}
            >
              <ShoppingBag size={32} />
            </div>

            <h1 className="text-serif-display" style={{ fontSize: '1.75rem', color: 'var(--color-accent-maroon)', marginBottom: '12px', fontWeight: 700 }}>
              Your Book Cart is Empty
            </h1>
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
              You haven't selected any publications yet. Explore our extensive collection of 12th-century Vachana literature, philosophy treaties, and institutional monographs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('books')}
                className="btn btn-primary"
                style={{ justifyContent: 'center', gap: '8px', padding: '12px 20px' }}
              >
                <BookOpen size={16} />
                <span>Explore Books Catalogue (49 Titles)</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('categories')}
                className="btn btn-outline"
                style={{ justifyContent: 'center', padding: '10px 20px' }}
              >
                Browse Subject Series
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', paddingBottom: '70px' }}>
      {/* Header */}
      <header
        ref={headerRef}
        className="reveal-on-scroll"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '38px 0 30px',
          marginBottom: '36px'
        }}
      >
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '12px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              style={{ cursor: 'pointer', color: 'var(--color-accent-maroon)', fontWeight: 600 }}
            >
              Home
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span
              onClick={() => onNavigate && onNavigate('books')}
              style={{ cursor: 'pointer', color: 'var(--color-accent-maroon)', fontWeight: 600 }}
            >
              Books
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Shopping Cart</span>
          </nav>

          <h1
            className="text-serif-display"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', color: 'var(--color-accent-maroon)', marginBottom: '6px', fontWeight: 700 }}
          >
            Shopping Cart ({itemsCount} {itemsCount === 1 ? 'Title' : 'Titles'})
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
            Review your selected publications before advancing to postal delivery and dispatch options.
          </p>
        </div>
      </header>

      <div className="container">
        {/* Free Shipping Progress Notification */}
        <div
          style={{
            backgroundColor: subtotal >= freeShippingThreshold ? 'rgba(46, 125, 50, 0.08)' : 'var(--color-bg-cream)',
            border: `1.5px solid ${subtotal >= freeShippingThreshold ? 'rgba(46, 125, 50, 0.25)' : 'var(--color-accent-gold)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color={subtotal >= freeShippingThreshold ? '#2E7D32' : 'var(--color-accent-maroon)'} />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: subtotal >= freeShippingThreshold ? '#2E7D32' : 'var(--color-accent-maroon)' }}>
                {subtotal >= freeShippingThreshold
                  ? '✓ Unlocked FREE India Post Registered Parcel Dispatch across India!'
                  : `Add ₹${amountNeededForFreeShipping} more to unlock FREE Postal Dispatch across India!`}
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              ₹{subtotal} / ₹{freeShippingThreshold}
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${shippingProgressPct}%`,
                height: '100%',
                backgroundColor: subtotal >= freeShippingThreshold ? '#2E7D32' : 'var(--color-accent-gold)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        <div ref={contentRef} className="reveal-on-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Column: Cart Items Table / Cards */}
          <div style={{ flex: '1 1 65%' }}>
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  backgroundColor: 'var(--color-bg-cream)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-accent-maroon)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Selected Titles & Formats
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('books')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                >
                  + Add More Titles
                </button>
              </div>

              <div style={{ padding: '0 20px' }}>
                {cart.map((item, index) => {
                  const coverSrc = item.cover_image || `/${item.slug || 'shivapada-ratnakosha'}/cover.jpg`;
                  return (
                    <div
                      key={`${item.id}-${item.format || 'Paperback'}`}
                      style={{
                        display: 'flex',
                        gap: '18px',
                        padding: '20px 0',
                        borderBottom: index < cart.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}
                    >
                      {/* Thumbnail */}
                      <img
                        src={coverSrc}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="70" height="100" viewBox="0 0 70 100"><rect width="100%" height="100%" fill="%235E1624"/><text x="50%" y="50%" fill="%23FAF7F2" font-size="16" text-anchor="middle" dominant-baseline="middle">JSS</text></svg>';
                        }}
                        style={{
                          width: '58px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-xs)',
                          boxShadow: '0 3px 6px rgba(0,0,0,0.12)',
                          flexShrink: 0
                        }}
                      />

                      {/* Info */}
                      <div style={{ flex: '1 1 200px' }}>
                        <h3 className="text-serif" style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                          {item.title}
                        </h3>
                        {item.titleKannada && (
                          <span className="text-kannada" style={{ fontSize: '0.84rem', color: 'var(--color-accent-saffron)', display: 'block', marginBottom: '2px' }}>
                            {item.titleKannada}
                          </span>
                        )}
                        {item.author && (
                          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                            By {item.author}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--color-bg-primary)',
                              border: '1px solid var(--color-border-subtle)',
                              color: 'var(--color-text-secondary)',
                              fontWeight: 600
                            }}
                          >
                            {item.format || 'Standard Edition'}
                          </span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                            ₹{item.price} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.format, Math.max(1, item.quantity - 1))}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-subtle)',
                            backgroundColor: 'var(--color-bg-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-primary)'
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.94rem', fontWeight: 700, minWidth: '26px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.format, item.quantity + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-subtle)',
                            backgroundColor: 'var(--color-bg-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-primary)'
                          }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Total & Remove */}
                      <div style={{ textAlign: 'right', minWidth: '85px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent-maroon)', display: 'block' }}>
                          ₹{item.price * item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem && onRemoveItem(item.id, item.format)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px',
                            padding: 0
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#B84E1A')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Institutional note */}
            <div
              style={{
                marginTop: '20px',
                padding: '18px 22px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-cream)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-accent-maroon)', display: 'block' }}>
                  Ordering for an Institution or Library?
                </span>
                <span style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                  Schools, PU colleges, and spiritual maths receive formal proforma invoicing and special institutional concessions.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('bulk-orders')}
                className="btn btn-outline"
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                Institutional Procurement Desk →
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div style={{ flex: '1 1 35%' }}>
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                position: 'sticky',
                top: '90px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
              }}
            >
              <h2 className="text-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent-maroon)', marginBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '10px' }}>
                Order Summary
              </h2>

              {/* Concession Coupon Input */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Institutional Concession / Coupon Code
                </label>
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Try SUTTUR10 or JSSLIB"
                    className="form-input"
                    style={{ fontSize: '0.84rem', padding: '6px 10px', textTransform: 'uppercase' }}
                  />
                  <button type="submit" className="btn btn-outline btn-sm" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    Apply
                  </button>
                </form>

                {couponError && (
                  <span style={{ fontSize: '0.76rem', color: '#B84E1A', display: 'block', marginTop: '4px' }}>
                    {couponError}
                  </span>
                )}

                {appliedDiscount && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(46, 125, 50, 0.08)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(46, 125, 50, 0.2)' }}>
                    <span style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 600 }}>
                      ✓ {appliedDiscount.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedDiscount(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.74rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Items Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>₹{subtotal}</span>
                </div>

                {appliedDiscount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}>
                    <span>Concession Discount</span>
                    <span style={{ fontWeight: 600 }}>-₹{discountAmount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>India Post Registered Book Post</span>
                  <span>{shipping === 0 ? <strong style={{ color: '#2E7D32' }}>FREE (Orders &gt; ₹500)</strong> : `₹${shipping}`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Goods & Services Tax (GST)</span>
                  <span style={{ color: '#2E7D32', fontWeight: 600 }}>0% (HSN 4901 Exempt)</span>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Total Payable</span>
                  <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-accent-maroon)' }}>₹{total}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('checkout')}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}
              >
                <span>Proceed to Postal Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  <Truck size={15} color="var(--color-accent-maroon)" />
                  <span>Pan-India Speed Post & Registered Parcel Dispatch</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  <ShieldCheck size={15} color="var(--color-accent-maroon)" />
                  <span>Official consignment direct from Suttur Math, Mysuru</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
