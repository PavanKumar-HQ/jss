import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  Search,
  BookMarked,
  Award,
  Library
} from 'lucide-react';
import jssLogo from '../assets/jss-logo.webp';

const SPOTLIGHT_BOOKS = [
  {
    id: 3,
    slug: 'patanjali-yoga-sutras',
    title: 'Patanjali Yoga Sutras',
    titleKannada: 'ಪಾತಂಜಲ ಯೋಗ ಸೂತ್ರಗಳು',
    author: 'P. S. Chandrashekar',
    category: 'Spirituality & Yoga',
    price: 350,
    binding: 'Paperback',
    language: 'English & Sanskrit',
    pages: 412,
    shortDescription: 'Definitive translation and critical commentary on classical aphorisms of Yoga with word-by-word Sanskrit analysis.',
    webpImage: '/patanjali-yoga-sutras/cover.webp',
    editionNote: 'Endowment Series Edition'
  },
  {
    id: 1,
    slug: 'shivapada-ratnakosha',
    title: 'Shivapada Ratnakosha',
    titleKannada: 'ಶಿವಪದ ರತ್ನಕೋಶ',
    author: 'HH Sri Shivarathri Deshikendra Mahaswamiji',
    category: 'Veerashaiva Philosophy',
    price: 1000,
    binding: 'Hardbound Deluxe',
    language: 'English, Sanskrit & Kannada',
    pages: 896,
    shortDescription: 'Monumental descriptive collection of Veerashaiva-Lingayat religious terminologies, Shaiva Agamas, and Vachana sources.',
    webpImage: '/shivapada-ratnakosha/cover.webp',
    editionNote: 'Ten-Year Research Expedition'
  },
  {
    id: 7,
    slug: 'sharanara-vachanagalu',
    title: 'Sharanara Vachanagalu',
    titleKannada: 'ಶರಣರ ವಚನಗಳು',
    author: 'Editorial Board',
    category: 'Vachana Literature',
    price: 200,
    binding: 'Paperback',
    language: 'Kannada',
    pages: 360,
    shortDescription: 'Anthology of quintessential 12th-century Sharana verses critically edited with authentic manuscript readings.',
    webpImage: '/sharanara-vachanagalu/cover.webp',
    editionNote: 'Canonical Sharana Anthology'
  }
];

const POPULAR_TOPICS = [
  { label: 'Vachanas (ವಚನ)', filter: 'Vachana Literature' },
  { label: 'Yoga Sutras', filter: 'Spirituality & Yoga' },
  { label: 'Shaiva Agamas', filter: 'Veerashaiva Philosophy' },
  { label: 'Heritage of Suttur', filter: 'Biographies & Heritage' }
];

