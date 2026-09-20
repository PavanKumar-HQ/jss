import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Building2, Send, CheckCircle2, FileText, HelpCircle } from 'lucide-react';

export default function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Catalogue & Book Availability Enquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page animate-fade-in" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', paddingBottom: '70px' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '44px 0 36px',
          marginBottom: '40px'
        }}
      >
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '14px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              style={{ cursor: 'pointer', color: 'var(--color-accent-maroon)' }}
            >
              Home
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Contact & Retail Counter</span>
          </nav>

          <div style={{ maxWidth: '840px' }}>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(94, 22, 36, 0.08)',
                color: 'var(--color-accent-maroon)',
                borderColor: 'rgba(94, 22, 36, 0.2)',
                marginBottom: '12px'
              }}
            >
              Communications & Retail
            </span>
            <h1
              className="text-serif-display"
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                color: 'var(--color-accent-maroon)',
                lineHeight: 1.25,
                marginBottom: '12px'
              }}
            >
              Contact JSS Publications
            </h1>
            <p style={{ fontSize: '1.02rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Reach the Publications Division at JSS Mahavidyapeetha or visit our physical retail counter at JSS Book House in Mysuru.
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Column: Official Contact Information */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '30px',
                marginBottom: '24px'
              }}
            >
              <h2 className="text-serif-classical" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '18px' }}>
                Publications Division Headquarters
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(94, 22, 36, 0.08)', borderRadius: 'var(--radius-sm)', color: 'var(--color-accent-maroon)', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                      Postal Address
                    </h3>
                    <address style={{ fontStyle: 'normal', fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      JSS Publications / JSS Granthamale<br />
                      JSS Mahavidyapeetha<br />
                      Dr. Shivarathri Rajendra Circle<br />
                      Mysuru – 570 004, Karnataka, India
                    </address>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(184, 78, 26, 0.08)', borderRadius: 'var(--radius-sm)', color: 'var(--color-accent-saffron)', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                      Telephone & PBX
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      EPABX: 0821-2548212 / 2548218<br />
                      Fax: 0821-2548218
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(197, 155, 39, 0.12)', borderRadius: 'var(--radius-sm)', color: 'var(--color-accent-gold)', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                      Official Email
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      General: jss@jssonline.org<br />
                      Official Website: jssonline.org
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(46, 125, 50, 0.08)', borderRadius: 'var(--radius-sm)', color: '#2E7D32', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                      Counter & Office Timings
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      Monday through Saturday: 9:30 AM to 5:30 PM<br />
                      Sunday & State Public Holidays: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* JSS Book House Physical Retail Counter */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-cream)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <Building2 size={20} color="var(--color-accent-maroon)" />
                <h3 className="text-serif-classical" style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--color-accent-maroon)' }}>
                  JSS Book House Retail Outlet
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                Visitors to Mysuru may inspect complete hardbound and paperback folios, purchase annual Panchangas, subscribe to <em>Prasada</em> and <em>Sharanapatha</em> periodicals, and collect institutional orders directly from the counter.
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '10px' }}>
                Located adjacent to Sri Suttur Math and JSS MVP Administrative Complex, Mysuru.
              </div>
            </div>
          </div>

          {/* Right Column: General Enquiry Form */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '32px'
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    color: '#2E7D32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-serif-display" style={{ fontSize: '1.45rem', color: 'var(--color-text-primary)', marginBottom: '10px' }}>
                  Enquiry Transmitted
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Thank you, <strong>{formData.name}</strong>. Your query has been logged. The Publications desk at JSS Mahavidyapeetha will respond to your email or telephone within normal working hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'Catalogue & Book Availability Enquiry', message: '' });
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.86rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '14px', marginBottom: '20px' }}>
                  <h2 className="text-serif-classical" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Send an Enquiry to Publications Desk
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                    For queries regarding out-of-print titles, postal dispatch updates, or periodical subscriptions.
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="name" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label htmlFor="email" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

                  <div>
                    <label htmlFor="phone" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                      Mobile / Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  <label htmlFor="subject" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                    Nature of Enquiry
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-subtle)',
                      backgroundColor: 'var(--color-bg-primary)',
                      fontSize: '0.9rem',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    <option value="Catalogue & Book Availability Enquiry">Catalogue & Book Availability Enquiry</option>
                    <option value="Periodical Subscription (Prasada / Sharanapatha)">Periodical Subscription (*Prasada* / *Sharanapatha*)</option>
                    <option value="Postal Dispatch Status Enquiry">Postal Dispatch Status Enquiry</option>
                    <option value="Manuscript & Scholarly Research Query">Manuscript & Scholarly Research Query</option>
                    <option value="Other Institutional Query">Other Institutional Query</option>
                  </select>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label htmlFor="message" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                    Your Message / Title Request *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Kindly state the titles, author, or inquiry details..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-subtle)',
                      backgroundColor: 'var(--color-bg-primary)',
                      fontSize: '0.9rem',
                      color: 'var(--color-text-primary)',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px 20px', fontSize: '0.92rem', fontWeight: 600 }}
                >
                  Send Enquiry to Publications Desk
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
