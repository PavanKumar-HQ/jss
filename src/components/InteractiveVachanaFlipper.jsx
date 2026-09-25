import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, Feather, Bookmark, Check } from 'lucide-react';

const VACHANAS = [
  {
    id: 1,
    author: 'Basaveshwara (ಬಸವಣ್ಣ)',
    authorKannada: 'ಶ್ರೀ ಜಗದ್ಜ್ಯೋತಿ ಬಸವೇಶ್ವರರು',
    title: 'The Body is the Temple',
    titleKannada: 'ಕಾಯವೇ ಕೈಲಾಸ',
    kannada: `ಉಳ್ಳವರು ಶಿವಾಲಯ ಮಾಡುವರು, ನಾನೇನ ಮಾಡುವೆ ಬಡವನಯ್ಯಾ?
ಎನ್ನ ಕಾಲೇ ಕಂಬ, ದೇಹವೇ ದೇಗುಲ, ಶಿರವೇ ಹೊನ್ನ ಕಳಶವಯ್ಯಾ!
ಕೂಡಲಸಂಗಮದೇವಾ ಕೇಳಯ್ಯಾ,
ಸ್ಥಾವರಕ್ಕಳಿವುಂಟು, ಜಂಗಮಕ್ಕಳಿವಿಲ್ಲ!`,
    translation: `The rich will make temples for Shiva.
What shall I, a poor man, do?
My legs are pillars, the body the shrine,
The head a cupola of gold!
Listen, O Lord of the Meeting Rivers,
Things standing shall fall,
But the moving shall ever stay!`,
    commentary: 'Critically edited from 12th-century palm-leaf manuscripts preserved in the Sri Suttur Math archives.',
    sourceBook: 'Sharanara Vachanagalu · JSS Publications',
    bookId: 7
  },
  {
    id: 2,
    author: 'Allama Prabhu (ಅಲ್ಲಮಪ್ರಭು)',
    authorKannada: 'ಅಲ್ಲಮಪ್ರಭುದೇವರು',
    title: 'The Fire Within Stone',
    titleKannada: 'ಕಲ್ಲೊಳಗಣ ಕಿಚ್ಚು',
    kannada: `ಕಲ್ಲೊಳಗಣ ಕಿಚ್ಚು ಕಲ್ಲಿಗೆ ಸುಡಲಿಲ್ಲ!
ಹಾಲೊಳಗಣ ತುಪ್ಪ ಹಾಲಿಗೆ ಕೆಡಲಿಲ್ಲ!
ಕಾಯದೊಳಗಣ ಚೈತನ್ಯ ಕಾಯಕ್ಕೆ ಸೋಂಕಲಿಲ್ಲ!
ಗುಹೇಶ್ವರಾ, ನಿಮ್ಮ ನಿಲವನು ಅರಿವರಾರೊ?`,
    translation: `The fire within the stone does not burn the stone!
The butter within the milk does not spoil the milk!
The consciousness within the body is untouched by the body!
O Guheshwara, who can truly know the depth of Your divine reality?`,
    commentary: 'Canonical edition with word-by-word philosophical glossaries under the guidance of Suttur Pontiffs.',
    sourceBook: 'Allama Prabhu Devara Vachana · JSS Publications',
    bookId: 2
  },
  {
    id: 3,
    author: 'Akka Mahadevi (ಅಕ್ಕಮಹಾದೇವಿ)',
    authorKannada: 'ವೈರಾಗ್ಯನಿಧಿ ಅಕ್ಕಮಹಾದೇವಿ',
    title: 'Dwelling on the Mountain',
    titleKannada: 'ಬೆಟ್ಟದ ಮೇಲೊಂದು ಮನೆಯ ಮಾಡಿ',
    kannada: `ಬೆಟ್ಟದ ಮೇಲೊಂದು ಮನೆಯ ಮಾಡಿ, ಮೃಗಂಗಳಿಗೆ ಅಂಜಿದಡೆಂತಯ್ಯಾ?
ಸಮುದ್ರದ ತೀರದಲ್ಲಿ ಮನೆಯ ಮಾಡಿ, ನೊರೆತೆರೆಗಳಿಗೆ ಅಂಜಿದಡೆಂತಯ್ಯಾ?
ಸಂತೆಯೊಳಗೊಂದು ಮನೆಯ ಮಾಡಿ, ಶಬ್ದಕ್ಕೆ ನಾಚಿದಡೆಂತಯ್ಯಾ?
ಚೆನ್ನಮಲ್ಲಿಕಾರ್ಜುನದೇವ ಕೇಳಯ್ಯಾ,
ಲೋಕದೊಳಗೆ ಹುಟ್ಟಿದ ಬಳಿಕ ಸ್ತುತಿ-ನಿಂದೆಗಳು ಬಂದರೆ ಸೈರಿಸಿರಬೇಕು!`,
    translation: `Having made a home upon the mountain, should one fear wild beasts?
Having made a home upon the ocean shore, should one fear foaming waves?
Having made a home inside the market-square, should one be ashamed of clamour?
Listen, O Lord White as Jasmine,
Having taken birth in this mortal world, one must bear both praise and blame with fortitude!`,
    commentary: 'Vachana series preserving authentic female Sharana voices in definitive Kannada critical typography.',
    sourceBook: 'Akka Mahadevi · JSS Publications',
    bookId: 20
  }
];

