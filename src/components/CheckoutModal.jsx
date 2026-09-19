import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Truck, ArrowLeft } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderSuccess }) {
  const [step, setStep] = useState('address'); // address | payment | success
  const [paymentMode, setPaymentMode] = useState('upi');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mysuru',
    state: 'Karnataka',
    pincode: ''
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 500 ? 0 : 40;
  const totalAmount = subtotal + shippingFee;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setStep('success');
    setTimeout(() => {
      onOrderSuccess();
    }, 4000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: 0 }}>
        {/* Header Bar */}
        <div style={{ backgroundColor: '#5E1624', color: '#FFF', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#D97706" />
            <h2 className="text-serif" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {step === 'success' ? 'Order Confirmed!' : 'Secure Express Checkout'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }} aria-label="Close checkout">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px', backgroundColor: '#FBF9F5' }}>
          {step === 'address' && (
            <form onSubmit={() => setStep('payment')}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#5E1624', marginBottom: '16px' }}>
                1. Delivery Shipping Address
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Mahesh Kumar"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit Mobile Number"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Email Address (For Invoice)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Street Address *</label>
                <textarea
                  required
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Door No, Street Name, Landmark"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D6D3D1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D6D3D1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Pincode *</label>
                  <input type="text" required maxLength={6} name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="570004" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D6D3D1' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Continue to Payment (₹{totalAmount.toLocaleString('en-IN')})
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePlaceOrder}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#5E1624' }}>
                  2. Select Payment Gateway Mode
                </h3>
                <button type="button" onClick={() => setStep('address')} style={{ background: 'none', border: 'none', color: '#C85A17', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Back to Address
                </button>
              </div>

              {/* Payment Methods */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: paymentMode === 'upi' ? '2px solid #C85A17' : '1px solid #D6D3D1', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#FFF' }}>
                  <input type="radio" name="payment" checked={paymentMode === 'upi'} onChange={() => setPaymentMode('upi')} />
                  <Smartphone size={20} color="#C85A17" />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}>UPI Instant Payment (Razorpay)</span>
                    <span style={{ fontSize: '0.78rem', color: '#57534E' }}>GPay, PhonePe, Paytm, BHIM (Zero transaction surcharge)</span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: paymentMode === 'card' ? '2px solid #C85A17' : '1px solid #D6D3D1', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#FFF' }}>
                  <input type="radio" name="payment" checked={paymentMode === 'card'} onChange={() => setPaymentMode('card')} />
                  <CreditCard size={20} color="#5E1624" />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}>Credit / Debit Cards & NetBanking</span>
                    <span style={{ fontSize: '0.78rem', color: '#57534E' }}>All major Indian banks & RuPay, Visa, Mastercard</span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: paymentMode === 'cod' ? '2px solid #C85A17' : '1px solid #D6D3D1', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#FFF' }}>
                  <input type="radio" name="payment" checked={paymentMode === 'cod'} onChange={() => setPaymentMode('cod')} />
                  <Truck size={20} color="#D97706" />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}>Cash on Delivery (COD)</span>
                    <span style={{ fontSize: '0.78rem', color: '#57534E' }}>Pay in cash upon physical delivery by India Post courier</span>
                  </div>
                </label>
              </div>

              {/* Order Summary Recap */}
              <div style={{ backgroundColor: '#F3EFE6', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Postal Dispatch Fee:</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #D6D3D1', paddingTop: '6px', fontWeight: 700, fontSize: '0.95rem', color: '#5E1624' }}>
                  <span>Total Payable:</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
                Complete Order (₹{totalAmount.toLocaleString('en-IN')})
              </button>
            </form>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <CheckCircle2 size={64} color="#166534" style={{ marginBottom: '16px' }} />
              <h3 className="text-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#5E1624', marginBottom: '8px' }}>
                Thank You for Your Order!
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#1C1917', marginBottom: '16px' }}>
                Order Number: <strong>#JSS-2026-8941</strong>
              </p>
              <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px' }}>
                Your order is being dispatched from JSS Book House, Mysuru. A postal tracking link and tax invoice copy have been generated for your record.
              </p>
              <button onClick={onClose} className="btn btn-primary">
                Return to Catalogue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
