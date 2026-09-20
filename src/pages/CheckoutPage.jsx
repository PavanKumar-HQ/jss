import React, { useState } from 'react';
import { Truck, CheckCircle2, ShieldCheck, MapPin, Phone, Mail, ArrowLeft, ArrowRight, Building, PackageCheck } from 'lucide-react';

export default function CheckoutPage({ cart = [], onClearCart, onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    streetAddress: '',
    landmark: '',
    city: '',
    district: '',
    state: 'Karnataka',
    pincode: '',
    dispatchMethod: 'india-post-registered',
    paymentPreference: 'vpp',
    specialInstructions: ''
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [placedOrderData, setPlacedOrderData] = useState(null);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = formData.dispatchMethod === 'counter-pickup' ? 0 : (subtotal >= 500 || subtotal === 0 ? 0 : 40);
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const generatedOrderRef = `JSS-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const consignmentNo = `EK${Math.floor(10000000 + Math.random() * 90000000)}IN`;
    
    const newOrder = {
      orderReference: generatedOrderRef,
      consignmentNo: consignmentNo,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      streetAddress: formData.streetAddress,
      city: formData.city,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode,
      dispatchMethod: formData.dispatchMethod,
      paymentPreference: formData.paymentPreference,
      items: [...cart],
      subtotal: subtotal,
      shipping: shipping,
      total: total,
      status: 'Order Booked at JSS Publications',
      statusStep: 2
    };

    try {
      const existing = localStorage.getItem('jss_orders');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newOrder);
      localStorage.setItem('jss_orders', JSON.stringify(list));
    } catch (err) {
      console.warn('Could not persist order:', err);
    }

    setPlacedOrderData(newOrder);
    setOrderReference(generatedOrderRef);
    setIsCompleted(true);
    if (onClearCart) {
      onClearCart();
    }
  };

  if (isCompleted) {
    return (
      <div className="checkout-success-page animate-fade-in" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', padding: '50px 0 70px' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '40px 32px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                color: '#2E7D32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <PackageCheck size={36} />
            </div>

            <span
              style={{
                display: 'inline-block',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#2E7D32',
                marginBottom: '8px'
              }}
            >
              Postal Dispatch Booked
            </span>

            <h1 className="text-serif-display" style={{ fontSize: '1.8rem', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Order Placed Successfully
            </h1>

            <div
              style={{
                backgroundColor: 'var(--color-bg-cream)',
                padding: '12px 20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
                display: 'inline-block',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Order Reference Number</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-accent-maroon)', fontFamily: 'monospace' }}>
                {orderReference}
              </span>
            </div>

            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              Thank you, <strong>{formData.fullName}</strong>. Your publication order has been recorded at the Publications Division of JSS Mahavidyapeetha, Mysuru.
            </p>

            <div
              style={{
                textAlign: 'left',
                backgroundColor: 'var(--color-bg-primary)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '20px',
                marginBottom: '24px',
                fontSize: '0.86rem',
                lineHeight: 1.6
              }}
            >
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Dispatch & Delivery Information
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                <strong>Destination:</strong> {formData.streetAddress}, {formData.city}, {formData.district ? `${formData.district}, ` : ''}{formData.state} – {formData.pincode}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                <strong>Payment Mode:</strong> {formData.paymentPreference === 'vpp' ? 'Value Payable Post (V.P.P. - Pay at delivery)' : formData.paymentPreference === 'bank-transfer' ? 'Direct Bank Transfer / NEFT to JSS Mahavidyapeetha' : 'Counter Collection at JSS Book House'}
              </p>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <strong>India Post Consignment:</strong> Your tracking consignment number is <strong>{placedOrderData?.consignmentNo || 'EK748291048IN'}</strong>. Dispatches are packed in weather-proof cartons and transferred to India Post Saraswathipuram SO.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-outline"
                style={{ fontSize: '0.88rem', padding: '10px 18px' }}
              >
                Print Official Receipt
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('books')}
                className="btn btn-primary"
                style={{ fontSize: '0.88rem', padding: '10px 20px' }}
              >
                Continue Browsing
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('home')}
                className="btn btn-secondary"
                style={{ fontSize: '0.88rem', padding: '10px 18px' }}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 className="text-serif-display" style={{ fontSize: '1.5rem', color: 'var(--color-accent-maroon)', marginBottom: '14px' }}>
          No items to checkout
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          Please add books to your shopping cart before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('books')}
          className="btn btn-primary"
        >
          Explore Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page animate-fade-in" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', paddingBottom: '70px' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '36px 0 28px',
          marginBottom: '36px'
        }}
      >
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '12px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              style={{ cursor: 'pointer', color: 'var(--color-accent-maroon)' }}
            >
              Home
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span
              onClick={() => onNavigate && onNavigate('cart')}
              style={{ cursor: 'pointer', color: 'var(--color-accent-maroon)' }}
            >
              Cart
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Postal Dispatch & Checkout</span>
          </nav>

          <h1
            className="text-serif-display"
            style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.2rem)', color: 'var(--color-accent-maroon)', marginBottom: '4px' }}
          >
            Delivery & Dispatch Details
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Direct postal consignment from the Publications Division of JSS Mahavidyapeetha, Mysuru.
          </p>
        </div>
      </header>

      <div className="container">
        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
            
            {/* Left: Postal Details & Payment Preference */}
            <div style={{ flex: '1 1 65%' }}>
              
              {/* Box 1: Delivery Address */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '28px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                  <MapPin size={20} color="var(--color-accent-maroon)" />
                  <h2 className="text-serif-classical" style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    1. Postal Delivery Address
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label htmlFor="fullName" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                      Recipient Full Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g., S. N. Mahadevaswamy"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-subtle)',
                        backgroundColor: 'var(--color-bg-primary)',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                      Mobile Number (for SMS & Postman) *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., 9845012345"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-subtle)',
                        backgroundColor: 'var(--color-bg-primary)',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                    Email Address (for Dispatch Confirmation & Tracking) *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-subtle)',
                      backgroundColor: 'var(--color-bg-primary)',
                      fontSize: '0.9rem',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="streetAddress" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                    Street Address / Door No / Apartment / Institution *
                  </label>
                  <input
                    id="streetAddress"
                    name="streetAddress"
                    type="text"
                    required
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="e.g., No. 42, 3rd Main, Saraswathipuram"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-subtle)',
                      backgroundColor: 'var(--color-bg-primary)',
                      fontSize: '0.9rem',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label htmlFor="city" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                      City / Town *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g., Mysuru"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-subtle)',
                        backgroundColor: 'var(--color-bg-primary)',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="state" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                      State *
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Karnataka"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-subtle)',
                        backgroundColor: 'var(--color-bg-primary)',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="pincode" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                      PIN Code *
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="570009"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-subtle)',
                        backgroundColor: 'var(--color-bg-primary)',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Box 2: Payment & Dispatch Preference */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '28px'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                  <Truck size={20} color="var(--color-accent-maroon)" />
                  <h2 className="text-serif-classical" style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    2. Dispatch & Payment Option
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  
                  {/* Option 1: VPP */}
                  <label
                    style={{
                      display: 'flex',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${formData.paymentPreference === 'vpp' ? 'var(--color-accent-maroon)' : 'var(--color-border-subtle)'}`,
                      backgroundColor: formData.paymentPreference === 'vpp' ? 'var(--color-bg-cream)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentPreference"
                      value="vpp"
                      checked={formData.paymentPreference === 'vpp'}
                      onChange={handleChange}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block' }}>
                        Value Payable Post (V.P.P.) — Pay to India Post Carrier
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, display: 'block', marginTop: '2px' }}>
                        Traditional post office delivery. You hand cash to your neighborhood postman when the registered parcel arrives at your address.
                      </span>
                    </div>
                  </label>

                  {/* Option 2: Bank Transfer */}
                  <label
                    style={{
                      display: 'flex',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${formData.paymentPreference === 'bank-transfer' ? 'var(--color-accent-maroon)' : 'var(--color-border-subtle)'}`,
                      backgroundColor: formData.paymentPreference === 'bank-transfer' ? 'var(--color-bg-cream)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentPreference"
                      value="bank-transfer"
                      checked={formData.paymentPreference === 'bank-transfer'}
                      onChange={handleChange}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block' }}>
                        Direct Bank Transfer (NEFT / RTGS) to JSS Mahavidyapeetha
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, display: 'block', marginTop: '2px' }}>
                        Official account details will be included in the acknowledgement slip. Ideal for institutional bank transactions.
                      </span>
                    </div>
                  </label>

                  {/* Option 3: Counter Pickup */}
                  <label
                    style={{
                      display: 'flex',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${formData.paymentPreference === 'counter-pickup' ? 'var(--color-accent-maroon)' : 'var(--color-border-subtle)'}`,
                      backgroundColor: formData.paymentPreference === 'counter-pickup' ? 'var(--color-bg-cream)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentPreference"
                      value="counter-pickup"
                      checked={formData.paymentPreference === 'counter-pickup'}
                      onChange={handleChange}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block' }}>
                        Counter Collection at JSS Book House, Mysuru
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, display: 'block', marginTop: '2px' }}>
                        Pay and collect your package directly at the JSS Publications counter in Mysuru with 0 postal charges.
                      </span>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* Right: Order Summary Sidebar */}
            <div style={{ flex: '1 1 35%' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  position: 'sticky',
                  top: '90px'
                }}
              >
                <h3 className="text-serif-classical" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '14px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '10px' }}>
                  Consignment Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', fontSize: '0.84rem' }}>
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.format || 'd'}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ color: 'var(--color-text-secondary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title} ({item.quantity}x)
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                    <span>Publications Subtotal</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>₹{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                    <span>India Post Packing & Transit</span>
                    <span>{shipping === 0 ? <strong style={{ color: '#2E7D32' }}>FREE</strong> : `₹${shipping}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                    <span>Tax (GST on Printed Books)</span>
                    <span style={{ color: '#2E7D32', fontWeight: 600 }}>0% Exempt</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Grand Total</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-accent-maroon)' }}>₹{total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    fontSize: '0.94rem',
                    fontWeight: 600,
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}
                >
                  <span>Confirm Postal Consignment</span>
                  <ArrowRight size={16} />
                </button>

                <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                  By confirming, you authorize JSS Granthamale to dispatch this consignment to your specified postal destination.
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
