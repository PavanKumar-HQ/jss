import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Building2, Send, CheckCircle2, Navigation, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Catalogue & Book Availability Enquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCopyAddress = () => {
    const addressText = "JSS Publications / JSS Granthamale, JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru - 570004, Karnataka, India";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(addressText).then(() => {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2400);
      });
    }
  };

  return (
    <div className="contact-page animate-fade-in" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '85vh', paddingBottom: '70px' }}>
      {/* Editorial Page Header */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          padding: '48px 0 38px',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Watermark Kannada Initial */}
        <div
          style={{
            position: 'absolute',
            right: '24px',
            top: '-20px',
            opacity: 0.035,
            pointerEvents: 'none',
            fontSize: '13rem',
            fontFamily: 'serif',
            color: 'var(--color-maroon)'
          }}
        >
          ಸಂ
        </div>

        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '14px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('/'); }}
              style={{ color: 'var(--color-maroon)', fontWeight: 600, textDecoration: 'none' }}
            >
              Home
            </a>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-text-charcoal)', fontWeight: 600 }}>Contact & Retail Counter</span>
          </nav>

          <div style={{ maxWidth: '840px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge badge-maroon">
                Communications & Retail Desk
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-accent-gold)', fontWeight: 700 }}>
                Dr. Shivarathri Rajendra Circle, Mysuru
              </span>
            </div>

            <h1
              className="text-serif-display"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.7rem)',
                color: 'var(--color-maroon)',
                lineHeight: 1.2,
                marginBottom: '10px',
                fontWeight: 700
              }}
            >
              Contact JSS Publications
            </h1>

            <p style={{ fontSize: '1.02rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '720px' }}>
              Connect with the Publications Division at JSS Mahavidyapeetha for book enquiries, academic monograph distributions, and journal subscriptions, or visit our retail counter in Mysuru.
            </p>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="container">
        <div className="two-col-responsive-grid" style={{ alignItems: 'flex-start', gap: '32px' }}>
          
          {/* LEFT COLUMN: Physical Coordinates & Retail Counter Boxes */}
          <div>
            
            {/* Box 1: Publications Division Headquarters Card */}
            <div className="contact-panel-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-accent-gold)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '2px' }}>
                    Institutional Headquarters
                  </span>
                  <h2 className="text-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-maroon)', margin: 0 }}>
                    Publications Division
                  </h2>
                </div>
                <div style={{ padding: '6px 12px', backgroundColor: 'var(--color-maroon-subtle)', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(94, 22, 36, 0.15)', fontSize: '0.76rem', color: 'var(--color-maroon)', fontWeight: 600 }}>
                  Estd. 1954
                </div>
              </div>

              {/* 4 Differentiated Tactile Contact Tiles */}
              <div className="contact-info-tiles-grid">
                
                {/* Tile 1: Postal Address */}
                <div className="contact-info-tile">
                  <div className="contact-tile-icon-wrap" style={{ backgroundColor: 'rgba(94, 22, 36, 0.08)', color: 'var(--color-maroon)' }}>
                    <MapPin size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--color-text-charcoal)' }}>
                        Postal Address
                      </strong>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedAddress ? 'var(--color-green)' : 'var(--color-maroon)',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {copiedAddress ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                    <address style={{ fontStyle: 'normal', fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.55 }}>
                      <strong>JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale</strong><br />
                      JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle<br />
                      Mysuru – 570 004, Karnataka, India
                    </address>
                  </div>
                </div>

                {/* Tile 2: Telephone & PBX */}
                <div className="contact-info-tile">
                  <div className="contact-tile-icon-wrap" style={{ backgroundColor: 'rgba(168, 66, 20, 0.08)', color: 'var(--color-saffron)' }}>
                    <Phone size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>
                      Telephone & PBX Desk
                    </strong>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <a
                        href="tel:+918212548212"
                        style={{ fontSize: '0.92rem', color: 'var(--color-maroon)', fontWeight: 700, textDecoration: 'none' }}
                        title="Click to dial JSS Publications PBX"
                      >
                        +91-821-2548212
                      </a>
                      <span style={{ color: 'var(--color-border-dark)' }}>|</span>
                      <a
                        href="tel:+918212548218"
                        style={{ fontSize: '0.92rem', color: 'var(--color-maroon)', fontWeight: 700, textDecoration: 'none' }}
                        title="Click to dial JSS Publications direct line"
                      >
                        +91-821-2548218
                      </a>
                    </div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Extensions: Publications Office & Counter
                    </span>
                  </div>
                </div>

                {/* Tile 3: Official Email */}
                <div className="contact-info-tile">
                  <div className="contact-tile-icon-wrap" style={{ backgroundColor: 'rgba(197, 155, 39, 0.12)', color: 'var(--color-accent-gold)' }}>
                    <Mail size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>
                      Official Correspondence
                    </strong>
                    <a
                      href="mailto:publications@jssonline.org"
                      style={{ fontSize: '0.92rem', color: 'var(--color-maroon)', fontWeight: 700, textDecoration: 'none' }}
                      title="Send email to JSS Publications"
                    >
                      publications@jssonline.org
                    </a>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      General Portal: <a href="https://jssonline.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-body)', textDecoration: 'underline' }}>jssonline.org</a>
                    </span>
                  </div>
                </div>

                {/* Tile 4: Counter Timings */}
                <div className="contact-info-tile">
                  <div className="contact-tile-icon-wrap" style={{ backgroundColor: 'rgba(27, 94, 32, 0.08)', color: 'var(--color-green)' }}>
                    <Clock size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-text-charcoal)', marginBottom: '4px' }}>
                      Counter & Dispatch Timings
                    </strong>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.5, margin: 0 }}>
                      <strong>Monday through Saturday:</strong> 9:30 AM to 6:00 PM IST<br />
                      <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.82rem' }}>
                        Sunday & Karnataka Government Gazetted Holidays: Closed
                      </span>
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Box 2: JSS Book House Physical Retail Counter */}
            <div className="contact-retail-box">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ padding: '6px', backgroundColor: 'var(--color-maroon-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--color-maroon)' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-maroon)', margin: 0 }}>
                    JSS Book House Retail Counter
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-accent-gold)', fontWeight: 600 }}>
                    Walk-in Store & Postal Dispatch Centre
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.65, marginBottom: '16px' }}>
                Visitors to Mysuru may personally inspect hardbound and paperback folios, examine palm-leaf research archives, purchase annual <em>JSS Kannada Panchangas</em>, subscribe to <em>Prasada</em> bimonthly journal, and collect institutional bulk orders directly from the counter.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Located at Dr. Shivarathri Rajendra Circle, Mysuru
                </span>
                <a
                  href="https://maps.google.com/?q=JSS+Mahavidyapeetha+Mysuru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px', fontSize: '0.82rem' }}
                >
                  <Navigation size={13} />
                  <span>Get Directions</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: General Enquiry Form Card */}
          <div>
            <div className="contact-form-box">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(27, 94, 32, 0.1)',
                      color: 'var(--color-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 18px',
                      border: '2px solid rgba(27, 94, 32, 0.2)'
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <span className="badge badge-green" style={{ marginBottom: '12px' }}>
                    Enquiry Acknowledged
                  </span>
                  <h2 className="text-serif-display" style={{ fontSize: '1.65rem', color: 'var(--color-text-charcoal)', marginBottom: '12px', fontWeight: 700 }}>
                    Message Transmitted to Desk
                  </h2>
                  <p style={{ fontSize: '0.94rem', color: 'var(--color-text-body)', lineHeight: 1.65, marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px' }}>
                    Thank you, <strong>{formData.name}</strong>. Your enquiry has been routed to the Publications Desk at JSS Mahavidyapeetha. An official representative will respond via email or telephone during working hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'Catalogue & Book Availability Enquiry', message: '' });
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '10px 22px' }}
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Form Header */}
                  <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-gold">
                        Electronic Dispatch Desk
                      </span>
                    </div>
                    <h2 className="text-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '4px' }}>
                      Send an Enquiry to Publications Desk
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
                      Inquire regarding title availability, postal parcel tracking, scholarly research requests, or institutional indents.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div style={{ marginBottom: '18px' }}>
                    <label htmlFor="name" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., S. N. Mahadevaswamy"
                      className="contact-input-field"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="form-row-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '16px', marginBottom: '18px' }}>
                    <div>
                      <label htmlFor="email" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        inputMode="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="contact-input-field"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
                        Contact Telephone / Mobile
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g., 9845012345"
                        className="contact-input-field"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div style={{ marginBottom: '18px' }}>
                    <label htmlFor="subject" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
                      Subject Folio / Nature of Enquiry
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="contact-input-field"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Catalogue & Book Availability Enquiry">Catalogue & Book Availability Enquiry</option>
                      <option value="Periodical Subscription (Prasada / Sharanapatha)">Periodical Subscription (*Prasada* / *Sharanapatha*)</option>
                      <option value="Postal Speed Post Status Enquiry">Postal Speed Post Status Enquiry</option>
                      <option value="Institutional & Library Procurement Indent">Institutional & Library Procurement Indent</option>
                      <option value="Palm-Leaf Manuscript & Research Exegesis Query">Palm-Leaf Manuscript & Research Exegesis Query</option>
                      <option value="General Institutional Correspondence">General Institutional Correspondence</option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="message" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
                      Your Message / Book Titles Required *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please mention book title, author, required quantity, or delivery city..."
                      className="contact-input-field"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '13px 24px', fontSize: '0.96rem', fontWeight: 700, gap: '8px' }}
                  >
                    <Send size={16} />
                    <span>Transmit Enquiry to Publications Desk</span>
                  </button>

                  {/* Reassurance Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
                    <ShieldCheck size={14} color="var(--color-green)" />
                    <span>Official JSS Mahavidyapeetha Communications Portal · Non-profit Educational Trust</span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