export default function InteractiveVachanaFlipper({ onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeMobileTab, setActiveMobileTab] = useState('kannada'); // 'kannada' | 'english'
  const [isAnimating, setIsAnimating] = useState(false);

  const currentVachana = VACHANAS[currentIndex];

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % VACHANAS.length);
      setIsAnimating(false);
    }, 280);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + VACHANAS.length) % VACHANAS.length);
      setIsAnimating(false);
    }, 280);
  };

  const handleExploreBook = () => {
    if (onNavigate) {
      if (currentVachana.bookId) {
        onNavigate(`/books/${currentVachana.bookId}`);
      } else {
        onNavigate('/books');
      }
    }
  };

  return (
    <section className="vachana-flipper-section reveal-on-scroll" aria-label="Sacred Vachana Treasury">
      <div className="container">
        {/* Section Header */}
        <div className="vachana-section-header">
          <div className="vachana-eyebrow-chip">
            <Sparkles size={14} color="#C59B27" />
            <span>Sacred Vachana Treasury · ಶರಣರ ಅಮೃತವಾಣಿ</span>
          </div>

          <h2 className="vachana-section-title text-serif">
            EXPLORE THE CLASSICAL MANUSCRIPTS
          </h2>

          <p className="vachana-section-sub text-kannada">
            ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆಯ ಉದ್ಗ್ರಂಥಗಳಿಂದ ಆಯ್ದ ಅಮೂಲ್ಯ ವಚನಗಳು
          </p>

          <p className="vachana-section-desc">
            Authentic 12th-century verses critically edited from palm-leaf manuscripts preserved at Sri Suttur Math archives.
          </p>
        </div>

        {/* Mobile Tab Switcher: Kannada / English */}
        <div className="vachana-mobile-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeMobileTab === 'kannada'}
            onClick={() => setActiveMobileTab('kannada')}
            className={`vachana-mobile-tab-btn ${activeMobileTab === 'kannada' ? 'active' : ''}`}
          >
            <Feather size={14} />
            <span>ಕನ್ನಡ ಮೂಲ (Original)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeMobileTab === 'english'}
            onClick={() => setActiveMobileTab('english')}
            className={`vachana-mobile-tab-btn ${activeMobileTab === 'english' ? 'active' : ''}`}
          >
            <BookOpen size={14} />
            <span>English Translation</span>
          </button>
        </div>

        {/* Manuscript Stage Container */}
        <div className="manuscript-stage">
          <div className={`manuscript-book-frame ${isAnimating ? 'animating-page' : ''}`}>
            {/* LEFT LEAF: Kannada Script Original */}
            <div className={`manuscript-leaf manuscript-leaf-left ${activeMobileTab === 'kannada' ? 'mobile-show' : 'mobile-hide'}`}>
              <div className="leaf-inner-frame">
                {/* Header */}
                <div className="leaf-header">
                  <div className="leaf-author-tag">
                    <Feather size={14} color="var(--color-maroon)" />
                    <span className="text-kannada">{currentVachana.authorKannada}</span>
                  </div>
                  <span className="leaf-folio-number text-serif">ಪತ್ರ {currentIndex + 1}</span>
                </div>

                {/* Body Content */}
                <div className="leaf-body">
                  <h3 className="leaf-title-kannada text-kannada">
                    {currentVachana.titleKannada}
                  </h3>
                  <span className="leaf-title-english text-serif">
                    {currentVachana.title}
                  </span>

                  <div className="kannada-verse-block text-kannada">
                    {currentVachana.kannada.split('\n').map((line, idx) => (
                      <p key={idx} className="verse-line">{line}</p>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="leaf-footer">
                  <span className="leaf-source-label">
                    {currentVachana.sourceBook}
                  </span>
                  <span className="leaf-sacred-seal text-kannada">
                    ❖ ಶ್ರೀ ಗುರುಬಸವಲಿಂಗಾಯ ನಮಃ
                  </span>
                </div>
              </div>
            </div>

            {/* Book Spine Crease Divider (Desktop Only) */}
            <div className="manuscript-center-crease" aria-hidden="true" />

            {/* RIGHT LEAF: English Translation & Publishing Commentary */}
            <div className={`manuscript-leaf manuscript-leaf-right ${activeMobileTab === 'english' ? 'mobile-show' : 'mobile-hide'}`}>
              <div className="leaf-inner-frame">
                {/* Header */}
                <div className="leaf-header">
                  <div className="leaf-author-tag">
                    <BookOpen size={14} color="var(--color-maroon)" />
                    <span>{currentVachana.author}</span>
                  </div>
                  <span className="leaf-folio-number text-serif">Folio {currentIndex + 1}</span>
                </div>

                {/* Body Content */}
                <div className="leaf-body">
                  <div className="english-translation-block">
                    {currentVachana.translation.split('\n').map((line, idx) => (
                      <p key={idx} className="translation-line">{line}</p>
                    ))}
                  </div>

                  {/* Scholarly Commentary Box */}
                  <div className="scholarly-note-box">
                    <strong className="scholarly-note-heading">
                      Critical Edition · JSS Granthamale
                    </strong>
                    <p className="scholarly-note-text">
                      {currentVachana.commentary}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="leaf-footer leaf-footer-right">
                  <span className="gst-badge-inline">
                    0% GST · In Print
                  </span>

                  <button
                    type="button"
                    onClick={handleExploreBook}
                    className="btn btn-outline btn-sm leaf-action-btn"
                  >
                    <span>View Edition in Bookstore</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Interactive Controls */}
          <div className="manuscript-controls-row">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isAnimating}
              className="btn btn-secondary btn-sm manuscript-nav-btn"
              title="Previous Verse"
            >
              <ArrowLeft size={15} />
              <span>Previous Verse (ಹಿಂದಿನ ಪತ್ರ)</span>
            </button>

            {/* Pagination Dots */}
            <div className="manuscript-pagination-pills">
              <span className="manuscript-count-label">
                Verse {currentIndex + 1} of {VACHANAS.length}
              </span>
              <div className="manuscript-dot-track">
                {VACHANAS.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-label={`Jump to ${v.title}`}
                    className={`manuscript-dot-btn ${i === currentIndex ? 'active' : ''}`}
                    onClick={() => {
                      if (!isAnimating) setCurrentIndex(i);
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={isAnimating}
              className="btn btn-primary btn-sm manuscript-nav-btn"
              title="Next Verse"
            >
              <span>Next Verse (ಮುಂದಿನ ಪತ್ರ)</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
