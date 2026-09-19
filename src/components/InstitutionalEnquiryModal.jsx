import React, { useState } from 'react';
import { X, Building2, CheckCircle2 } from 'lucide-react';

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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', padding: 0 }}>
        {/* Header Bar */}
        <div style={{ backgroundColor: '#5E1624', color: '#FFF', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} color="#D97706" />
            <h2 className="text-serif" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Institutional & Library Bulk Procurement
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }} aria-label="Close enquiry modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', backgroundColor: '#FBF9F5' }}>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '0.88rem', color: '#57534E', marginBottom: '16px' }}>
                JSS Publications provides special institutional pricing and concessional rates for schools, colleges, public libraries, and research organizations. Submit your requirement below:
              </p>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Institution / Library Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JSS Public School, Mysuru / Public Library Trust"
                  value={formData.instName}
                  onChange={(e) => setFormData({ ...formData, instName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Librarian / Principal Name"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contact Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Estimated Quantity Requirement</label>
                <select
                  value={formData.estimatedQuantity}
                  onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1' }}
                >
                  <option value="50-100 books">50 - 100 books</option>
                  <option value="100-500 books">100 - 500 books</option>
                  <option value="500+ books">500+ books (Full Series Bulk Pack)</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Specific Titles / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Specify titles or series required (e.g., Sharana Samskruti Male Series 50 sets)..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontFamily: 'inherit' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Submit Institutional Bulk Quotation Request
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <CheckCircle2 size={56} color="#166534" style={{ marginBottom: '12px' }} />
              <h3 className="text-serif" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#5E1624', marginBottom: '8px' }}>
                Quotation Request Received!
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#57534E', marginBottom: '20px' }}>
                Thank you. The JSS Publications Division team will review your institutional requirements and contact you within 1 business day with official concessional quote details.
              </p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                Close Modal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
