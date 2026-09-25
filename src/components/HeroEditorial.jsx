import React, { useState } from 'react';
import { ArrowRight, BookOpen, ShoppingBag, Check, ShieldCheck, Truck, Sparkles, Feather } from 'lucide-react';
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
    shortDescription: 'Classical aphorisms on Yoga with definitive commentary, word-by-word Sanskrit analysis, and English translation.',
    webpImage: '/patanjali-yoga-sutras/cover.webp',
    tag: 'Flagship Edition'
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
    shortDescription: 'Definitive descriptive encyclopedia of Veerashaiva-Lingayat religious terminologies and Shaiva Agamas.',
    webpImage: '/shivapada-ratnakosha/cover.webp',
    tag: 'Monumental Work'
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
    shortDescription: 'Anthology of quintessential 12th-century Sharana verses critically edited with authentic readings.',
    webpImage: '/sharanara-vachanagalu/cover.webp',
    tag: 'Classic Anthology'
  }
];

export default function HeroEditorial({ onNavigate, onInspectBook, onAddToCart, cart = [] }) {
  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState(0);
  const featuredBook = SPOTLIGHT_BOOKS[activeSpotlightIndex];

  const isAdded = cart.some(item => item.id === featuredBook.id);
  const [isAdding, setIsAdding] = useState(false);

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

  return (
    <section className="editorial-hero-section" aria-label="JSS Publications Introduction">
      <div className="container">
        <div className="editorial-hero-grid">
          {/* Left Column: Factual Editorial Introduction */}
          <div className="hero-left-col">
            {/* Publisher Identity Badge with Real Asset Logo */}
            <div className="hero-publisher-badge">
              <div className="hero-logo-frame">
                <img
                  src={jssLogo}
                  alt="JSS Publications Logo Crest"
                  className="hero-publisher-logo"
                />
              </div>
              <div>
                <span className="hero-publisher-name">JSS PUBLICATIONS · MYSURU</span>
                <span className="hero-publisher-kannada">ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ · ಸ್ಥಾಪನೆ ೧೯೫೪</span>
              </div>
            </div>

            {/* Classical Headline */}
            <h1 className="editorial-hero-title">
              Books of Sacred Wisdom,<br />Tradition & Scholarship
            </h1>

            {/* Subtitle */}
            <span className="editorial-hero-subtitle-kn">
              ವಚನ ಸಾಹಿತ್ಯ, ಭಾರತೀಯ ತತ್ವಶಾಸ್ತ್ರ ಹಾಗೂ ಜ್ಞಾನ ಪರಂಪರೆಯ ಉದ್ಗ್ರಂಥಗಳು
            </span>

            {/* Factual Concise Description */}
            <p className="editorial-hero-desc">
              The publishing wing of Jagadguru Sri Shivarathreeshwara Mahavidyapeetha, publishing critical editions of classical Vachana literature, Indian philosophy, and Sanskrit commentaries at subsidized public prices.
            </p>

            {/* Primary Navigation Actions */}
            <div className="editorial-hero-actions">
              <button
                type="button"
                onClick={() => onNavigate('/books')}
                className="btn btn-primary"
                style={{ padding: '11px 22px', gap: '8px', fontSize: '0.92rem' }}
              >
                <span>Explore Full Catalogue (49)</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/categories')}
                className="btn btn-outline"
                style={{ padding: '11px 20px', fontSize: '0.92rem' }}
              >
                <span>Browse Categories</span>
              </button>
            </div>

            {/* Institutional Trust Highlights Strip */}
            <div className="hero-trust-strip">
              <div className="hero-trust-item">
                <ShieldCheck size={16} color="var(--color-maroon)" />
                <span>0% GST (Govt. Exempt)</span>
              </div>
              <div className="hero-trust-item">
                <Truck size={16} color="var(--color-maroon)" />
                <span>India Post Direct Dispatch</span>
              </div>
              <div className="hero-trust-item">
                <Feather size={16} color="var(--color-maroon)" />
                <span>Palm-Leaf Manuscripts</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Book Product Card (Square-Oriented & Interactive) */}
          <div className="hero-right-col">
            <div className="hero-product-card">
              {/* Product Header Tag with Selector Pills */}
              <div className="hero-product-header">
                <div>
                  <span className="badge badge-maroon">{featuredBook.tag}</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                    In Print · Mysuru
                  </span>
                </div>

                {/* Micro Spotlight Selector */}
                <div className="hero-spotlight-tabs" role="tablist">
                  {SPOTLIGHT_BOOKS.map((b, i) => (
                    <button
                      key={b.id}
                      type="button"
                      role="tab"
                      aria-selected={i === activeSpotlightIndex}
                      onClick={() => setActiveSpotlightIndex(i)}
                      className={`hero-spotlight-tab ${i === activeSpotlightIndex ? 'active' : ''}`}
                      title={b.title}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Body: Square Cover Canvas + Details */}
              <div className="hero-product-body">
                {/* Book Cover Container (Crisp Square Frame) */}
                <div
                  className="hero-product-cover"
                  onClick={handleOpenProduct}
                  title={`View ${featuredBook.title}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleOpenProduct(); }}
                >
                  <img
                    src={featuredBook.webpImage}
                    alt={`Cover of ${featuredBook.title}`}
                    loading="eager"
                    className="hero-product-cover-img"
                  />
                  <div className="hero-cover-hover-tag">
                    <BookOpen size={12} />
                    <span>View Product</span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="hero-product-info">
                  <span className="hero-product-category">
                    {featuredBook.category}
                  </span>

                  <h2
                    className="hero-product-title text-serif"
                    onClick={handleOpenProduct}
                    title={`View dedicated page for ${featuredBook.title}`}
                  >
                    {featuredBook.title}
                  </h2>

                  <span className="hero-product-kannada text-kannada">
                    {featuredBook.titleKannada}
                  </span>

                  <p className="hero-product-author">
                    <strong>Author:</strong> {featuredBook.author}
                  </p>

                  <p className="hero-product-desc">
                    {featuredBook.shortDescription}
                  </p>

                  {/* Price & Meta */}
                  <div className="hero-product-pricing">
                    <span className="hero-product-price">
                      ₹{featuredBook.price}
                    </span>
                    <span className="hero-product-gst">
                      0% GST (Exempt)
                    </span>
                    <span className="hero-product-pages">
                      · {featuredBook.pages} pp
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="hero-product-actions">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onInspectBook) onInspectBook(featuredBook);
                      }}
                      className="btn btn-outline btn-sm"
                      title="Quick preview & excerpt"
                    >
                      <BookOpen size={13} color="var(--color-maroon)" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAdd}
                      className={`btn btn-sm ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
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
