import React, { useState } from 'react';
import { ArrowRight, BookOpen, ShoppingBag, Check, ShieldCheck, Truck, Award } from 'lucide-react';
import jssLogo from '../assets/jss-logo.webp';

const SHOWCASE_BOOKS = [
  {
    id: 3,
    slug: 'patanjali-yoga-sutras',
    title: 'Patanjali Yoga Sutras',
    titleKannada: 'ಪಾತಂಜಲ ಯೋಗ ಸೂತ್ರಗಳು',
    author: 'P. S. Chandrashekar',
    category: 'Spirituality & Yoga',
    price: 350,
    binding: 'Paperback',
    pages: 412,
    badge: 'Bestseller',
    shortDescription: 'Definitive translation and critical commentary on classical aphorisms of Yoga with word-by-word Sanskrit analysis.',
    webpImage: '/patanjali-yoga-sutras/cover.webp'
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
    pages: 896,
    badge: 'Monumental Work',
    shortDescription: 'Monumental encyclopedic lexicon of Veerashaiva-Lingayat religious terminologies, Shaiva Agamas, and Vachana traditions.',
    webpImage: '/shivapada-ratnakosha/cover.webp'
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
    pages: 360,
    badge: 'Canonical Text',
    shortDescription: 'Anthology of quintessential 12th-century Sharana verses critically edited with authentic palm-leaf readings.',
    webpImage: '/sharanara-vachanagalu/cover.webp'
  }
];

export default function HeroEditorial({
  onNavigate,
  onInspectBook,
  onAddToCart,
  cart = []
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const activeBook = SHOWCASE_BOOKS[activeIndex];
  const isAdded = cart.some(item => item.id === activeBook.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    if (onAddToCart) onAddToCart(activeBook);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleOpenProduct = () => {
    if (onNavigate) {
      onNavigate(`/books/${activeBook.slug || activeBook.id}`);
    }
  };

  return (
    <section className="editorial-hero" aria-label="JSS Publications Introduction">
      {/* Subtle Gold Accent Trim */}
      <div className="hero-gold-top-trim" aria-hidden="true" />

      <div className="container">
        <div className="editorial-hero-grid">
          {/* LEFT: Institutional Authority, Headline, Actions & Trust */}
          <div className="hero-editorial-left">
            {/* Publisher Brand Pill */}
            <div className="hero-publisher-brand">
              <img
                src={jssLogo}
                alt="JSS Publications Emblem"
                className="hero-brand-logo"
              />
              <div className="hero-brand-details">
                <span className="hero-brand-kicker">
                  JSS Mahavidyapeetha · Mysuru · Estd. 1954
                </span>
                <span className="hero-brand-title">
                  JAGADGURU SRI SHIVARATHREESHWARA GRANTHAMALE
                </span>
              </div>
            </div>

            {/* Regal Editorial Headline */}
            <h1 className="hero-grand-title text-serif">
              Sacred Vachana Literature, Agamas & Indian Philosophy
            </h1>

            {/* Kannada Sacred Subtitle */}
            <p className="hero-kannada-subtitle text-kannada">
              ವಚನ ಸಾಹಿತ್ಯ, ಶೈವಾಗಮ, ಭಾರತೀಯ ತತ್ವಶಾಸ್ತ್ರ ಹಾಗೂ ಜ್ಞಾನ ಪರಂಪರೆಯ ಅಧಿಕೃತ ಉದ್ಗ್ರಂಥಗಳು
            </p>

            {/* Factual Concise Description */}
            <p className="hero-lead-narrative">
              Preserving centuries of sacred palm-leaf manuscripts and publishing authoritative scholarly works, translations, and commentaries at non-profit subsidized prices for readers worldwide.
            </p>

            {/* Primary Navigation Actions */}
            <div className="hero-action-buttons">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/books')}
                className="btn btn-primary hero-btn-main"
              >
                <span>Explore Full Catalogue (49)</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/categories')}
                className="btn btn-outline hero-btn-sub"
              >
                <span>Browse Categories</span>
              </button>
            </div>

            {/* Institutional Trust Highlights */}
            <div className="hero-trust-bar">
              <div className="hero-trust-point">
                <Award size={15} color="var(--color-maroon)" />
                <span>Subsidized Non-Profit Editions</span>
              </div>
              <span className="hero-trust-sep" aria-hidden="true">·</span>
              <div className="hero-trust-point">
                <ShieldCheck size={15} color="var(--color-maroon)" />
                <span>0% GST (Govt. Exempt)</span>
              </div>
              <span className="hero-trust-sep" aria-hidden="true">·</span>
              <div className="hero-trust-point">
                <Truck size={15} color="var(--color-maroon)" />
                <span>India Post Direct Dispatch</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Featured Book Showcase (Like Earlier, with Clean Modern Styling) */}
          <div className="hero-editorial-right">
            <div className="hero-book-showcase-card">
              {/* Card Header with Volume / Edition Switchers */}
              <div className="hero-book-card-header">
                <div className="hero-book-badge-wrap">
                  <span className="hero-book-kicker">FEATURED PUBLICATION</span>
                  <span className="hero-book-badge">{activeBook.badge}</span>
                </div>

                <div className="hero-book-selectors" role="tablist" aria-label="Select Featured Book">
                  {SHOWCASE_BOOKS.map((b, i) => (
                    <button
                      key={b.id}
                      type="button"
                      role="tab"
                      aria-selected={i === activeIndex}
                      onClick={() => setActiveIndex(i)}
                      className={`hero-book-tab ${i === activeIndex ? 'active' : ''}`}
                      title={b.title}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Presentation: Square Cover Canvas + Meta */}
              <div className="hero-book-body">
                {/* Book Cover Frame (Square-Oriented) */}
                <div
                  className="hero-book-cover-frame"
                  onClick={handleOpenProduct}
                  title={`View details for ${activeBook.title}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleOpenProduct(); }}
                >
                  <img
                    src={activeBook.webpImage}
                    alt={`Cover of ${activeBook.title}`}
                    loading="eager"
                    className="hero-book-cover-img"
                  />
                  <div className="hero-book-hover-tag">
                    <BookOpen size={12} />
                    <span>View Book</span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="hero-book-info">
                  <span className="hero-book-category">
                    {activeBook.category}
                  </span>

                  <h2
                    className="hero-book-title text-serif"
                    onClick={handleOpenProduct}
                    title={activeBook.title}
                  >
                    {activeBook.title}
                  </h2>

                  <span className="hero-book-kannada text-kannada">
                    {activeBook.titleKannada}
                  </span>

                  <p className="hero-book-author">
                    <strong>Author:</strong> {activeBook.author}
                  </p>

                  <p className="hero-book-desc">
                    {activeBook.shortDescription}
                  </p>

                  {/* Pricing & GST Meta */}
                  <div className="hero-book-pricing">
                    <span className="hero-book-price">
                      ₹{activeBook.price}
                    </span>
                    <span className="hero-book-gst">
                      0% GST (Exempt)
                    </span>
                    <span className="hero-book-pages">
                      · {activeBook.binding} · {activeBook.pages} pp
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="hero-book-actions">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onInspectBook) onInspectBook(activeBook);
                      }}
                      className="btn btn-outline btn-sm hero-book-btn-preview"
                      title="Read preview and sample excerpt"
                    >
                      <BookOpen size={13} color="var(--color-maroon)" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAdd}
                      className={`btn btn-sm hero-book-btn-add ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
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
      </div>
    </section>
  );
}
