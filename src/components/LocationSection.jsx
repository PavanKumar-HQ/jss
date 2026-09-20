import React, { useState } from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink, X, Compass, Building2 } from 'lucide-react';

export default function LocationSection() {
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <section
      id="store-location-section"
      style={{
        backgroundColor: '#FFFFFF',
        padding: '64px 0',
        borderTop: '1px solid var(--color-border)',
        position: 'relative'
      }}
      aria-label="JSS Book House Mysuru Physical Store"
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          {/* Left Column: Official Store Info */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(184, 78, 26, 0.1)',
                border: '1px solid rgba(184, 78, 26, 0.25)',
                marginBottom: '12px'
              }}
            >
              <Building2 size={13} color="#B84E1A" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B84E1A', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Physical Retail Outlet & Distribution Centre
              </span>
            </div>

            <h2
              className="text-serif-display"
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
                fontWeight: 700,
                color: '#2E060D',
                lineHeight: 1.2,
                marginBottom: '14px'
              }}
            >
              JSS Book House, Mysuru
            </h2>

            <p style={{ fontSize: '0.94rem', color: '#524944', lineHeight: 1.68, marginBottom: '28px' }}>
              Located opposite Sri Shivarathri Rajendra Circle in the heritage city of Mysuru. Readers, research scholars, and educational institutions are welcome for in-person consultations and collection of publications, calendars, and educational notebooks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={18} color="#B84E1A" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: '#1A1615', marginBottom: '2px' }}>
                    Physical Address:
                  </strong>
                  <span style={{ fontSize: '0.88rem', color: '#524944' }}>
                    JSS Book House, JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru – 570 004, Karnataka, India
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={18} color="#B84E1A" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: '#1A1615', marginBottom: '2px' }}>
                    Operating Hours:
                  </strong>
                  <span style={{ fontSize: '0.88rem', color: '#524944' }}>
                    Monday – Saturday: 09:30 AM – 06:00 PM (Closed on Sunday & State Holidays)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={18} color="#B84E1A" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: '#1A1615', marginBottom: '2px' }}>
                    Publication Hotline:
                  </strong>
                  <span style={{ fontSize: '0.88rem', color: '#524944' }}>
                    0821-2548212 / 2548218 • Email: jss@jssonline.org
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowMapModal(true)}
                className="btn btn-primary"
                style={{ gap: '8px' }}
              >
                <Navigation size={15} />
                <span>View Campus Location Map</span>
              </button>

              <a
                href="https://maps.google.com/?q=JSS+Mahavidyapeetha+Mysuru"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ gap: '8px' }}
              >
                <ExternalLink size={15} />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Right Column: Cultural Heritage Plaque */}
          <div
            style={{
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 32px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Corner Ornamental Flourish */}
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#2E060D', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 6px 18px rgba(46,6,13,0.2)' }}>
              <Compass size={34} color="#E5C368" />
            </div>

            <h3 className="text-serif-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2E060D', marginBottom: '10px' }}>
              Mysuru Heritage Campus
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#524944', lineHeight: 1.6, marginBottom: '24px' }}>
              Situated adjacent to Gun House Circle and Mysore Palace grounds. Home to Sri Suttur Math cultural gatherings, annual book releases, and educational distributions.
            </p>

            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="badge badge-gold">Official Retail Outlet Verified</span>
              <span className="badge badge-crimson">Notebooks & Mementos Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Interactive Modal */}
      {showMapModal && (
        <div className="modal-overlay" onClick={() => setShowMapModal(false)}>
          <div className="modal-folio" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#2E060D', color: '#FFF', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(197,155,39,0.3)' }}>
              <h3 className="text-serif-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                JSS Book House Location Coordinates
              </h3>
              <button onClick={() => setShowMapModal(false)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px', backgroundColor: '#FAF7F2', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#EDE3D2', height: '240px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#524944', gap: '10px', border: '1px solid var(--color-border)' }}>
                <MapPin size={38} color="#B84E1A" />
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1A1615' }}>Dr. Shivarathri Rajendra Circle, Mysuru – 570 004</span>
                <span style={{ fontSize: '0.84rem' }}>Coordinates: 12.3052° N, 76.6552° E • Landmark: Near Gun House Circle</span>
              </div>
              <div style={{ marginTop: '18px' }}>
                <a
                  href="https://maps.google.com/?q=JSS+Mahavidyapeetha+Mysuru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <ExternalLink size={14} />
                  <span>Navigate with Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
