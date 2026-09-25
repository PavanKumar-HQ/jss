import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Truck, Check, BookOpen, ShieldCheck, Loader2 } from 'lucide-react';
import BookCard from '../components/BookCard';

export default function BookDetailPage({
  book,
  allBooks = [],
  onNavigate,
  onAddToCart,
  onBuyNow,
  cart = [],
  languageMode
}) {
  const [selectedVariant, setSelectedVariant] = useState('paperback');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!book) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 className="text-serif" style={{ fontSize: '1.6rem', color: 'var(--color-maroon)' }}>
          Publication Not Found
        </h2>
        <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>
          The requested book could not be located in the JSS Granthamale catalogue.
        </p>
        <button
          onClick={() => onNavigate('/books')}
          className="btn btn-primary"
          style={{ marginTop: '20px' }}
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  // Fallback clean SVG cover
  const fallbackCover = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23FAF7F2"/><rect x="14" y="14" width="272" height="392" fill="%235E1624" rx="4"/><rect x="22" y="22" width="256" height="376" fill="none" stroke="%23E5DFD5" stroke-width="1.2"/><text x="50%" y="46%" fill="%23FFFFFF" font-size="17" font-family="serif" text-anchor="middle" font-weight="bold">${encodeURIComponent(book.title)}</text><text x="50%" y="54%" fill="%23DFBF5F" font-size="12" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(book.author || 'JSS Publications')}</text></svg>`;

  const imageSource = imgError
    ? (book.localImage || fallbackCover)
    : (book.webpImage || book.localImage || book.imageUrl || fallbackCover);

  const currentPrice = selectedVariant === 'hardbound' && book.specialPrice
    ? book.specialPrice
    : book.price;

  const handleAdd = () => {
    if (isAdding) return;
    setIsAdding(true);
    if (onAddToCart) {
      onAddToCart({
        ...book,
        price: currentPrice,
        selectedVariant: selectedVariant === 'hardbound' ? 'Deluxe Hardbound' : 'Paperback',
        quantity
      });
    }
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }, 400);
  };

  const handleBuy = () => {
    if (onBuyNow) {
      onBuyNow({
        ...book,
        price: currentPrice,
        selectedVariant: selectedVariant === 'hardbound' ? 'Deluxe Hardbound' : 'Paperback',
        quantity
      });
    }
  };

  // Find related books from the same category
  const relatedBooks = allBooks
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 4);

  return (
    <div className="product-page-section">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '20px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
            style={{ color: 'var(--color-maroon)' }}
          >
            Home
          </a>
          <span style={{ margin: '0 8px' }}>/</span>
          <a
            href="/books"
            onClick={(e) => { e.preventDefault(); onNavigate('/books'); }}
            style={{ color: 'var(--color-maroon)' }}
          >
            Books
          </a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{book.category}</span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--color-text-charcoal)', fontWeight: 600 }}>{book.title}</span>
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

        {/* Product Layout Grid: Left Cover & Right Details */}
        <div className="product-layout-grid">
          {/* LEFT: Book Cover, Preview Button, Delivery Guarantee */}
          <div>
            <div className="product-cover-box">
              <picture>
                {!imgError && book.webpImage && <source srcSet={book.webpImage} type="image/webp" />}
                {!imgError && book.localImage && <source srcSet={book.localImage} type="image/jpeg" />}
                <img
                  src={imageSource}
                  onError={() => setImgError(true)}
                  alt={`Cover of ${book.title}`}
                  className="product-cover-img"
                  decoding="async"
                />
              </picture>
            </div>

            {/* India Post Delivery Box */}
            <div style={{ marginTop: '20px', backgroundColor: 'var(--color-bg-neutral)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Truck size={16} color="var(--color-maroon)" />
                <strong style={{ fontSize: '0.86rem', color: 'var(--color-text-charcoal)' }}>Postal Delivery from Mysuru</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '6px' }}>
                Dispatched via India Post Speed Post / Registered Parcel directly from JSS Book House counter. Free delivery across India for orders above ₹500.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-green)', fontWeight: 600 }}>
                <ShieldCheck size={14} />
                <span>0% GST applicable on printed publications</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Category, Title, Kannada Title, Metadata, Binding Selector, Quantity, Actions */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>
              {book.category || 'Vachana Literature'}
            </span>

            <h1 className="text-serif" style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)', fontWeight: 700, color: 'var(--color-text-charcoal)', lineHeight: 1.2, marginBottom: '4px' }}>
              {book.title}
            </h1>

            {/* Kannada Script Title */}
            {book.titleKannada && book.titleKannada !== book.title && (
              <h2 className="text-kannada" style={{ fontSize: '1.25rem', color: 'var(--color-maroon-dark)', marginBottom: '12px', fontWeight: 600 }}>
                {book.titleKannada}
              </h2>
            )}

            {/* Author Attribution */}
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-body)', marginBottom: '16px' }}>
              <strong>Author / Compiler:</strong> {book.author || 'JSS Granthamale Editorial Board'}
              {book.translator && <span> · Translated by {book.translator}</span>}
            </p>

            {/* Price & GST */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-maroon)', fontFamily: 'var(--font-sans)' }}>
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="badge badge-green">In Stock</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                0% GST (Printed Books)
              </span>
            </div>

            {/* Short Description */}
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-body)', lineHeight: 1.65, marginBottom: '22px' }}>
              {book.description}
            </p>

            {/* Binding Edition Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '8px' }}>
                Select Binding Edition:
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setSelectedVariant('paperback')}
                  className={`btn ${selectedVariant === 'paperback' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: 'var(--radius-xs)', padding: '8px 16px' }}
                >
                  <span>Paperback Edition — ₹{book.price}</span>
                </button>

                {book.specialPrice && (
                  <button
                    type="button"
                    onClick={() => setSelectedVariant('hardbound')}
                    className={`btn ${selectedVariant === 'hardbound' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ borderRadius: 'var(--radius-xs)', padding: '8px 16px' }}
                  >
                    <span>Deluxe Hardbound Edition — ₹{book.specialPrice}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {/* Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border-dark)', borderRadius: 'var(--radius-xs)', backgroundColor: '#FFFFFF' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span style={{ padding: '0 10px', fontSize: '0.94rem', fontWeight: 600 }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAdd}
                className="btn btn-primary"
                disabled={isAdding}
                style={{ padding: '10px 22px' }}
              >
                {isAdding ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 0.6s linear infinite' }} />
                    <span>Adding...</span>
                  </>
                ) : isAdded ? (
                  <>
                    <Check size={16} color="var(--color-green)" />
                    <span>Added ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuy}
                className="btn btn-secondary"
                style={{ padding: '10px 22px' }}
              >
                Buy Now
              </button>
            </div>

            {/* Publication Details Specifications Table */}
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
              Publication Details
            </h3>

            <table className="product-specs-table">
              <tbody>
                <tr>
                  <th>Language</th>
                  <td>{book.language || 'Kannada'}</td>
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
                    <th>Publication Series</th>
                    <td>{book.series}</td>
                  </tr>
                )}
                <tr>
                  <th>Publisher</th>
                  <td>{book.publisher || 'Jagadguru Sri Shivarathreeshwara Granthamale, Mysuru'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION: About This Book & Sample Excerpt */}
        <div style={{ marginTop: '48px', paddingTop: '36px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <div>
              <h2 className="text-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '12px' }}>
                About this Publication
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: '14px' }}>
                This volume is an authentic publication preserved and released under the Jagadguru Sri Shivarathreeshwara Granthamale, the official literary and research wing of JSS Mahavidyapeetha, Mysuru.
              </p>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-body)', lineHeight: 1.7 }}>
                Carefully edited by scholarly subject authorities, it aims to convey the depth of Indian spiritual, philosophical, and Kannada classical heritage with fidelity to original manuscripts and critical commentaries.
              </p>
            </div>

            {book.sampleExcerpt && (
              <div style={{ backgroundColor: 'var(--color-bg-neutral)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '24px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '8px' }}>
                  Sample Excerpt / ಮಾದರಿ ಪರಿವಿಡಿ
                </span>
                <p className="text-kannada" style={{ fontSize: '1rem', color: 'var(--color-text-charcoal)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '10px' }}>
                  "{book.sampleExcerpt}"
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  — JSS Granthamale Publication Archives
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION: Related Publications */}
        {relatedBooks.length > 0 && (
          <div style={{ marginTop: '54px', paddingTop: '36px', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <h2 className="text-serif" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-text-charcoal)' }}>
                Related Publications in {book.category}
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('/books')}
                className="btn btn-outline btn-sm"
              >
                Browse All Folios →
              </button>
            </div>

            <div className="books-grid">
              {relatedBooks.map((relBook) => (
                <BookCard
                  key={relBook.id}
                  book={relBook}
                  onSelectBook={(b) => {
                    onNavigate(`/books/${b.slug || b.id}`);
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
