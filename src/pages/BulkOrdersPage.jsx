import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, CheckCircle2, FileText, Truck, Calculator, Download, Printer, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function BulkOrdersPage({ onNavigate }) {
  useScrollReveal();

  const [formData, setFormData] = useState({
    institutionType: 'Degree / Engineering College Library',
    institutionName: '',
    officerName: '',
    designation: '',
    phone: '',
    email: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    seriesInterest: 'Sharana Samskruti Series (Complete Set)',
    estimatedCopies: '50 - 100 copies',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState('');

  // Quick institutional discount estimator
  const [estimateQty, setEstimateQty] = useState(50);
  const estimatedDiscount = estimateQty >= 100 ? 20 : estimateQty >= 50 ? 15 : 10;
  const estimatedSavings = Math.round(estimateQty * 200 * (estimatedDiscount / 100));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomRef = `JSS-ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setEnquiryRef(randomRef);
    setSubmitted(true);
  };

  return (
    <div className="bulk-orders-page animate-fade-in" style={{ backgroundColor: 'var(--color-bg-cream)', minHeight: '80vh', paddingBottom: '70px' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          padding: '40px 0 32px',
          marginBottom: '36px'
        }}
      >
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '12px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <span
              onClick={() => onNavigate && onNavigate('/home')}
              style={{ cursor: 'pointer', color: 'var(--color-maroon)' }}
            >
              Home
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-text-charcoal)', fontWeight: 600 }}>Institutional Procurement Desk</span>
          </nav>

          <div style={{ maxWidth: '840px' }}>
            <span
              className="badge badge-maroon"
              style={{ marginBottom: '10px' }}
            >
              Institutional & Library Requisition
            </span>
            <h1
              className="text-serif"
              style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)',
                color: 'var(--color-maroon)',
                lineHeight: 1.22,
                marginBottom: '10px'
              }}
            >
              Institutional Bulk Procurement & Indents
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
              Special terms, formal proforma invoicing, and concessional institutional pricing for universities, schools, public libraries, research centres, and spiritual study sabhas across India.
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          {/* Left: Requisition Form Card */}
          <div
            className="reveal-on-scroll"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '28px 10px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(27, 94, 32, 0.12)',
                    color: 'var(--color-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: 'var(--color-green)',
                    marginBottom: '8px'
                  }}
                >
                  Requisition Logged
                </span>
                <h2
                  className="text-serif"
                  style={{ fontSize: '1.6rem', color: 'var(--color-maroon)', marginBottom: '12px' }}
                >
                  Institutional Enquiry Transmitted
                </h2>
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-cream)',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    display: 'inline-block',
                    marginBottom: '18px'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Reference Code</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-maroon)', fontFamily: 'monospace' }}>
                    {enquiryRef}
                  </span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Thank you, <strong>{formData.officerName}</strong>. Your requisition on behalf of <strong>{formData.institutionName}</strong> has been logged at the Publications Division of JSS Mahavidyapeetha. A formal Proforma Invoice with concession and parcel freight will be dispatched to <strong>{formData.email}</strong>.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        institutionType: 'Degree / Engineering College Library',
                        institutionName: '',
                        officerName: '',
                        designation: '',
                        phone: '',
                        email: '',
                        city: '',
                        state: 'Karnataka',
                        pincode: '',
                        seriesInterest: 'Sharana Samskruti Series (Complete Set)',
                        estimatedCopies: '50 - 100 copies',
                        notes: ''
                      });
                    }}
                    className="btn btn-secondary"
                    style={{ borderRadius: 'var(--radius-pill)', fontSize: '0.86rem' }}
                  >
                    Submit Another Indent
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('/books')}
                    className="btn btn-primary"
                    style={{ borderRadius: 'var(--radius-pill)', fontSize: '0.86rem' }}
                  >
                    Browse Catalogue
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '22px' }}>
                  <h2 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                    Institutional Indent / Enquiry Form
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Furnish details to receive a formal quotation, bank details, and official proforma invoice.
                  </p>
                </div>

                {/* Institution Type */}
                <div className="form-group">
                  <label className="form-label" htmlFor="institutionType">
                    Type of Institution *
                  </label>
                  <select
                    id="institutionType"
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Degree / Engineering College Library">Degree / Engineering / Medical College Library</option>
                    <option value="University Department / Center">University Post-Graduate Department / Research Centre</option>
                    <option value="High School / Pre-University College">High School / Pre-University (PU) College</option>
                    <option value="Public / Gram Panchayat Library">Public Library / Gram Panchayat Library</option>
                    <option value="Spiritual Math / Trust / Ashram">Spiritual Math / Religious Trust / Cultural Sabha</option>
                    <option value="Corporate CSR / Educational Trust">Corporate CSR / Educational Trust</option>
                  </select>
                </div>

                {/* Institution Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="institutionName">
                    Institution / Organization Name *
                  </label>
                  <input
                    id="institutionName"
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="e.g., SJCE Central Library, Mysuru"
                    className="form-input"
                    required
                  />
                </div>

                {/* Officer Name & Designation */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="officerName">
                      Contact Officer *
                    </label>
                    <input
                      id="officerName"
                      type="text"
                      name="officerName"
                      value={formData.officerName}
                      onChange={handleChange}
                      placeholder="e.g., Dr. B. S. Ramesh"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="designation">
                      Designation *
                    </label>
                    <input
                      id="designation"
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Chief Librarian / Principal"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Official Phone / Mobile *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., 0821-2548212"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Official Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="library@institution.edu.in"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* City, State & PIN */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">
                      City / Town *
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g., Mysuru"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="state">
                      State *
                    </label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pincode">
                      PIN Code *
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="570004"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Series of Interest & Volume */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="seriesInterest">
                      Series of Interest
                    </label>
                    <select
                      id="seriesInterest"
                      name="seriesInterest"
                      value={formData.seriesInterest}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Sharana Samskruti Series (Complete Set)">Sharana Samskruti Series (Complete 69+ volumes)</option>
                      <option value="Vachana Vyakyana Series">Vachana Vyakyana Commentary Series</option>
                      <option value="Philosophy & Vedanta Texts">Darshana & Philosophy Collection</option>
                      <option value="General Heritage & Biographies">Biographies & Monastic Heritage</option>
                      <option value="Periodicals Annual Subscription">Periodicals (*Prasada* / *Sharanapatha*)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="estimatedCopies">
                      Estimated Quantity
                    </label>
                    <select
                      id="estimatedCopies"
                      name="estimatedCopies"
                      value={formData.estimatedCopies}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="1 Complete Institutional Set">1 Complete Library Set</option>
                      <option value="25 - 50 copies">25 – 50 copies</option>
                      <option value="50 - 100 copies">50 – 100 copies</option>
                      <option value="100 - 500 copies">100 – 500 copies (Institution-wide)</option>
                      <option value="500+ copies">500+ copies</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" htmlFor="notes">
                    Specific Title Requirements or Invoicing Instructions
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="List specific titles, hardbound preference, purchase order number, or delivery timeline..."
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '13px 20px', fontSize: '0.94rem', fontWeight: 700, borderRadius: 'var(--radius-pill)' }}
                >
                  Submit Institutional Requisition
                </button>
              </form>
            )}
          </div>

          {/* Right: Institutional Pricing Estimator & Terms */}
          <div>
            
            {/* Box 1: Interactive Concession Estimator */}
            <div
              className="reveal-on-scroll reveal-stagger-1"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '26px',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Calculator size={18} color="var(--color-maroon)" />
                <h3 className="text-serif" style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                  Institutional Concession Estimator
                </h3>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-body)', marginBottom: '16px' }}>
                Move the slider to estimate institutional discount tiers available for educational libraries and spiritual centres:
              </p>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Volume: {estimateQty} Copies</span>
                  <span style={{ color: 'var(--color-saffron)' }}>{estimatedDiscount}% Concession Tier</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={estimateQty}
                  onChange={(e) => setEstimateQty(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--color-maroon)' }}
                />
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-bg-cream)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Est. Institutional Savings:</span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--color-green)' }}>₹{estimatedSavings} (approx)</strong>
              </div>
            </div>

            {/* Box 2: Institutional Terms Plaques */}
            <div
              className="reveal-on-scroll reveal-stagger-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '26px',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '24px'
              }}
            >
              <h3 className="text-serif" style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '16px' }}>
                Institutional Procurement Policies
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '7px', backgroundColor: 'rgba(94, 22, 36, 0.08)', borderRadius: 'var(--radius-sm)', color: 'var(--color-maroon)', flexShrink: 0 }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '2px' }}>
                      Official Proforma Invoicing & 0% GST
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-body)', lineHeight: 1.5 }}>
                      Printed books are 100% exempt from Goods & Services Tax (HSN Code 4901). Issued with serial GST-exempt invoices for UGC and government audit.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '7px', backgroundColor: 'rgba(184, 78, 26, 0.08)', borderRadius: 'var(--radius-sm)', color: 'var(--color-saffron)', flexShrink: 0 }}>
                    <Truck size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '2px' }}>
                      India Post Registered Parcel & Freight
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-body)', lineHeight: 1.5 }}>
                      Consignments are packed in institutional weather-resistant cartons and dispatched with speed post tracking.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '7px', backgroundColor: 'rgba(197, 155, 39, 0.12)', borderRadius: 'var(--radius-sm)', color: '#8C6B14', flexShrink: 0 }}>
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '2px' }}>
                      Concessions for Affiliated Schools & Maths
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-body)', lineHeight: 1.5 }}>
                      JSS Mahavidyapeetha institutions, Veerashaiva Vidyavardhaka Sangha colleges, and community libraries receive tiered institutional terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Direct Desk Contact Details */}
            <div
              className="reveal-on-scroll reveal-stagger-3"
              style={{
                backgroundColor: 'var(--color-bg-neutral)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px'
              }}
            >
              <h4 className="text-serif" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '10px' }}>
                Publications Division Headquarters
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-body)', marginBottom: '12px' }}>
                Institutions wishing to submit indents on official letterhead can contact the division directly:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Phone size={14} color="var(--color-maroon)" />
                  <a href="tel:08212548212" style={{ color: 'var(--color-maroon)', fontWeight: 600 }}>0821-2548212 / 0821-2548218</a>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Mail size={14} color="var(--color-maroon)" />
                  <a href="mailto:jss@jssonline.org" style={{ color: 'var(--color-maroon)', fontWeight: 600 }}>jss@jssonline.org</a>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <MapPin size={14} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru – 570 004</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
