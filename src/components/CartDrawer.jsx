import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) {
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 500;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        valid: true,
        message: `Pincode ${pincode} is serviceable! Dispatched via India Post Speed Post from Mysuru within 2-4 business days.`
      });
    } else {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian Postal Pincode.'
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: 0 }}>
      <div className="drawer-cart" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div
          style={{
            backgroundColor: '#2E060D',
            color: '#FFFFFF',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(197, 155, 39, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#E5C368" />
            <h2 className="text-serif-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Shopping Bag ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%'
            }}
            aria-label="Close Shopping Bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Milestone Progress */}
        <div
          style={{
            backgroundColor: amountNeededForFreeShipping === 0 ? '#E8F5E9' : '#FAF7F2',
            padding: '14px 24px',
            borderBottom: '1px solid var(--color-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: amountNeededForFreeShipping === 0 ? '#1B5E20' : '#1A1615', marginBottom: '8px', fontWeight: 600 }}>
            <Truck size={16} color={amountNeededForFreeShipping === 0 ? '#1B5E20' : '#B84E1A'} />
            <span>
              {amountNeededForFreeShipping === 0
                ? 'Congratulations! Your order qualifies for Free Pan-India Postal Delivery!'
                : `Add ₹${amountNeededForFreeShipping} more to unlock Free Postal Delivery!`}
            </span>
          </div>
          <div style={{ backgroundColor: '#E8E0D2', height: '6px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                backgroundColor: amountNeededForFreeShipping === 0 ? '#2E7D32' : '#B84E1A',
                height: '100%',
                width: `${progressPercent}%`,
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </div>
        </div>

        {/* Items List Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 10px', color: '#79706A' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3ECE0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShoppingBag size={32} color="#B84E1A" />
              </div>
              <p className="text-serif-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A1615', marginBottom: '6px' }}>
                Your shopping bag is empty
              </p>
              <p style={{ fontSize: '0.88rem', maxWidth: '280px', margin: '0 auto 20px' }}>
                Explore authentic 12th-century Vachana poetry and philosophy from the catalog.
              </p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                Browse Publications
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedVariant || 'reg'}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={item.imageUrl || `/${item.slug}/cover.jpg`}
                    alt={item.title}
                    style={{
                      width: '56px',
                      height: '78px',
                      objectFit: 'contain',
                      backgroundColor: '#FAF7F2',
                      borderRadius: '4px',
                      boxShadow: 'var(--shadow-sm)',
                      padding: '4px'
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 className="text-serif-display" style={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.25, color: '#1A1615', marginBottom: '2px' }}>
                      {item.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <span className="badge badge-crimson" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                        {item.selectedVariant === 'special' ? 'Deluxe Hardbound' : 'Standard Edition'}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4A0E17' }}>
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: '#FAF7F2' }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, padding: '0 6px' }}>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', padding: '4px' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1A1615' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pincode & Checkout Summary Footer */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: '#FAF7F2',
              borderTop: '1px solid var(--color-border)',
              boxShadow: '0 -4px 16px rgba(0,0,0,0.05)'
            }}
          >
            {/* Postal Delivery Serviceability Check */}
            <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-strong)',
                  fontSize: '0.84rem'
                }}
              />
              <button type="submit" className="btn btn-outline btn-sm">
                Check Speed Post
              </button>
            </form>

            {pincodeStatus && (
              <p style={{ fontSize: '0.78rem', color: pincodeStatus.valid ? '#1B5E20' : '#B91C1C', marginBottom: '14px', fontWeight: 500 }}>
                {pincodeStatus.message}
              </p>
            )}

            {/* Subtotal Calculation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', color: '#524944' }}>
              <span>Items Subtotal:</span>
              <strong style={{ color: '#1A1615' }}>₹{subtotal.toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.88rem', color: '#524944' }}>
              <span>Pan-India Postal Shipping:</span>
              <strong style={{ color: subtotal >= freeShippingThreshold ? '#1B5E20' : '#1A1615' }}>
                {subtotal >= freeShippingThreshold ? 'FREE' : '₹40'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '10px', borderTop: '1px solid var(--color-border)', marginBottom: '18px' }}>
              <span className="text-serif-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A1615' }}>Grand Total:</span>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#4A0E17', fontFamily: 'var(--font-serif-display)' }}>
                ₹{(subtotal + (subtotal >= freeShippingThreshold ? 0 : 40)).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', gap: '8px' }}
            >
              <ShieldCheck size={18} color="#E5C368" />
              <span>Proceed to Express Checkout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
