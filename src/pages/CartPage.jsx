import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Truck, ShieldCheck, BookOpen, AlertCircle, CheckCircle2, Sparkles, Scale } from 'lucide-react';
import { cartService } from '../services/cartService.js';

export default function CartPage({ cart = [], onUpdateQuantity, onRemoveItem, onNavigate }) {
  const [reconciliationNotices, setReconciliationNotices] = useState([]);

  // Authoritative catalogue reconciliation on mount
  useEffect(() => {
    const result = cartService.reconcileCart();
    if (result.hasModifications && result.notifications.length > 0) {
      setReconciliationNotices(result.notifications);
    }
  }, []);

  // Compute authoritative financial totals from domain service
  const totals = cartService.getTotals(cart);
  const {
    itemsCount,
    subtotal,
    shippingFee,
    grandTotal,
    totalWeightGrams,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    freeShippingProgress,
    qualifiesForFreeShipping
  } = totals;

  if (cart.length === 0) {
    return (
      <div style={{ padding: '60px 0', minHeight: '65vh' }}>
        <div className="container" style={{ maxWidth: '540px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '40px 24px', boxShadow: 'var(--shadow-xs)' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-neutral)',
                color: 'var(--color-maroon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <ShoppingBag size={28} />
            </div>

            <h1 className="text-serif" style={{ fontSize: '1.6rem', color: 'var(--color-text-charcoal)', marginBottom: '8px', fontWeight: 700 }}>
              Your Book Cart is Empty
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
              Explore publications from Jagadguru Sri Shivarathreeshwara Granthamale, including classical Vachana literature, philosophy, and spiritual treatises.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('/books')}
              className="btn btn-primary"
              style={{ gap: '8px' }}
            >
              <BookOpen size={15} />
              <span>Browse 49 Publications</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 0 60px' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => onNavigate('/books')}
            className="btn btn-outline btn-sm"
            style={{ gap: '6px' }}
          >
            <ArrowLeft size={13} />
            <span>Continue Browsing Catalogue</span>
          </button>
        </div>

        {/* Reconciliation Alert Banner (if catalog prices or availability adjusted) */}
        {reconciliationNotices.length > 0 && (
          <div
            role="alert"
            style={{
              marginBottom: '20px',
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FFF8E1',
              border: '1px solid #FFE082',
              color: '#5D4037',
              fontSize: '0.86rem',
              lineHeight: 1.5
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertCircle size={18} color="#C59B27" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', color: 'var(--color-maroon)', marginBottom: '4px' }}>
                  Catalogue Synchronization Notice
                </strong>
                <ul style={{ margin: 0, paddingLeft: '18px' }}>
                  {reconciliationNotices.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setReconciliationNotices([])}
                style={{ background: 'none', border: 'none', color: '#8D6E63', cursor: 'pointer', fontSize: '0.78rem', textDecoration: 'underline' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <h1 className="text-serif" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-charcoal)', margin: 0 }}>
            Your Cart ({itemsCount} {itemsCount === 1 ? 'publication' : 'publications'})
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            <Scale size={14} color="var(--color-maroon)" />
            <span>
              Total Parcel Weight: <strong>{totalWeightGrams >= 1000 ? `${(totalWeightGrams / 1000).toFixed(2)} kg` : `${totalWeightGrams} g`}</strong>
            </span>
          </div>
        </div>

        {/* Free Shipping Progress Meter */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 18px',
            marginBottom: '22px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {qualifiesForFreeShipping ? (
                <>
                  <CheckCircle2 size={16} color="var(--color-green)" />
                  <span style={{ fontWeight: 600, color: 'var(--color-green)' }}>
                    Your order qualifies for Free India Post Speed Post Delivery across India!
                  </span>
                </>
              ) : (
                <>
                  <Truck size={16} color="var(--color-maroon)" />
                  <span style={{ color: 'var(--color-text-charcoal)' }}>
                    Add <strong>₹{amountNeededForFreeShipping}</strong> more to qualify for <strong>Free India Post Delivery</strong> (Standard delivery ₹{cartService.STANDARD_SHIPPING_FEE || 40})
                  </span>
                </>
              )}
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: qualifiesForFreeShipping ? 'var(--color-green)' : 'var(--color-maroon)' }}>
              {freeShippingProgress}%
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'var(--color-bg-neutral)',
              borderRadius: '999px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor: qualifiesForFreeShipping ? 'var(--color-green)' : 'var(--color-maroon)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        <div className="cart-layout-grid">
          {/* Left Column: Cart Items (Desktop Table + Mobile Cards) */}
          <div>
            {/* Desktop Table View */}
            <div className="cart-desktop-table" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Publication</th>
                    <th>Edition / Format</th>
                    <th>Quantity</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const maxQty = item.maxQuantity || 10;
                    const hasDiscount = item.mrp && item.mrp > item.price;
                    const discountPercent = hasDiscount ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;

                    return (
                      <tr key={`${item.id}-${item.format || 'Paperback'}`}>
                        {/* Cover & Title */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div
                              style={{
                                width: '48px',
                                height: '66px',
                                backgroundColor: 'var(--color-bg-neutral)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-xs)',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                              }}
                            >
                              <img
                                src={item.webpImage || item.cover_image || item.imageUrl || '/shivapada-ratnakosha/cover.jpg'}
                                alt={`Cover of ${item.title}`}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            </div>
                            <div>
                              <strong
                                style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-text-charcoal)', cursor: 'pointer' }}
                                onClick={() => onNavigate(`/books/${item.slug || item.id}`)}
                              >
                                {item.title}
                              </strong>
                              {item.titleKannada && (
                                <span className="text-kannada" style={{ fontSize: '0.78rem', color: 'var(--color-maroon-dark)', display: 'block' }}>
                                  {item.titleKannada}
                                </span>
                              )}
                              <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                {item.author}
                              </span>
                              {item.isbn && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>
                                  ISBN: {item.isbn}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Edition Badge & Weight */}
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: 'var(--color-bg-neutral)',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              color: 'var(--color-text-charcoal)'
                            }}
                          >
                            {item.formatLabel || `${item.format || 'Paperback'} Edition`}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                            {item.weightGrams ? `${item.weightGrams}g` : '240g'}
                          </span>
                        </td>

                        {/* Quantity Controls: [- 1 +] */}
                        <td>
                          <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border-dark)', borderRadius: 'var(--radius-xs)', backgroundColor: '#FFFFFF' }}>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.format, item.quantity - 1)}
                              style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', fontWeight: 700 }}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span style={{ padding: '0 8px', fontSize: '0.86rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.format, item.quantity + 1)}
                              disabled={item.quantity >= maxQty}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '4px 8px',
                                cursor: item.quantity >= maxQty ? 'not-allowed' : 'pointer',
                                fontWeight: 700,
                                opacity: item.quantity >= maxQty ? 0.4 : 1
                              }}
                              title={item.quantity >= maxQty ? `Maximum limit of ${maxQty} reached` : 'Increase quantity'}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          {item.quantity >= maxQty && (
                            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--color-maroon)', marginTop: '2px' }}>
                              Limit: {maxQty} max
                            </span>
                          )}
                        </td>

                        {/* Total Line Price */}
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--color-maroon)', display: 'block' }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {hasDiscount && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.72rem' }}>
                              <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                                ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                              </span>
                              <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>
                                {discountPercent}% OFF
                              </span>
                            </div>
                          )}
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                            (₹{item.price} each)
                          </span>
                        </td>

                        {/* Remove */}
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id, item.format)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer', padding: '4px' }}
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card-Based List View (Optimized for phones <= 640px) */}
            <div className="cart-mobile-cards">
              {cart.map((item) => {
                const maxQty = item.maxQuantity || 10;
                const hasDiscount = item.mrp && item.mrp > item.price;
                const discountPercent = hasDiscount ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;

                return (
                  <div key={`mob-${item.id}-${item.format || 'Paperback'}`} className="cart-mobile-card">
                    {/* Left: Thumbnail */}
                    <div
                      className="cart-mobile-card-cover"
                      onClick={() => onNavigate(`/books/${item.slug || item.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={item.webpImage || item.cover_image || item.imageUrl || '/shivapada-ratnakosha/cover.jpg'}
                        alt={`Cover of ${item.title}`}
                      />
                    </div>

                    {/* Right: Info + Stepper + Price */}
                    <div className="cart-mobile-card-content">
                      <div
                        className="cart-mobile-card-title"
                        onClick={() => onNavigate(`/books/${item.slug || item.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.title}
                      </div>
                      {item.titleKannada && (
                        <span className="cart-mobile-card-kannada text-kannada">
                          {item.titleKannada}
                        </span>
                      )}
                      <span className="cart-mobile-card-author">
                        {item.author} · {item.formatLabel || `${item.format || 'Paperback'} Edition`}
                      </span>

                      <div className="cart-mobile-card-bottom">
                        {/* Touch-Friendly Stepper */}
                        <div className="cart-mobile-stepper">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.format, item.quantity - 1)}
                            className="cart-mobile-stepper-btn"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="cart-mobile-stepper-val">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.format, item.quantity + 1)}
                            disabled={item.quantity >= maxQty}
                            className="cart-mobile-stepper-btn"
                            style={{ opacity: item.quantity >= maxQty ? 0.4 : 1 }}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Total */}
                        <div style={{ textAlign: 'right' }}>
                          <span className="cart-mobile-price">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {hasDiscount && (
                            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-green)', fontWeight: 600 }}>
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id, item.format)}
                      className="cart-mobile-remove-btn"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* India Post Speed Post Dispatch Notice */}
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <Truck size={15} color="var(--color-maroon)" />
              <span>
                {qualifiesForFreeShipping
                  ? 'Your order qualifies for Free India Post Speed Post Delivery across India.'
                  : `Add ₹${amountNeededForFreeShipping} more for Free Postal Delivery (Standard delivery ₹${shippingFee}).`}
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="cart-summary-box">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Publications Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>India Post Delivery</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: 'var(--color-green)' }}>FREE</strong> : `₹${shippingFee}`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Consignment Parcel Weight</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-charcoal)' }}>
                    {totalWeightGrams >= 1000 ? `${(totalWeightGrams / 1000).toFixed(2)} kg` : `${totalWeightGrams} g`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>GST (HSN 4901 Printed Books)</span>
                  <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>₹0 (0% Exempt)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                  <span>Total Payable</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/checkout')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.94rem', marginBottom: '14px' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <ShieldCheck size={14} color="var(--color-green)" />
                  <span>Dispatched from JSS Book House Counter, Mysuru</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Truck size={14} color="var(--color-maroon)" />
                  <span>Speed Post tracking consignment issued on booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
