import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, Feather } from 'lucide-react';

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
  const [targetIndex, setTargetIndex] = useState(0);
  const [flipState, setFlipState] = useState('idle'); // 'idle' | 'flipping-next' | 'flipping-prev'
  const [activeMobileTab, setActiveMobileTab] = useState('kannada'); // 'kannada' | 'english'

  const currentVachana = VACHANAS[currentIndex];
  const targetVachana = VACHANAS[targetIndex];

  const handleNext = () => {
    if (flipState !== 'idle') return;
    const next = (currentIndex + 1) % VACHANAS.length;
    setTargetIndex(next);
    setFlipState('flipping-next');

    setTimeout(() => {
      setCurrentIndex(next);
      setFlipState('idle');
    }, 650);
  };

  const handlePrev = () => {
    if (flipState !== 'idle') return;
    const prev = (currentIndex - 1 + VACHANAS.length) % VACHANAS.length;
    setTargetIndex(prev);
    setFlipState('flipping-prev');

    setTimeout(() => {
      setCurrentIndex(prev);
      setFlipState('idle');
    }, 650);
  };

  const handleExploreBook = (bookId) => {
    if (onNavigate) {
      if (bookId) {
        onNavigate(`/books/${bookId}`);
      } else {
        onNavigate('/books');
      }
    }
  };

  // Render Kannada Page Leaf
  const renderKannadaContent = (vachana, pageNum) => (
    <div className="leaf-inner-frame">
      <div className="leaf-header">
        <div className="leaf-author-tag">
          <Feather size={14} color="var(--color-maroon)" />
          <span className="text-kannada">{vachana.authorKannada}</span>
        </div>
        <span className="leaf-folio-number text-serif">ಪತ್ರ {pageNum}</span>
      </div>

      <div className="leaf-body">
        <h3 className="leaf-title-kannada text-kannada">
          {vachana.titleKannada}
        </h3>
        <span className="leaf-title-english text-serif">
          {vachana.title}
        </span>

        <div className="kannada-verse-block text-kannada">
          {vachana.kannada.split('\n').map((line, idx) => (
            <p key={idx} className="verse-line">{line}</p>
          ))}
        </div>
      </div>

      <div className="leaf-footer">
        <span className="leaf-source-label">
          {vachana.sourceBook}
        </span>
        <span className="leaf-sacred-seal text-kannada">
          ❖ ಶ್ರೀ ಗುರುಬಸವಲಿಂಗಾಯ ನಮಃ
        </span>
      </div>
    </div>
  );

  // Render English Translation Leaf
  const renderEnglishContent = (vachana, folioNum) => (
    <div className="leaf-inner-frame">
      <div className="leaf-header">
        <div className="leaf-author-tag">
          <BookOpen size={14} color="var(--color-maroon)" />
          <span>{vachana.author}</span>
        </div>
        <span className="leaf-folio-number text-serif">Folio {folioNum}</span>
      </div>

      <div className="leaf-body">
        <div className="english-translation-block">
          {vachana.translation.split('\n').map((line, idx) => (
            <p key={idx} className="translation-line">{line}</p>
          ))}
        </div>

        <div className="scholarly-note-box">
          <strong className="scholarly-note-heading">
            Critical Edition · JSS Granthamale
          </strong>
          <p className="scholarly-note-text">
            {vachana.commentary}
          </p>
        </div>
      </div>

      <div className="leaf-footer leaf-footer-right">
        <span className="gst-badge-inline">
          0% GST · In Print
        </span>

        <button
          type="button"
          onClick={() => handleExploreBook(vachana.bookId)}
          className="btn btn-outline btn-sm leaf-action-btn"
        >
          <span>View Edition in Bookstore</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );

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
            Turn the parchment leaves to explore authentic 12th-century verses critically edited from palm-leaf manuscripts.
          </p>
        </div>

        {/* Mobile Tab Switcher */}
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

        {/* 3D Real Book Stage */}
        <div className="manuscript-stage">
          {/* Desktop Real 3D Book Frame */}
          <div className={`manuscript-book-frame ${flipState}`}>
            {/* Base Left Page (Underneath) */}
            <div className="manuscript-leaf manuscript-leaf-left base-left">
              {renderKannadaContent(
                flipState === 'flipping-next' ? currentVachana : targetVachana,
                (flipState === 'flipping-next' ? currentIndex : targetIndex) + 1
              )}
            </div>

            {/* Book Spine Crease Divider */}
            <div className="manuscript-center-crease" aria-hidden="true" />

            {/* Base Right Page (Underneath) */}
            <div className="manuscript-leaf manuscript-leaf-right base-right">
              {renderEnglishContent(
                flipState === 'flipping-prev' ? currentVachana : targetVachana,
                (flipState === 'flipping-prev' ? currentIndex : targetIndex) + 1
              )}
            </div>

            {/* 3D Flipping Leaf (NEXT Turn: Peels from Right to Left) */}
            {flipState === 'flipping-next' && (
              <div className="flipper-leaf flip-next-leaf">
                {/* Front of flipping leaf (Current English page turning away) */}
                <div className="flipper-face flipper-face-front">
                  {renderEnglishContent(currentVachana, currentIndex + 1)}
                  <div className="flipper-shadow flipper-shadow-front" />
                </div>

                {/* Back of flipping leaf (Next Kannada page landing on left) */}
                <div className="flipper-face flipper-face-back">
                  {renderKannadaContent(targetVachana, targetIndex + 1)}
                  <div className="flipper-shadow flipper-shadow-back" />
                </div>
              </div>
            )}

            {/* 3D Flipping Leaf (PREV Turn: Peels from Left to Right) */}
            {flipState === 'flipping-prev' && (
              <div className="flipper-leaf flip-prev-leaf">
                {/* Front of flipping leaf (Current Kannada page turning away) */}
                <div className="flipper-face flipper-face-front">
                  {renderKannadaContent(currentVachana, currentIndex + 1)}
                  <div className="flipper-shadow flipper-shadow-front" />
                </div>

                {/* Back of flipping leaf (Target English page landing on right) */}
                <div className="flipper-face flipper-face-back">
                  {renderEnglishContent(targetVachana, targetIndex + 1)}
                  <div className="flipper-shadow flipper-shadow-back" />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Single Leaf View */}
          <div className="manuscript-mobile-card">
            <div className={`mobile-leaf-container ${flipState !== 'idle' ? 'mobile-flipping' : ''}`}>
              {activeMobileTab === 'kannada'
                ? renderKannadaContent(currentVachana, currentIndex + 1)
                : renderEnglishContent(currentVachana, currentIndex + 1)}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="manuscript-controls-row">
            <button
              type="button"
              onClick={handlePrev}
              disabled={flipState !== 'idle'}
              className="btn btn-secondary btn-sm manuscript-nav-btn"
              title="Turn to Previous Leaf"
            >
              <ArrowLeft size={15} />
              <span>Previous Page (ಹಿಂದಿನ ಪತ್ರ)</span>
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
                    aria-label={`Go to verse ${i + 1}`}
                    className={`manuscript-dot-btn ${i === currentIndex ? 'active' : ''}`}
                    onClick={() => {
                      if (flipState === 'idle' && i !== currentIndex) {
                        if (i > currentIndex) {
                          setTargetIndex(i);
                          setFlipState('flipping-next');
                          setTimeout(() => {
                            setCurrentIndex(i);
                            setFlipState('idle');
                          }, 650);
                        } else {
                          setTargetIndex(i);
                          setFlipState('flipping-prev');
                          setTimeout(() => {
                            setCurrentIndex(i);
                            setFlipState('idle');
                          }, 650);
                        }
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={flipState !== 'idle'}
              className="btn btn-primary btn-sm manuscript-nav-btn"
              title="Turn to Next Leaf"
            >
              <span>Next Page (ಮುಂದಿನ ಪತ್ರ)</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
