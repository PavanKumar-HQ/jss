import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

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
        message: `Pincode ${pincode} is serviceable! Express Postal Dispatch from Mysuru within 2-4 business days.`
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
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{ backgroundColor: '#5E1624', color: '#FFF', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#D97706" />
            <h2 className="text-serif" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Shopping Bag ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '4px' }}
            aria-label="Close Shopping Bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ backgroundColor: '#F3EFE6', padding: '12px 20px', borderBottom: '1px solid #E7E5E4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#1C1917', marginBottom: '6px' }}>
            <Truck size={15} color="#C85A17" />
            <span>
              {amountNeededForFreeShipping === 0
                ? 'Congratulations! You qualify for Free Pan-India Delivery!'
                : `Add ₹${amountNeededForFreeShipping} more to get Free Delivery!`}
            </span>
          </div>
          <div style={{ backgroundColor: '#D6D3D1', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                backgroundColor: '#C85A17',
                height: '100%',
                width: `${progressPercent}%`,
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Items List Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#57534E' }}>
              <ShoppingBag size={48} color="#D6D3D1" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>Your shopping bag is empty</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Browse our catalogue to add authentic publications.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedVariant || 'reg'}`}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #E7E5E4',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '56px', height: '76px', objectFit: 'contain', backgroundColor: '#F3EFE6', borderRadius: '4px' }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 className="text-serif" style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.2 }}>
                      {item.title}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: '#57534E', display: 'block', marginTop: '2px' }}>
                      {item.selectedVariant === 'special' ? "Collector's Special Edition" : 'Regular Edition'}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#5E1624', display: 'block', marginTop: '4px' }}>
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D6D3D1', borderRadius: '4px' }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Delivery Pincode Checker Widget */}
              <div style={{ backgroundColor: '#FBF9F5', border: '1px solid #E7E5E4', borderRadius: '8px', padding: '14px', marginTop: '12px' }}>
                <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1C1917', marginBottom: '8px' }}>
                  Check Pincode Serviceability:
                </span>
                <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid #D6D3D1' }}
                  />
                  <button type="submit" className="btn btn-outline btn-sm">Check</button>
                </form>
                {pincodeStatus && (
                  <p style={{ fontSize: '0.78rem', marginTop: '6px', color: pincodeStatus.valid ? '#166534' : '#DC2626', fontWeight: 500 }}>
                    {pincodeStatus.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Button */}
        {cartItems.length > 0 && (
          <div style={{ padding: '16px 20px', backgroundColor: '#FBF9F5', borderTop: '1px solid #E7E5E4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 700, color: '#5E1624' }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem', color: '#166534' }}>
              <span>GST (0% Exempt for Books):</span>
              <span>₹0.00</span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', gap: '8px' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
