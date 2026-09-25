import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Truck, ShieldCheck, BookOpen } from 'lucide-react';

export default function CartPage({ cart = [], onUpdateQuantity, onRemoveItem, onNavigate }) {
  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Free shipping threshold ₹500
  const freeShippingThreshold = 500;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 40;

  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div style={{ padding: '60px 0', minHeight: '65vh' }}>
        <div className="container" style={{ maxWidth: '540px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '40px 24px' }}>
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
              Explore publications from Jagadguru Sri Shivarathreeshwara Granthamale, including classical Vachana poetry, philosophy, and spiritual treatises.
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

        <h1 className="text-serif" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '20px' }}>
          Your Cart ({itemsCount} {itemsCount === 1 ? 'publication' : 'publications'})
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Left Column: Cart Items Table */}
          <div>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Edition</th>
                    <th>Quantity</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={`${item.id}-${item.format}`}>
                      {/* Cover & Title */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '46px',
                              height: '62px',
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
                            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                              {item.author}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Edition */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-body)' }}>
                          {item.format || 'Paperback'}
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
                          <span style={{ padding: '0 8px', fontSize: '0.86rem', fontWeight: 600 }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.format, item.quantity + 1)}
                            style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', fontWeight: 700 }}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Total Line Price */}
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* India Post Speed Post Dispatch Notice */}
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <Truck size={15} color="var(--color-maroon)" />
              <span>
                {subtotal >= freeShippingThreshold
                  ? 'Your order qualifies for Free India Post Speed Post Delivery across India.'
                  : `Add ₹${freeShippingThreshold - subtotal} more for Free Postal Delivery (Standard delivery ₹40).`}
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
                  <span style={{ color: 'var(--color-text-muted)' }}>Subtotal ({itemsCount} items)</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Delivery (India Post)</span>
                  <span>{shipping === 0 ? <strong style={{ color: 'var(--color-green)' }}>FREE</strong> : `₹${shipping}`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>GST</span>
                  <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>₹0 (0% Exempt)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                  <span>Total Payable</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
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
                  <span>Tracking consignment number issued on booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
