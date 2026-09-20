import React from 'react';
import { BookOpen, Award, Compass, Heart, Library, Users, Building, ShieldCheck, Check, Calendar, Scroll, Landmark, ArrowRight, ExternalLink } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AboutPage({ onNavigate }) {
  const [headerRef] = useScrollReveal();
  const [missionRef] = useScrollReveal();
  const [pillarsRef] = useScrollReveal();
  const [timelineRef] = useScrollReveal();
  const [ecosystemRef] = useScrollReveal();

  const timelineMilestones = [
    {
      period: '10th Century CE',
      title: 'Foundation of Sri Suttur Math',
      titleKannada: 'ಶ್ರೀ ಸುತ್ತೂರು ವೀರಸಿಂಹಾಸನ ಮಠ ಸಂಸ್ಥಾಪನೆ',
      description: 'Established on the sacred banks of the Kapila river by Adi Jagadguru Sri Shivarathrishwara Shivayogi, initiating an unbroken millennium of spiritual guidance, community service, and literary preservation.'
    },
    {
      period: '1954 CE',
      title: 'Establishment of JSS Mahavidyapeetha',
      titleKannada: 'ಜೆ.ಎಸ್.ಎಸ್. ಮಹಾವಿದ್ಯಾಪೀಠದ ಉದಯ',
      description: 'The 22nd Pontiff, Mantra Maharshi Sri Shivarathri Rajendra Mahaswamiji, formally established JSS Mahavidyapeetha to democratize education and spiritual knowledge from primary schooling to advanced universities.'
    },
    {
      period: '1967 CE',
      title: 'Inception of "Prasada" Journal',
      titleKannada: '‘ಪ್ರಸಾದ’ ದ್ವೈಮಾಸಿಕ ಸಾಹಿತ್ಯ ಪತ್ರಿಕೆಯ ಆರಂಭ',
      description: 'Launched as a pioneering bimonthly literary journal dedicated to publishing peer-reviewed treatises, Sharana philosophies, and classical Kannada poetry, continuing in continuous print for over 58 years.'
    },
    {
      period: '1970s – 1990s',
      title: 'Sharana Samskruti Male & International Journals',
      titleKannada: 'ಶರಣ ಸಂಸ್ಕೃತಿ ಮಾಲೆ ಹಾಗೂ ‘ಶರಣಪಥ’',
      description: 'Commissioned over 69 scholarly monographs on individual Sharanas, followed in 1990 by "Sharanapatha", a bi-annual English academic journal circulating to university libraries across India and abroad.'
    },
    {
      period: 'Present Day',
      title: 'Digital Preservation & Global Exegesis',
      titleKannada: 'ತಾಳೆಗರಿ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಜಾಗತಿಕ ವಚನ ಪ್ರಸಾರ',
      description: 'Under the vision of the 24th Pontiff, Jagadguru Sri Shivarathri Deshikendra Mahaswamiji, the Publications Division is digitizing palm-leaf folios, issuing critical multi-lingual editions, and subsidizing deliveries worldwide.'
    }
  ];

  return (
    <div className="about-page" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', paddingBottom: '70px' }}>
      {/* Page Header */}
      <header
        ref={headerRef}
        className="reveal-on-scroll"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '48px 0 38px',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative background watermarks */}
        <div
          style={{
            position: 'absolute',
            right: '-30px',
            top: '-20px',
            opacity: 0.04,
            pointerEvents: 'none',
            fontSize: '14rem',
            fontFamily: 'serif',
            color: 'var(--color-accent-maroon)'
          }}
        >
          ಶ
        </div>

        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '14px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              style={{ cursor: 'pointer', color: 'var(--color-accent-maroon)', fontWeight: 600 }}
            >
              Home
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Heritage & History</span>
          </nav>

          <div style={{ maxWidth: '860px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(94, 22, 36, 0.08)',
                  color: 'var(--color-accent-maroon)',
                  border: '1px solid rgba(94, 22, 36, 0.2)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)'
                }}
              >
                Institution & Cultural Lineage
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-saffron)', fontWeight: 600 }}>
                Est. Sri Suttur Math Tradition
              </span>
            </div>

            <h1
              className="text-serif-display"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                color: 'var(--color-accent-maroon)',
                lineHeight: 1.2,
                marginBottom: '14px',
                fontWeight: 700
              }}
            >
              Jagadguru Sri Shivarathreeshwara Granthamale
            </h1>
            <p className="text-kannada" style={{ fontSize: '1.05rem', color: 'var(--color-accent-saffron)', marginBottom: '10px' }}>
              ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ, ಮೈಸೂರು
            </p>
            <p style={{ fontSize: '1.02rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
              A revered publishing tradition committed to the preservation of classical 12th-century Sharana literature, palm-leaf textual exegesis, and philosophical knowledge under the auspices of JSS Mahavidyapeetha and Sri Suttur Veerasimhasana Math, Mysuru.
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Core Mission & Founder's Vision */}
        <section
          ref={missionRef}
          className="reveal-on-scroll"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '44px 38px',
            marginBottom: '44px',
            boxShadow: '0 4px 20px rgba(94, 22, 36, 0.04)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--color-accent-saffron)',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Founder's Conviction & Sacred Vision
              </span>
              <h2
                className="text-serif-display"
                style={{ fontSize: '1.85rem', color: 'var(--color-accent-maroon)', marginBottom: '16px', lineHeight: 1.3, fontWeight: 700 }}
              >
                "Social Transformation Through Literature"
              </h2>

              <div
                style={{
                  backgroundColor: 'var(--color-bg-cream)',
                  borderLeft: '4px solid var(--color-accent-gold)',
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                  padding: '16px 20px',
                  margin: '18px 0 22px'
                }}
              >
                <p
                  className="text-kannada"
                  style={{
                    fontSize: '1.18rem',
                    color: 'var(--color-accent-maroon)',
                    lineHeight: 1.6,
                    fontWeight: 600,
                    marginBottom: '6px'
                  }}
                >
                  ಸಾಹಿತ್ಯದ ಮೂಲಕ ಸಾಮಾಜಿಕ ಹಾಗೂ ಧಾರ್ಮಿಕ ಜಾಗೃತಿ
                </p>
                <span style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                  — 22nd Jagadguru, Mantra Maharshi His Holiness Sri Shivarathri Rajendra Mahaswamiji
                </span>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: '16px' }}>
                Jagadguru Sri Shivarathreeshwara Granthamale was conceived by the 22nd Jagadguru with the profound conviction that enduring moral upliftment, spiritual harmony, and democratic egalitarianism stem from making the compassionate wisdom of the 12th-century Sharana movement directly accessible to all strata of society.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
                Under the divine patronship of the 24th Pontiff, His Holiness Jagadguru Sri Shivarathri Deshikendra Mahaswamiji, the Granthamale has grown into an internationally respected publishing house, maintaining strict fidelity to palm-leaf manuscript traditions while ensuring books remain affordable to rural institutions, students, and monastic seekers.
              </p>
            </div>

            {/* High-Contrast Archival Pillars Plaque */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-cream)',
                border: '1.5px solid rgba(197, 155, 39, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(94, 22, 36, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-accent-maroon)',
                    height: 'fit-content',
                    boxShadow: '0 2px 6px rgba(94, 22, 36, 0.08)'
                  }}
                >
                  <Library size={22} />
                </div>
                <div>
                  <h3 className="text-serif" style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-accent-maroon)', marginBottom: '4px' }}>
                    Scholarly Palm-Leaf & Textual Authenticity
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                    Every text passes through rigorous critical scrutiny by distinguished Kannada scholars and philologists to ensure manuscript fidelity and historical precision.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(184, 78, 26, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-accent-saffron)',
                    height: 'fit-content',
                    boxShadow: '0 2px 6px rgba(184, 78, 26, 0.08)'
                  }}
                >
                  <Award size={22} />
                </div>
                <div>
                  <h3 className="text-serif" style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-accent-maroon)', marginBottom: '4px' }}>
                    Subsidized Non-Profit Mission
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                    In accordance with Suttur Math's educational ideals, all publications are priced strictly near production costs with 0% GST (HSN 4901 exempt) to benefit rural libraries and learners.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(197, 155, 39, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-accent-gold)',
                    height: 'fit-content',
                    boxShadow: '0 2px 6px rgba(197, 155, 39, 0.08)'
                  }}
                >
                  <Compass size={22} />
                </div>
                <div>
                  <h3 className="text-serif" style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-accent-maroon)', marginBottom: '4px' }}>
                    Multi-Lingual Global Outreach
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                    Translating canonical Vachanas and philosophical commentaries into English, Sanskrit, Hindi, and Tamil for universities and cultural institutions worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Milestones & Publishing Timeline */}
        <section
          ref={timelineRef}
          className="reveal-on-scroll"
          style={{ marginBottom: '48px' }}
        >
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--color-accent-saffron)',
                display: 'block',
                marginBottom: '6px'
              }}
            >
              Chronicle of Service
            </span>
            <h2
              className="text-serif-display"
              style={{ fontSize: '1.75rem', color: 'var(--color-accent-maroon)', fontWeight: 700 }}
            >
              Historical Timeline & Archival Milestones
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '840px', margin: '0 auto' }}>
            {timelineMilestones.map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 28px',
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  gap: '24px',
                  alignItems: 'start',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.2s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent-gold)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(94, 22, 36, 0.08)',
                      color: 'var(--color-accent-maroon)',
                      border: '1px solid rgba(94, 22, 36, 0.18)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    {item.period}
                  </span>
                </div>

                <div>
                  <h3 className="text-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-accent-maroon)', marginBottom: '3px' }}>
                    {item.title}
                  </h3>
                  <span className="text-kannada" style={{ fontSize: '0.88rem', color: 'var(--color-accent-saffron)', display: 'block', marginBottom: '8px' }}>
                    {item.titleKannada}
                  </span>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Institutional Ecosystem Plaque */}
        <section
          ref={ecosystemRef}
          className="reveal-on-scroll"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1.5px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '38px 34px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '28px',
            boxShadow: '0 4px 20px rgba(94, 22, 36, 0.03)'
          }}
        >
          <div style={{ maxWidth: '660px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Building size={18} color="var(--color-accent-maroon)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent-maroon)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                The JSS Mahavidyapeetha Ecosystem
              </span>
            </div>
            <h3 className="text-serif-display" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-accent-maroon)', marginBottom: '10px' }}>
              300+ Educational Institutions Across India & Abroad
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
              From pre-primary schools to renowned research universities, medical colleges, engineering academies, and polytechnics across Karnataka, Tamil Nadu, Uttar Pradesh, and overseas in the UAE and USA — JSS Mahavidyapeetha educates over 100,000 students annually. The Publications Division serves as the spiritual and cultural compass of this extensive educational mission.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('books')}
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.88rem', gap: '8px' }}
            >
              <BookOpen size={16} />
              <span>Browse Catalogue</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('contact')}
              className="btn btn-outline"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              <span>Visit JSS Book House</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
