import React, { useState } from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink, X } from 'lucide-react';

export default function LocationSection({ isOpenModal, onCloseModal }) {
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '48px 0', borderTop: '1px solid #E7E5E4' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
          {/* Information Column */}
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#C85A17', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Physical Retail Outlet & Distribution Centre
            </span>
            <h2 className="text-serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#5E1624', marginTop: '6px', marginBottom: '16px' }}>
              JSS Book House, Mysuru
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#57534E', lineHeight: 1.6, marginBottom: '24px' }}>
              Visit our main publication outlet in Mysuru for in-person browsing, institutional consultations, and collecting authentic Vachana literature, Panchangas, and mementos.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={20} color="#C85A17" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1C1917' }}>Physical Address:</strong>
                  <span style={{ fontSize: '0.88rem', color: '#57534E' }}>
                    JSS Book House, JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru – 570 004, Karnataka, India
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Clock size={20} color="#C85A17" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1C1917' }}>Operating Hours:</strong>
                  <span style={{ fontSize: '0.88rem', color: '#57534E' }}>
                    Monday – Saturday: 09:30 AM – 06:00 PM (Closed on Sunday & General Holidays)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Phone size={20} color="#C85A17" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1C1917' }}>Direct Publication Enquiries:</strong>
                  <span style={{ fontSize: '0.88rem', color: '#57534E' }}>
                    0821-2548212 / 0821-2548218 • Email: jss@jssonline.org
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowMapModal(true)}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                <Navigation size={14} />
                <span>View Store Map</span>
              </button>
              <a
                href="https://maps.google.com/?q=JSS+Mahavidyapeetha+Mysuru"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ gap: '6px' }}
              >
                <ExternalLink size={14} />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Location Visual Card */}
          <div style={{ backgroundColor: '#F3EFE6', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#5E1624', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <MapPin size={32} color="#FBF9F5" />
            </div>
            <h3 className="text-serif" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#5E1624', marginBottom: '8px' }}>
              Mysuru Heritage Campus
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '16px' }}>
              Located at the heart of Mysuru near Gun House Circle. Walk-ins welcome for book releases and reading enquiries.
            </p>
            <span className="badge badge-gold">Official Outlet Verified</span>
          </div>
        </div>
      </div>

      {/* Map Interactive Modal */}
      {showMapModal && (
        <div className="modal-overlay" onClick={() => setShowMapModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: 0 }}>
            <div style={{ backgroundColor: '#5E1624', color: '#FFF', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="text-serif" style={{ fontSize: '1.1rem', fontWeight: 600 }}>JSS Book House Location Map</h3>
              <button onClick={() => setShowMapModal(false)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#FBF9F5', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#E7E5E4', height: '240px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#57534E', gap: '8px' }}>
                <MapPin size={36} color="#C85A17" />
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1C1917' }}>Dr. Shivarathri Rajendra Circle, Mysuru - 570004</span>
                <span style={{ fontSize: '0.8rem' }}>Latitude: 12.3052° N, Longitude: 76.6552° E</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
