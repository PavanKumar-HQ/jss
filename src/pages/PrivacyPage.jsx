import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPage({ onNavigate }) {
  return (
    <div className="privacy-page-wrapper" style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', paddingBottom: '70px' }}>
      {/* Header */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--color-border)', padding: '44px 0 34px' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--color-maroon)',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              marginBottom: '16px',
              padding: 0
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Bookstore</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={18} color="var(--color-maroon)" />
            <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-maroon)' }}>
              Institutional Governance & Data Protection
            </span>
          </div>

          <h1 className="text-serif" style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '8px', lineHeight: 1.2 }}>
            PRIVACY POLICY
          </h1>

          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Last revised: January 2026 · Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ maxWidth: '860px', paddingTop: '36px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '40px 36px',
            boxShadow: '0 2px 10px rgba(94, 22, 36, 0.04)',
            color: '#3C3530',
            lineHeight: 1.75,
            fontSize: '0.94rem'
          }}
        >
          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '28px' }}>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              1. Non-Profit Institutional Commitment
            </h2>
            <p>
              Jagadguru Sri Shivarathreeshwara Granthamale (JSS Publications) is the dedicated research and publishing wing of JSS Mahavidyapeetha, Mysuru. Operating as an educational and charitable cultural publisher, we respect your fundamental right to privacy. We do not engage in commercial data aggregation, ad retargeting, or the sale of reader records to third-party brokers.
            </p>
          </div>

          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '28px' }}>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              2. Information Collected Strictly for Order Execution
            </h2>
            <p style={{ marginBottom: '12px' }}>
              When placing an order or requesting an institutional quotation, we collect only the necessary details required to deliver printed publications:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Recipient Name & Contact Details:</strong> Full name, verified mobile number, and email address for order notifications and consignment booking.</li>
              <li><strong>Physical Postal Address:</strong> Complete delivery address and 6-digit Indian PIN code to route registered parcel dispatch through India Post.</li>
              <li><strong>Institutional Affiliation (Optional):</strong> Name of school, university department, or mutt for issuing institutional discount certificates and tax-exempt proforma invoices.</li>
            </ul>
          </div>

          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '28px' }}>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              3. Payment Security & Zero Card Storage
            </h2>
            <p>
              All online financial transactions are processed securely through RBI-licensed payment gateways and NPCI-compliant UPI rails. JSS Publications does not store, process, or have access to your credit card numbers, debit card PINs, CVV, or bank account passwords on our servers.
            </p>
          </div>

          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '28px' }}>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              4. Dispatch Partners (India Post)
            </h2>
            <p>
              Your name, phone number, and physical postal address are shared exclusively with the Department of Posts (India Post) solely for generating physical parcel address labels, Speed Post booking slips, and SMS tracking notifications.
            </p>
          </div>

          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '28px' }}>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              5. Cookies and Local Storage
            </h2>
            <p>
              This website uses standard browser localStorage strictly for essential customer shopping functions—including maintaining your book cart, study wishlist, recently viewed publications, and language preferences. No tracking cookies or behavioral tracking pixels are loaded.
            </p>
          </div>

          <div>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              6. Data Inquiries & Privacy Contact
            </h2>
            <p style={{ marginBottom: '14px' }}>
              For queries regarding personal records or to request removal of your contact details from our bookstore logs, contact the JSS Book House desk:
            </p>
            <div style={{ backgroundColor: 'var(--color-bg-neutral)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <MapPin size={15} color="var(--color-maroon)" />
                <span>JSS Book House, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Phone size={15} color="var(--color-maroon)" />
                <span>0821-2548212 (Mon–Sat, 09:30 AM – 06:00 PM)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={15} color="var(--color-maroon)" />
                <a href="mailto:publications@jssonline.org" style={{ color: 'var(--color-maroon)', fontWeight: 600 }}>publications@jssonline.org</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
