import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Truck, Check, BookOpen, Share2 } from 'lucide-react';
import BookCard from '../components/BookCard';

export default function BookDetailPage({
  book,
  allBooks,
  onNavigate,
  onAddToCart,
  onBuyNow,
  cart,
  languageMode
}) {
  const [selectedVariant, setSelectedVariant] = useState('paperback');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!book) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 className="text-serif" style={{ fontSize: '1.5rem', color: 'var(--color-maroon)' }}>Publication Not Found</h2>
        <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>The requested book could not be located in the catalogue.</p>
        <button onClick={() => onNavigate('/books')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Books
        </button>
      </div>
    );
  }

  const currentPrice = selectedVariant === 'hardbound' && book.specialPrice ? book.specialPrice : book.price;

  const handleAdd = () => {
    onAddToCart({ ...book, price: currentPrice, selectedVariant, quantity });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuy = () => {
    onAddToCart({ ...book, price: currentPrice, selectedVariant, quantity });
    onNavigate('/cart');
  };

  // Find related books from the same category
  const relatedBooks = allBooks
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 4);

  return (
    <div className="product-page-section">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '24px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} style={{ color: 'var(--color-text-muted)' }}>
            Home
          </a>
          <span style={{ margin: '0 8px' }}>/</span>
          <a href="/books" onClick={(e) => { e.preventDefault(); onNavigate('/books'); }} style={{ color: 'var(--color-text-muted)' }}>
            Books
          </a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--color-text-body)' }}>{book.title}</span>
        </nav>

        {/* Back Link */}
        <button
          onClick={() => onNavigate('/books')}
          className="btn btn-outline btn-sm"
          style={{ marginBottom: '24px', gap: '6px' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Catalogue</span>
        </button>

        {/* Product Layout Grid */}
        <div className="product-layout-grid">
          {/* Left Column: Book Cover */}
          <div>
            <div className="product-cover-box">
              <img
                src={book.imageUrl || book.localImage}
                alt={`Cover of ${book.title}`}
                className="product-cover-img"
              />
            </div>

            {/* Indian Postal Shipping Guarantee Box */}
            <div style={{ marginTop: '20px', backgroundColor: 'var(--color-bg-neutral)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Truck size={16} color="var(--color-maroon)" />
                <strong style={{ fontSize: '0.86rem', color: 'var(--color-text-charcoal)' }}>Postal Delivery from Mysuru</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Orders are securely packaged and dispatched via India Post Speed Post directly from JSS Book House, Mysuru. Free shipping for orders above ₹500.
              </p>
            </div>
          </div>

          {/* Right Column: Publication Details & Purchase Controls */}
          <div>
            {/* Category Tag */}
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-saffron)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>
              {book.category || 'Vachana Literature'}
            </span>

            {/* Book Title in Classic Serif */}
            <h1 className="text-serif" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--color-maroon)', lineHeight: 1.2, marginBottom: '4px' }}>
              {book.title}
            </h1>

            {/* Kannada Script Title (if distinct) */}
            {book.titleKannada && book.titleKannada !== book.title && (
              <h2 className="text-kannada" style={{ fontSize: '1.2rem', color: 'var(--color-maroon-dark)', marginBottom: '12px', fontWeight: 600 }}>
                {book.titleKannada}
              </h2>
            )}

            {/* Author Attribution */}
            <p style={{ fontSize: '0.96rem', color: 'var(--color-text-body)', marginBottom: '16px' }}>
              <strong>Author / Compiler:</strong> {book.author || 'JSS Granthamale Editorial Board'}
              {book.translator && <span> · Translated by {book.translator}</span>}
            </p>

            {/* Price & Availability */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-maroon)', fontFamily: 'var(--font-serif-heading)' }}>
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="badge badge-green">In Stock</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
                GST Exempt (Printed Books)
              </span>
            </div>

            {/* Short Description */}
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', lineHeight: 1.65, marginBottom: '22px' }}>
              {book.description}
            </p>

            {/* Edition Selection (if multiple editions exist) */}
            {book.hasVariants && (
              <div style={{ marginBottom: '22px', backgroundColor: 'var(--color-bg-neutral)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '10px' }}>
                  Available Editions:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedVariant === 'paperback' ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="editionVariant"
                        value="paperback"
                        checked={selectedVariant === 'paperback'}
                        onChange={() => setSelectedVariant('paperback')}
                        style={{ accentColor: 'var(--color-maroon)' }}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.88rem' }}>Paperback Standard Edition</strong>
                        <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>Regular binding · In Stock</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                      ₹{book.price.toLocaleString('en-IN')}
                    </span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedVariant === 'hardbound' ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="editionVariant"
                        value="hardbound"
                        checked={selectedVariant === 'hardbound'}
                        onChange={() => setSelectedVariant('hardbound')}
                        style={{ accentColor: 'var(--color-maroon)' }}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.88rem' }}>Hardbound Deluxe Edition</strong>
                        <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>Library hardbound · In Stock</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                      ₹{book.specialPrice?.toLocaleString('en-IN')}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Quantity & Purchase Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {/* Quantity Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border-dark)', borderRadius: 'var(--radius-sm)', backgroundColor: '#FFFFFF' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', padding: '9px 12px', cursor: 'pointer', fontWeight: 700 }}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span style={{ padding: '0 8px', fontSize: '0.92rem', fontWeight: 600 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'none', border: 'none', padding: '9px 12px', cursor: 'pointer', fontWeight: 700 }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="btn btn-primary"
                style={{ padding: '10px 22px' }}
              >
                {isAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
                <span>{isAdded ? 'Added to Cart' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuy}
                className="btn btn-secondary"
                style={{ padding: '10px 22px' }}
              >
                Buy Now
              </button>
            </div>

            {/* Publication Details Specifications Table */}
            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
              Publication Details
            </h3>

            <table className="product-specs-table">
              <tbody>
                <tr>
                  <th>Language</th>
                  <td>{book.language}</td>
                </tr>
                {book.pages && (
                  <tr>
                    <th>Length</th>
                    <td>{book.pages} Pages</td>
                  </tr>
                )}
                {book.isbn && (
                  <tr>
                    <th>Catalogue ISBN / SKU</th>
                    <td>{book.isbn}</td>
                  </tr>
                )}
                {book.series && (
                  <tr>
                    <th>Series</th>
                    <td>{book.series}</td>
                  </tr>
                )}
                <tr>
                  <th>Publisher</th>
                  <td>{book.publisher}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RELATED PUBLICATIONS SECTION */}
        {relatedBooks.length > 0 && (
          <div style={{ marginTop: '54px', paddingTop: '36px', borderTop: '1px solid var(--color-border)' }}>
            <h2 className="text-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-maroon)', marginBottom: '20px' }}>
              Related Publications in {book.category}
            </h2>

            <div className="books-grid">
              {relatedBooks.map((relBook) => (
                <BookCard
                  key={relBook.id}
                  book={relBook}
                  onSelectBook={(b) => {
                    onNavigate(`/books/${b.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onAddToCart={onAddToCart}
                  isAddedToCart={cart.some((item) => item.id === relBook.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