export default function HeroEditorial({
  onNavigate,
  onInspectBook,
  onAddToCart,
  cart = []
}) {
  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState(0);
  const [heroSearchInput, setHeroSearchInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const featuredBook = SPOTLIGHT_BOOKS[activeSpotlightIndex];
  const isAdded = cart.some(item => item.id === featuredBook.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    if (onAddToCart) onAddToCart(featuredBook);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleOpenProduct = () => {
    if (onNavigate) {
      onNavigate(`/books/${featuredBook.slug || featuredBook.id}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(`/books?q=${encodeURIComponent(heroSearchInput.trim())}`);
    }
  };

  const handleTopicClick = (category) => {
    if (onNavigate) {
      onNavigate(`/books?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <section className="grand-bookstore-hero" aria-label="JSS Publications Introduction">
      {/* Decorative Gold Filigree Accent Lines */}
      <div className="hero-gold-top-trim" aria-hidden="true" />

      <div className="container">
        <div className="grand-hero-layout">
          {/* LEFT: Institutional Authority, Headline, Search & Discovery */}
          <div className="grand-hero-primary">
            {/* Publisher Seal Medallion */}
            <div className="hero-publisher-seal">
              <div className="hero-seal-logo-wrap">
                <img
                  src={jssLogo}
                  alt="JSS Publications Emblem Logo"
                  className="hero-seal-img"
                />
              </div>
              <div className="hero-seal-text">
                <span className="hero-seal-org">
                  JSS Mahavidyapeetha · Mysuru
                </span>
                <span className="hero-seal-title text-brand">
                  JAGADGURU SRI SHIVARATHREESHWARA GRANTHAMALE
                </span>
                <span className="hero-seal-kannada text-kannada">
                  ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ · ಸ್ಥಾಪನೆ ೧೯೫೪
                </span>
              </div>
            </div>

            {/* Regal Editorial Headline */}
            <h1 className="grand-hero-headline text-serif">
              Canonical Editions of Sacred Vachanas, Philosophy & Classical Heritage
            </h1>

            {/* Kannada Sacred Subtitle */}
            <p className="grand-hero-subtitle text-kannada">
              ವಚನ ಸಾಹಿತ್ಯ, ಶೈವಾಗಮ, ಭಾರತೀಯ ತತ್ವಶಾಸ್ತ್ರ ಹಾಗೂ ಜ್ಞಾನ ಪರಂಪರೆಯ ಅಧಿಕೃತ ಉದ್ಗ್ರಂಥಗಳು
            </p>

            {/* Concise Mission Narrative */}
            <p className="grand-hero-narrative">
              Founded under the holy vision of His Holiness Jagadguru Sri Shivarathri Rajendra Mahaswamiji, preserving rare palm-leaf manuscripts and publishing definitive scholarly treatises at subsidized public prices.
            </p>

            {/* In-Hero Search & Discovery Bar */}
            <form onSubmit={handleSearchSubmit} className="hero-search-container">
              <div className="hero-search-input-wrap">
                <Search size={18} className="hero-search-icon" />
                <input
                  type="text"
                  value={heroSearchInput}
                  onChange={(e) => setHeroSearchInput(e.target.value)}
                  placeholder="Search 49+ publications by title, author, or subject..."
                  className="hero-search-input"
                  aria-label="Search bookstore catalogue"
                />
              </div>
              <button type="submit" className="btn btn-primary hero-search-submit">
                <span>Search Books</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Fast Topic Exploration Pills */}
            <div className="hero-topics-row">
              <span className="hero-topics-label">Explore:</span>
              <div className="hero-topics-list">
                {POPULAR_TOPICS.map((topic) => (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => handleTopicClick(topic.filter)}
                    className="hero-topic-chip"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Curated 3D Book Pedestal Spotlight */}
          <div className="grand-hero-spotlight">
            <div className="spotlight-pedestal-card">
              {/* Spotlight Header with Switcher Tabs */}
              <div className="spotlight-card-header">
                <div className="spotlight-badge-wrap">
                  <span className="spotlight-kicker">SPOTLIGHT PUBLICATION</span>
                  <span className="spotlight-edition-tag">{featuredBook.editionNote}</span>
                </div>

                {/* 1, 2, 3 Selector Pills */}
                <div className="spotlight-selectors" role="tablist" aria-label="Select Featured Volume">
                  {SPOTLIGHT_BOOKS.map((b, i) => (
                    <button
                      key={b.id}
                      type="button"
                      role="tab"
                      aria-selected={i === activeSpotlightIndex}
                      onClick={() => setActiveSpotlightIndex(i)}
                      className={`spotlight-selector-pill ${i === activeSpotlightIndex ? 'active' : ''}`}
                      title={b.title}
                    >
                      <span>Vol {i + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spotlight Main Body: 3D Book Stand & Details */}
              <div className="spotlight-stage-grid">
                {/* 3D Realistic Book Presentation */}
                <div
                  className="spotlight-book-display"
                  onClick={handleOpenProduct}
                  title={`View dedicated page for ${featuredBook.title}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleOpenProduct(); }}
                >
                  <div className="spotlight-book-shadow" />
                  <div className="spotlight-cover-canvas">
                    <img
                      src={featuredBook.webpImage}
                      alt={`Cover of ${featuredBook.title}`}
                      loading="eager"
                      className="spotlight-cover-img"
                    />
                    <div className="spotlight-hover-inspect">
                      <BookOpen size={13} />
                      <span>Inspect Volume</span>
                    </div>
                  </div>
                </div>

                {/* Book Meta & Quick Commerce Actions */}
                <div className="spotlight-meta-pane">
                  <span className="spotlight-category-chip">
                    {featuredBook.category}
                  </span>

                  <h2
                    className="spotlight-book-title text-serif"
                    onClick={handleOpenProduct}
                    title={featuredBook.title}
                  >
                    {featuredBook.title}
                  </h2>

                  <span className="spotlight-kannada-title text-kannada">
                    {featuredBook.titleKannada}
                  </span>

                  <p className="spotlight-author-line">
                    <strong>Author:</strong> {featuredBook.author}
                  </p>

                  <p className="spotlight-brief-desc">
                    {featuredBook.shortDescription}
                  </p>

                  <div className="spotlight-specs-row">
                    <span className="spotlight-price">
                      ₹{featuredBook.price}
                    </span>
                    <span className="spotlight-gst-pill">
                      0% GST Exempt
                    </span>
                    <span className="spotlight-binding">
                      {featuredBook.binding} · {featuredBook.pages} pp
                    </span>
                  </div>

                  <div className="spotlight-actions-row">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onInspectBook) onInspectBook(featuredBook);
                      }}
                      className="btn btn-outline btn-sm spotlight-btn-preview"
                      title="Read preview and sample excerpt"
                    >
                      <BookOpen size={13} color="var(--color-maroon)" />
                      <span>Read Excerpt</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAdd}
                      className={`btn btn-sm spotlight-btn-add ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <span>Adding...</span>
                      ) : isAdded ? (
                        <>
                          <Check size={13} color="var(--color-green)" />
                          <span>In Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={13} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Institutional Hallmarks Ribbon */}
        <div className="hero-hallmarks-strip">
          <div className="hallmark-cell">
            <div className="hallmark-icon-wrap">
              <Award size={18} color="var(--color-maroon)" />
            </div>
            <div>
              <strong className="hallmark-title">Subsidized Non-Profit Rates</strong>
              <span className="hallmark-sub">Preserved as public heritage</span>
            </div>
          </div>

          <div className="hallmark-cell">
            <div className="hallmark-icon-wrap">
              <ShieldCheck size={18} color="var(--color-maroon)" />
            </div>
            <div>
              <strong className="hallmark-title">0% GST on All Books</strong>
              <span className="hallmark-sub">Fully exempt under HSN 4901</span>
            </div>
          </div>

          <div className="hallmark-cell">
            <div className="hallmark-icon-wrap">
              <Truck size={18} color="var(--color-maroon)" />
            </div>
            <div>
              <strong className="hallmark-title">India Post Direct Dispatch</strong>
              <span className="hallmark-sub">Dispatched from Mysuru Book House</span>
            </div>
          </div>

          <div className="hallmark-cell">
            <div className="hallmark-icon-wrap">
              <BookMarked size={18} color="var(--color-maroon)" />
            </div>
            <div>
              <strong className="hallmark-title">Philological Rigour</strong>
              <span className="hallmark-sub">Original palm-leaf manuscript readings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
