import React, { useState } from 'react';
import { X, Building2, CheckCircle2, BookOpen } from 'lucide-react';

export default function InstitutionalEnquiryModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    instName: '',
    contactPerson: '',
    phone: '',
    email: '',
    estimatedQuantity: '100-500 books',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-folio" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', overflow: 'hidden' }}>
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
            <Building2 size={20} color="#E5C368" />
            <div>
              <span style={{ fontSize: '0.74rem', color: '#D6CCA8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Academic & Library Endowment
              </span>
              <h2 className="text-serif-display" style={{ fontSize: '1.18rem', fontWeight: 700 }}>
                Institutional Bulk Procurement
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
            aria-label="Close enquiry modal"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 'clamp(16px, 4vw, 26px)', backgroundColor: '#FAF7F2' }}>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '0.88rem', color: '#524944', lineHeight: 1.6, marginBottom: '20px' }}>
                JSS Publications provides special institutional pricing and concessional rates for schools, colleges, public libraries, university research departments, and mutts across India.
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>
                  Institution / Library / Trust Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JSS Public School, Mysuru / Central University Library"
                  value={formData.instName}
                  onChange={(e) => setFormData({ ...formData, instName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>
                    Contact Person / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Chief Librarian / Principal"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>
                  Estimated Volume Requirement
                </label>
                <select
                  value={formData.estimatedQuantity}
                  onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                >
                  <option value="50-100 books">50 - 100 books (Classroom / Reference set)</option>
                  <option value="100-500 books">100 - 500 books (Institutional library order)</option>
                  <option value="500+ books">500+ books (Full Sharana Samskruti series package)</option>
                </select>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1A1615', marginBottom: '4px' }}>
                  Specific Series or Inquiries
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify titles, series sets, or student notebook requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Submit Official Bulk Quotation Request
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '28px 10px' }}>
              <CheckCircle2 size={54} color="#1B5E20" style={{ marginBottom: '14px' }} />
              <h3 className="text-serif-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4A0E17', marginBottom: '8px' }}>
                Quotation Request Received
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#524944', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                Thank you. The JSS Publications Division editorial team will evaluate your institution's requirements and dispatch an official concessional quotation via email and phone within 24 hours.
              </p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                Close Folio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
