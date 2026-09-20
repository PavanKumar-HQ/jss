import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Quote, ArrowRight, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function HeroParallax({ activeCategory, setActiveCategory, languageMode, onNavigate, onInspectBook }) {
  // Flagship publications for the interactive 3D hero stage
  const spotlightBooks = [
    {
      id: 1,
      title: "Shivapada Ratnakosha",
      titleKannada: "ಶಿವಪದ ರತ್ನಕೋಶ",
      author: "HH Jagadguru Sri Shivarathri Deshikendra Mahaswamiji (Hon. Editor)",
      category: "Veerashaiva Philosophy",
      pages: 896,
      price: 1000,
      binding: "Deluxe Hardbound Edition",
      image: "/shivapada-ratnakosha/cover.jpg",
      fallbackImage: "https://jssonline.org/wp-content/uploads/2021/11/7_Shivapada_Ratnakosha.jpg",
      quote: "ಶಿವಪದ ರತ್ನಕೋಶವು ಶೈವಾಗಮ, ವಚನ ಸಾಹಿತ್ಯ ಮತ್ತು ವೀರಶೈವ ಸಿದ್ಧಾಂತದ ಸಮಗ್ರ ಪಾರಿಭಾಷಿಕ ನಿಘಂಟು.",
      quoteAuthor: "Sri Suttur Math Editorial Archives"
    },
    {
      id: 3,
      title: "Patanjali Yoga Sutras",
      titleKannada: "ಪಾತಂಜಲ ಯೋಗ ಸೂತ್ರಗಳು",
      author: "P. S. Chandrashekar",
      category: "Spirituality & Yoga",
      pages: 412,
      price: 350,
      binding: "Scholarly Hardbound Edition",
      image: "/patanjali-yoga-sutras/cover.jpg",
      fallbackImage: "https://jssonline.org/wp-content/uploads/2021/11/Patanjali_Yoga_Sutras.jpg",
      quote: "ಯೋಗಶ್ಚಿತ್ತವೃತ್ತಿನಿರೋಧಃ — The restraint of the fluctuations of the mind is Yoga.",
      quoteAuthor: "Maharshi Patanjali • Classical Exegesis"
    },
    {
      id: 5,
      title: "The Heritage of Sri Suttur Math",
      titleKannada: "ಶ್ರೀ ಸುತ್ತೂರು ಮಠದ ಪರಂಪರೆ",
      author: "Dr. Chidananda Murthy & Editorial Board",
      category: "Biographies & Heritage",
      pages: 520,
      price: 450,
      binding: "Commemorative Library Edition",
      image: "/the-heritage-of-sri-suttur-math/cover.jpg",
      fallbackImage: "https://jssonline.org/wp-content/uploads/2021/11/Heritage_of_Sri_Suttur_Math.jpg",
      quote: "ಸಾಹಿತ್ಯದ ಮೂಲಕ ಸಾಮಾಜಿಕ ಹಾಗೂ ಧಾರ್ಮಿಕ ಜಾಗೃತಿ — Social transformation through literature.",
      quoteAuthor: "Mantra Maharshi His Holiness Sri Shivarathri Mahaswamiji"
    },
    {
      id: 7,
      title: "Sharanara Vachanagalu",
      titleKannada: "ಶರಣರ ವಚನಗಳು",
      author: "Dr. Jayashree (Editor)",
      category: "Vachana Literature",
      pages: 368,
      price: 220,
      binding: "Canonical Paperback Edition",
      image: "/sharanara-vachanagalu/cover.jpg",
      fallbackImage: "https://jssonline.org/wp-content/uploads/2021/11/Sharanara_Vachanagalu.jpg",
      quote: "ನುಡಿದರೆ ಮುತ್ತಿನ ಹಾರದಂತಿರಬೇಕು, ನುಡಿದರೆ ಮಾಣಿಕ್ಯದ ದೀಪ್ತಿಯಂತಿರಬೇಕು — Words should be like a garland of pearls.",
      quoteAuthor: "Jagajyothi Basavanna • 12th Century Vachana"
    }
  ];

  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [slideAnimation, setSlideAnimation] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentSpotlight = spotlightBooks[activeSpotlightIndex];

  // Auto-advance hero carousel every 6 seconds with animated progress
  useEffect(() => {
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, 120);

    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
    };
  }, [activeSpotlightIndex]);

  const handleNext = () => {
    setSlideAnimation(true);
    setImgError(false);
    setActiveSpotlightIndex((prev) => (prev + 1) % spotlightBooks.length);
    setTimeout(() => setSlideAnimation(false), 300);
  };

  const handlePrev = () => {
    setSlideAnimation(true);
    setImgError(false);
    setActiveSpotlightIndex((prev) => (prev - 1 + spotlightBooks.length) % spotlightBooks.length);
    setTimeout(() => setSlideAnimation(false), 300);
  };

  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%234A0E17"/><rect x="12" y="12" width="276" height="396" fill="none" stroke="%23E5C368" stroke-width="2"/><text x="50%" y="42%" fill="%23FFFFFF" font-size="20" font-family="serif" text-anchor="middle" font-weight="bold">${encodeURIComponent(currentSpotlight.title)}</text><text x="50%" y="52%" fill="%23E5C368" font-size="13" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(currentSpotlight.category)}</text><text x="50%" y="82%" fill="%23D6CCA8" font-size="11" font-family="serif" text-anchor="middle">JSS PUBLICATIONS</text></svg>`;

  const imageSource = imgError
    ? (currentSpotlight.fallbackImage || fallbackSvg)
    : (currentSpotlight.image || currentSpotlight.fallbackImage || fallbackSvg);

  return (
    <div className="hero-unique-wrapper" style={{ padding: '16px 0 28px' }}>
      <div className="container">
        <section
          className="hero-royal-stage"
          aria-label="JSS Publications Heritage Showcase"
          style={{
            background: 'radial-gradient(ellipse at 80% 35%, #5E1624 0%, #34070E 45%, #1C0206 100%)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(229, 195, 104, 0.35)',
            boxShadow: '0 18px 48px rgba(28, 2, 6, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            padding: 'clamp(28px, 4.5vw, 52px)'
          }}
        >
          {/* Subtle Traditional Gold Watermark Lighting */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(229, 195, 104, 0.14) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '30px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* LEFT COLUMN: LITERARY HERITAGE & EDITORIAL STATEMENTS (NO AI STARS) */}
            <div>
              {/* Monastic Lineage Pill — NO AI SPARKLE LOGO */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(229, 195, 104, 0.12)',
                  border: '1px solid rgba(229, 195, 104, 0.35)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '5px 14px',
                  marginBottom: '14px',
                  maxWidth: '100%'
                }}
              >
                <Award size={13} color="#E5C368" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 'clamp(0.7rem, 2.2vw, 0.78rem)', fontWeight: 700, letterSpacing: '0.6px', color: '#E5C368', textTransform: 'uppercase' }}>
                  {languageMode === 'kn'
                    ? 'ಶ್ರೀ ಸುತ್ತೂರು ವೀರಸಿಂಹಾಸನ ಸಂಸ್ಥಾನ ಮಠ • ಪ್ರಕಾಶನ ವಿಭಾಗ'
                    : 'Sri Suttur Math Heritage • Est. 10th Century CE'}
                </span>
              </div>

              {/* Majestic Editorial Headline */}
              <h1
                className="text-serif"
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1.18,
                  marginBottom: '14px',
                  letterSpacing: '-0.3px'
                }}
              >
                {languageMode === 'kn' ? (
                  <>
                    ವಚನ ಧರ್ಮ ಹಾಗೂ ಭಾರತೀಯ ತತ್ತ್ವಶಾಸ್ತ್ರದ <span style={{ color: '#E5C368', fontStyle: 'italic' }}>ಮಹೋನ್ನತ ಗ್ರಂಥಮಾಲೆ</span>
                  </>
                ) : (
                  <>
                    Centuries of Sharana Wisdom, Bound with <span style={{ color: '#E5C368', fontStyle: 'italic' }}>Scholarly Reverence</span>
                  </>
                )}
              </h1>

              {/* Dynamic Vachana Excerpt Spotlight Card */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  borderLeft: '3px solid #E5C368',
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                  padding: '14px 18px',
                  marginBottom: '22px',
                  backdropFilter: 'blur(6px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Quote size={13} color="#E5C368" />
                  <span style={{ fontSize: '0.72rem', color: '#E5C368', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>
                    Manuscript Reflection
                  </span>
                </div>
                <p className="text-kannada" style={{ fontSize: '1.02rem', color: '#FBF8F2', lineHeight: 1.55, fontWeight: 500, marginBottom: '4px' }}>
                  "{currentSpotlight.quote}"
                </p>
                <span style={{ fontSize: '0.76rem', color: '#D6CCA8', display: 'block' }}>
                  — {currentSpotlight.quoteAuthor}
                </span>
              </div>

              {/* Primary Call to Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('/books')}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#E5C368',
                    color: '#230408',
                    borderColor: '#E5C368',
                    fontWeight: 700,
                    padding: '11px 24px',
                    borderRadius: 'var(--radius-pill)',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(229, 195, 104, 0.3)'
                  }}
                >
                  <BookOpen size={16} />
                  <span>Browse 49 Published Folios</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('/bulk-orders')}
                  className="btn btn-outline"
                  style={{
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.35)',
                    padding: '11px 20px',
                    borderRadius: 'var(--radius-pill)'
                  }}
                >
                  <span>Institutional Indents</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: 3D TACTILE BOOK SHOWCASE WITH NEXT/PREV CONTROLS & GUARANTEED VISIBILITY */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              <div
                className="hero-spotlight-card"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(229, 195, 104, 0.35)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px 20px',
                  maxWidth: '390px',
                  width: '100%',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* Gold Archival Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#B84E1A',
                    color: '#FFFFFF',
                    padding: '3px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Featured Volume ({activeSpotlightIndex + 1} of {spotlightBooks.length})
                </div>

                {/* Carousel Stage: Left Arrow + 3D Book + Right Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '14px 0 16px' }}>
                  {/* Previous Arrow Button */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(229, 195, 104, 0.4)',
                      color: '#FAF7F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E5C368';
                      e.currentTarget.style.color = '#230408';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.color = '#FAF7F2';
                    }}
                    title="Previous Featured Publication"
                    aria-label="Previous Featured Publication"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* 3D Book Stage */}
                  <div
                    style={{
                      width: '180px',
                      height: '255px',
                      perspective: '800px',
                      cursor: 'pointer',
                      opacity: slideAnimation ? 0.7 : 1,
                      transform: slideAnimation ? 'scale(0.95)' : 'scale(1)',
                      transition: 'opacity 0.25s ease, transform 0.25s ease'
                    }}
                    onClick={() => onInspectBook && onInspectBook(currentSpotlight)}
                    title="Click to peek inside this monumental volume"
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '4px 10px 10px 4px',
                        overflow: 'hidden',
                        boxShadow: '-8px 12px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(229,195,104,0.4)',
                        backgroundColor: '#4A0E17',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <img
                        key={currentSpotlight.id}
                        src={imageSource}
                        alt={currentSpotlight.title}
                        onError={() => setImgError(true)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>

                  {/* Next Arrow Button */}
                  <button
                    type="button"
                    onClick={handleNext}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(229, 195, 104, 0.4)',
                      color: '#FAF7F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E5C368';
                      e.currentTarget.style.color = '#230408';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.color = '#FAF7F2';
                    }}
                    title="Next Featured Publication"
                    aria-label="Next Featured Publication"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Progress Bar for Auto-Advance */}
                <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '2px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#E5C368', transition: 'width 0.12s linear' }} />
                </div>

                {/* Book Title & Kannada Script */}
                <h3 className="text-serif" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px' }}>
                  {currentSpotlight.title}
                </h3>
                <span className="text-kannada" style={{ fontSize: '0.92rem', color: '#E5C368', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  {currentSpotlight.titleKannada}
                </span>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.78rem', color: '#D6CCA8', marginBottom: '14px' }}>
                  <span>{currentSpotlight.pages} Pages</span>
                  <span>•</span>
                  <span>₹{currentSpotlight.price}</span>
                  <span>•</span>
                  <span>{currentSpotlight.binding}</span>
                </div>

                {/* Action Buttons for Spotlight Book */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => onInspectBook && onInspectBook(currentSpotlight)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      color: '#FFFFFF',
                      borderColor: 'rgba(229, 195, 104, 0.45)',
                      borderRadius: 'var(--radius-pill)',
                      gap: '5px',
                      fontSize: '0.8rem',
                      padding: '6px 14px'
                    }}
                  >
                    <Eye size={13} />
                    <span>Peek Inside Folio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate(`/books/${currentSpotlight.id}`)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#E5C368',
                      color: '#230408',
                      borderColor: '#E5C368',
                      borderRadius: 'var(--radius-pill)',
                      fontWeight: 700,
                      gap: '4px',
                      fontSize: '0.8rem',
                      padding: '6px 14px'
                    }}
                  >
                    <span>View Details</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Pagination Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
                  {spotlightBooks.map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setImgError(false);
                        setActiveSpotlightIndex(idx);
                      }}
                      style={{
                        width: idx === activeSpotlightIndex ? '22px' : '7px',
                        height: '7px',
                        borderRadius: '4px',
                        backgroundColor: idx === activeSpotlightIndex ? '#E5C368' : 'rgba(255, 255, 255, 0.25)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.2s ease'
                      }}
                      title={`Switch to ${b.title}`}
                      aria-label={`Switch to ${b.title}`}
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* BASE RIBBON: FOUR PRESTIGIOUS INSTITUTIONAL STATISTICS */}
          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(229, 195, 104, 0.2)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '14px'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#E5C368', fontFamily: 'var(--font-serif-brand)', display: 'block' }}>
                100+
              </span>
              <span style={{ fontSize: '0.78rem', color: '#D6CCA8' }}>
                Rare Published Titles
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#E5C368', fontFamily: 'var(--font-serif-brand)', display: 'block' }}>
                69+ Volumes
              </span>
              <span style={{ fontSize: '0.78rem', color: '#D6CCA8' }}>
                Sharana Samskruti Monographs
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#E5C368', fontFamily: 'var(--font-serif-brand)', display: 'block' }}>
                350+ Institutions
              </span>
              <span style={{ fontSize: '0.78rem', color: '#D6CCA8' }}>
                Global Educational Reach
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#E5C368', fontFamily: 'var(--font-serif-brand)', display: 'block' }}>
                0% GST Exempt
              </span>
              <span style={{ fontSize: '0.78rem', color: '#D6CCA8' }}>
                Pan-India Postal Consignments
              </span>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
