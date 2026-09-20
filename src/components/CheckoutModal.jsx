import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Truck, ArrowLeft, ArrowRight, QrCode } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderSuccess }) {
  const [step, setStep] = useState('address'); // 'address' | 'payment' | 'success'
  const [paymentMode, setPaymentMode] = useState('upi');
  const [deliveryMethod, setDeliveryMethod] = useState('speedpost');
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
  const orderId = 'JSS-ORD-' + Math.floor(100000 + Math.random() * 900000);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setStep('success');
    setTimeout(() => {
      onOrderSuccess();
    }, 4500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-folio" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', overflow: 'hidden' }}>
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#2E060D',
            color: '#FFFFFF',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(197, 155, 39, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#E5C368" />
            <div>
              <span style={{ fontSize: '0.74rem', color: '#D6CCA8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Official Publications Postal Checkout
              </span>
              <h2 className="text-serif-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {step === 'success' ? 'Order Confirmed!' : 'Secure Express Dispatch'}
              </h2>
            </div>
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
            aria-label="Close checkout"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 'clamp(16px, 4vw, 26px)', backgroundColor: '#FAF7F2' }}>
          {step === 'address' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('payment');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 className="text-serif-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#4A0E17' }}>
                  1. Dispatch Address & Contact Details
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#79706A' }}>Step 1 of 2</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Basavaraj Patil"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>
                    Mobile Number (For Speed Post SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>
                  Email Address (For Tax Receipt)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>
                  Complete Postal Address *
                </label>
                <textarea
                  required
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House/Flat number, Street name, Landmark..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>State *</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>6-Digit Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="570004"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ gap: '8px', padding: '11px 24px' }}>
                  <span>Proceed to Payment</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePlaceOrder}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  style={{ background: 'none', border: 'none', color: '#B84E1A', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600 }}
                >
                  <ArrowLeft size={14} />
                  <span>Edit Address</span>
                </button>
                <span style={{ fontSize: '0.78rem', color: '#79706A' }}>Step 2 of 2</span>
              </div>

              {/* Order Quick Summary Pill */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', color: '#524944' }}>Order Total ({cartItems.length} publications):</span>
                  <strong style={{ fontSize: '1.2rem', color: '#4A0E17', display: 'block', fontFamily: 'var(--font-serif-display)' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                <span className="badge badge-green">Speed Post Dispatched from Mysuru</span>
              </div>

              {/* Payment Methods */}
              <h4 className="text-serif-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1615', marginBottom: '10px' }}>
                Select Payment Method:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMode === 'upi' ? '2px solid #C59B27' : '1px solid var(--color-border)',
                    backgroundColor: paymentMode === 'upi' ? '#FFFBF0' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value="upi"
                      checked={paymentMode === 'upi'}
                      onChange={() => setPaymentMode('upi')}
                      style={{ accentColor: '#4A0E17' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1A1615' }}>
                        Instant UPI & QR Code (GPay / PhonePe / Paytm / BHIM)
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#79706A' }}>Scan and pay directly via any bank UPI app</span>
                    </div>
                  </div>
                  <QrCode size={22} color="#C59B27" />
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMode === 'cards' ? '2px solid #C59B27' : '1px solid var(--color-border)',
                    backgroundColor: paymentMode === 'cards' ? '#FFFBF0' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cards"
                      checked={paymentMode === 'cards'}
                      onChange={() => setPaymentMode('cards')}
                      style={{ accentColor: '#4A0E17' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1A1615' }}>
                        Debit / Credit Cards & Net Banking
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#79706A' }}>All major Indian banks supported (SBI, HDFC, Canara)</span>
                    </div>
                  </div>
                  <CreditCard size={20} color="#79706A" />
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMode === 'cod' ? '2px solid #C59B27' : '1px solid var(--color-border)',
                    backgroundColor: paymentMode === 'cod' ? '#FFFBF0' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cod"
                      checked={paymentMode === 'cod'}
                      onChange={() => setPaymentMode('cod')}
                      style={{ accentColor: '#4A0E17' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1A1615' }}>
                        Cash on Postal Delivery (COD)
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#79706A' }}>Pay postman upon receipt of book parcel</span>
                    </div>
                  </div>
                  <Truck size={20} color="#79706A" />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: '#1B5E20', fontWeight: 600 }}>
                  ✓ 100% Secure Transaction Guaranteed
                </span>

                <button type="submit" className="btn btn-primary" style={{ padding: '11px 26px', gap: '8px' }}>
                  <ShieldCheck size={16} color="#E5C368" />
                  <span>Authorize & Place Order (₹{totalAmount})</span>
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: '#E8F5E9',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: '2px solid #C8E6C9'
                }}
              >
                <CheckCircle2 size={38} color="#2E7D32" />
              </div>

              <h3 className="text-serif-display" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1A1615', marginBottom: '8px' }}>
                Namaste! Your Order Is Confirmed
              </h3>

              <p style={{ fontSize: '0.92rem', color: '#524944', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                Thank you for patronizing Jagadguru Sri Shivarathreeshwara Granthamale. Your sacred publications are being prepared for dispatch from our Mysuru distribution centre.
              </p>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  maxWidth: '380px',
                  margin: '0 auto 24px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.84rem' }}>
                  <span style={{ color: '#79706A' }}>Order Reference:</span>
                  <strong style={{ color: '#4A0E17' }}>{orderId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.84rem' }}>
                  <span style={{ color: '#79706A' }}>Recipient:</span>
                  <strong>{formData.fullName || 'Patron'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: '#79706A' }}>Dispatch Carrier:</span>
                  <span style={{ color: '#1B5E20', fontWeight: 600 }}>India Post Speed Post</span>
                </div>
              </div>

              <span style={{ fontSize: '0.78rem', color: '#79706A' }}>
                A confirmation SMS will be sent to <strong>{formData.phone || 'your mobile number'}</strong> once handed over to Mysuru Post Office.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
