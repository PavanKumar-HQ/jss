import React from 'react';
import { Scale, FileText, ArrowLeft, CheckCircle2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function TermsPage({ onNavigate }) {
  return (
    <div className="terms-page-wrapper" style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', paddingBottom: '70px' }}>
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
            <Scale size={18} color="var(--color-maroon)" />
            <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-maroon)' }}>
              Terms of Sale, Circulation & Dispatch
            </span>
          </div>

          <h1 className="text-serif" style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '8px', lineHeight: 1.2 }}>
            TERMS & CONDITIONS
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
              1. Non-Profit Subsidized Pricing
            </h2>
            <p>
              All publications listed in the Jagadguru Sri Shivarathreeshwara Granthamale catalogue are subsidized non-profit editions published under the auspices of JSS Mahavidyapeetha. Prices are printed on each physical copy and are set to recover only basic paper, press printing, and binding costs. No commercial markups are applied.
            </p>
          </div>

          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '28px' }}>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              2. Statutory GST Exemption (HSN 4901)
            </h2>
            <p>
              In accordance with Central Goods and Services Tax (CGST) and State GST (SGST) statutory notifications issued by the Ministry of Finance, Government of India, all printed books, brochures, leaflets, and sacred scriptures classified under HSN Chapter 4901 are <strong>completely exempt from GST (0% GST)</strong>. No GST surcharge is added at checkout.
            </p>
          </div>

          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '28px' }}>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              3. Dispatch & India Post Delivery Policy
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Orders placed on working days are packed at the JSS Book House dispatch counter in Mysuru within 24 to 48 hours.</li>
              <li>Consignments are handed directly to India Post (Speed Post / Registered Book Parcel). Orders exceeding ₹500 qualify for 100% Free Shipping anywhere within India.</li>
              <li>Standard delivery estimates: Karnataka destinations 2–4 working days; Rest of India 4–7 working days depending on postal circle logistics.</li>
            </ul>
          </div>

          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '28px' }}>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              4. Replacement for Transit Damage or Defective Copies
            </h2>
            <p>
              While all parcels are securely sealed with heavy-duty packaging, in the rare event of transit damage, binder defects, or missing folios, readers should report the defect within <strong>7 calendar days</strong> of parcel receipt. Upon photographic review by our dispatch desk, an immediate complimentary replacement copy will be dispatched at zero additional charge.
            </p>
          </div>

          <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '28px' }}>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              5. Intellectual Property & Manuscript Rights
            </h2>
            <p>
              All critical editions, commentaries, word-by-word Sanskrit translations, encyclopedic lexicons, and introductory scholarly essays published under the Jagadguru Sri Shivarathreeshwara Granthamale imprint are protected under Indian and international copyright law. Reproduction in whole or part without written permission from JSS Mahavidyapeetha is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
              6. Institutional Desk & Grievance Redressal
            </h2>
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
