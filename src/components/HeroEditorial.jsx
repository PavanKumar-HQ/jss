import React, { useState } from 'react';
import { ArrowRight, BookOpen, ShoppingBag, Check, ShieldCheck, Truck, Award } from 'lucide-react';
import jssLogo from '../assets/jss-logo.webp';

const SHOWCASE_BOOKS = [
  {
    id: 1,
    slug: 'shivapada-ratnakosha',
    title: 'Shivapada Ratnakosha',
    titleKannada: 'ಶಿವಪದ ರತ್ನಕೋಶ',
    author: 'HH Sri Shivarathri Deshikendra Mahaswamiji',
    category: 'Veerashaiva Philosophy',
    price: 1000,
    binding: 'Deluxe Hardbound',
    pages: 896,
    badge: 'Monumental Work',
    webpImage: '/shivapada-ratnakosha/cover.webp'
  },
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
    webpImage: '/patanjali-yoga-sutras/cover.webp'
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
    webpImage: '/sharanara-vachanagalu/cover.webp'
  }
];

export default function HeroEditorial({
  onNavigate,
  onInspectBook,
  onAddToCart,
  cart = []
}) {
  const [addingId, setAddingId] = useState(null);

  const handleAdd = (e, book) => {
    e.stopPropagation();
    if (addingId) return;
    setAddingId(book.id);
    if (onAddToCart) onAddToCart(book);
    setTimeout(() => setAddingId(null), 600);
  };

  const handleOpenBook = (book) => {
    if (onNavigate) {
      onNavigate(`/books/${book.slug || book.id}`);
    }
  };

  return (
    <section className="minimalist-hero" aria-label="JSS Publications Introduction">
      {/* Subtle Gold Heritage Accent Trim */}
      <div className="hero-gold-top-trim" aria-hidden="true" />

      <div className="container">
        {/* TOP: Grand Institutional Masthead */}
        <div className="hero-masthead">
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

          <h1 className="hero-grand-title text-serif">
            Sacred Vachana Literature, Agamas & Indian Philosophy
          </h1>

          <p className="hero-kannada-subtitle text-kannada">
            ವಚನ ಸಾಹಿತ್ಯ, ಶೈವಾಗಮ, ಭಾರತೀಯ ತತ್ವಶಾಸ್ತ್ರ ಹಾಗೂ ಜ್ಞಾನ ಪರಂಪರೆಯ ಅಧಿಕೃತ ಉದ್ಗ್ರಂಥಗಳು
          </p>

          <p className="hero-lead-narrative">
            Preserving centuries of sacred palm-leaf manuscripts and publishing authoritative scholarly works, translations, and commentaries at non-profit subsidized prices for readers worldwide.
          </p>

          {/* Action CTAs */}
          <div className="hero-action-buttons">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/books')}
              className="btn btn-primary hero-btn-main"
            >
              <span>Explore Complete Catalogue (49 Books)</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/categories')}
              className="btn btn-outline hero-btn-sub"
            >
              <span>Browse by Subject</span>
            </button>
          </div>

          {/* Institutional Trust Badges */}
          <div className="hero-trust-bar">
            <div className="hero-trust-point">
              <Award size={15} color="var(--color-maroon)" />
              <span>Subsidized Non-Profit Editions</span>
            </div>
            <span className="hero-trust-sep" aria-hidden="true">·</span>
            <div className="hero-trust-point">
              <ShieldCheck size={15} color="var(--color-maroon)" />
              <span>0% GST Exempt (HSN 4901)</span>
            </div>
            <span className="hero-trust-sep" aria-hidden="true">·</span>
            <div className="hero-trust-point">
              <Truck size={15} color="var(--color-maroon)" />
              <span>Direct India Post Dispatch from Mysuru</span>
            </div>
          </div>
        </div>

        {/* BOTTOM: Uncluttered 3-Book Showcase Shelf */}
        <div className="hero-showcase-section">
          <div className="hero-shelf-header">
            <span className="hero-shelf-label">FEATURED CANONICAL EDITIONS</span>
            <span className="hero-shelf-desc">Available for immediate postal dispatch across India</span>
          </div>

          <div className="hero-shelf-grid">
            {SHOWCASE_BOOKS.map((book) => {
              const isAdded = cart.some(item => item.id === book.id);
              const isCurrentlyAdding = addingId === book.id;

              return (
                <div
                  key={book.id}
                  className="hero-shelf-card"
                  onClick={() => handleOpenBook(book)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleOpenBook(book); }}
                >
                  {/* Book Cover Stage */}
                  <div className="hero-shelf-cover-box">
                    <span className="hero-shelf-badge">{book.badge}</span>
                    <img
                      src={book.webpImage}
                      alt={`Cover of ${book.title}`}
                      className="hero-shelf-img"
                      loading="eager"
                    />
                    <div className="hero-shelf-overlay">
                      <BookOpen size={14} />
                      <span>View Details</span>
                    </div>
                  </div>

                  {/* Book Metadata & Pricing */}
                  <div className="hero-shelf-info">
                    <span className="hero-shelf-category">{book.category}</span>
                    <h3 className="hero-shelf-title text-serif">{book.title}</h3>
                    <span className="hero-shelf-kannada text-kannada">{book.titleKannada}</span>
                    <span className="hero-shelf-author">{book.author}</span>

                    <div className="hero-shelf-meta-row">
                      <div className="hero-shelf-price-wrap">
                        <span className="hero-shelf-price">₹{book.price}</span>
                        <span className="hero-shelf-gst">0% GST</span>
                      </div>
                      <span className="hero-shelf-binding">{book.binding}</span>
                    </div>

                    {/* Action Row */}
                    <div className="hero-shelf-actions">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onInspectBook) onInspectBook(book);
                        }}
                        className="btn btn-outline btn-sm hero-shelf-btn-preview"
                        title="Read excerpt"
                      >
                        <BookOpen size={13} color="var(--color-maroon)" />
                        <span>Excerpt</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleAdd(e, book)}
                        className={`btn btn-sm hero-shelf-btn-add ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
                        disabled={isCurrentlyAdding}
                      >
                        {isCurrentlyAdding ? (
                          <span>Adding...</span>
                        ) : isAdded ? (
                          <>
                            <Check size={13} color="var(--color-green)" />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={13} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
