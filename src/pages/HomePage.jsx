import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  Truck,
  ShieldCheck,
  BookMarked,
  Library,
  Scroll,
  Landmark,
  Flame,
  Crown,
  GraduationCap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail
} from 'lucide-react';
import HeroEditorial from '../components/HeroEditorial';
import BookCard from '../components/BookCard';
import InteractiveVachanaFlipper from '../components/InteractiveVachanaFlipper';
import jssLogo from '../assets/jss-logo.webp';
import useScrollReveal from '../hooks/useScrollReveal';
import { adminService } from '../services';

export default function HomePage({
  products = [],
  onNavigate,
  onSelectBook,
  onOpenExcerpt,
  onAddToCart,
  cart = [],
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  languageMode
}) {
  // Activate automatic scroll reveal on homepage
  useScrollReveal();

  // Active filter tab for Featured Publications section
  const [featuredTab, setFeaturedTab] = useState('All');

// Canonical default FAQs to guarantee accordion is always populated
const CANONICAL_HOME_FAQS = [
  {
    id: 'faq-01',
    category: 'JSS Publications',
    question: 'What is Jagadguru Sri Shivarathreeshwara Granthamale (JSS Publications)?',
    questionKn: 'ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ ಎಂದರೇನು?',
    answer: 'Jagadguru Sri Shivarathreeshwara Granthamale is the premier publications and research wing of JSS Mahavidyapeetha, Mysuru. Founded under the spiritual auspices of Sri Suttur Veerashimhasana Math, it has been publishing authentic editions of 12th-century Vachana literature, Shaiva Agamas, Indian philosophy, and classical Kannada treatises since the mid-20th century.',
    answerKn: 'ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆಯು ಜೆಎಸ್ಎಸ್ ಮಹಾವಿದ್ಯಾಪೀಠದ ಪ್ರಮುಖ ಪ್ರಕಾಶನ ಮತ್ತು ಸಂಶೋಧನಾ ವಿಭಾಗವಾಗಿದೆ. ಶ್ರೀ ಸುತ್ತೂರು ಮಠದ ಪರಂಪರೆಯಲ್ಲಿ 12ನೇ ಶತಮಾನದ ವಚನ ಸಾಹಿತ್ಯ, ಶೈವಾಗಮಗಳು ಮತ್ತು ದಾರ್ಶನಿಕ ಗ್ರಂಥಗಳನ್ನು ಇದು ಪ್ರಕಟಿಸುತ್ತದೆ.',
    status: 'published'
  },
  {
    id: 'faq-02',
    category: 'JSS Publications',
    question: 'Where is the physical JSS Book House located in Mysuru?',
    questionKn: 'ಮೈಸೂರಿನಲ್ಲಿ ಜೆಎಸ್ಎಸ್ ಪುಸ್ತಕ ಭವನ ಎಲ್ಲಿದೆ?',
    answer: 'The physical JSS Book House retail counter is situated at JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004. It is open Monday to Saturday from 9:30 AM to 6:00 PM IST.',
    answerKn: 'ಜೆಎಸ್ಎಸ್ ಪುಸ್ತಕ ಭವನದ ಮಳಿಗೆಯು ಮೈಸೂರಿನ ಡಾ. ಶಿವರಾತ್ರಿ ರಾಜೇಂದ್ರ ವೃತ್ತದ ಜೆಎಸ್ಎಸ್ ಮಹಾವಿದ್ಯಾಪೀಠದ ಆವರಣದಲ್ಲಿದೆ.',
    status: 'published'
  },
  {
    id: 'faq-03',
    category: 'Shipping',
    question: 'How are books shipped to individual readers across India?',
    questionKn: 'ಭಾರತದಾದ್ಯಂತ ಓದುಗರಿಗೆ ಪುಸ್ತಕಗಳನ್ನು ಹೇಗೆ ರವಾನಿಸಲಾಗುತ್ತದೆ?',
    answer: 'All orders are dispatched directly from the Mysuru publication press and retail counter via India Post (Speed Post and Registered Book Parcel). Orders above ₹500 qualify for free postal delivery anywhere in India.',
    answerKn: 'ಎಲ್ಲಾ ಆದೇಶಗಳನ್ನು ಮೈಸೂರಿನಿಂದ ಭಾರತೀಯ ಅಂಚೆ (ಸ್ಪೀಡ್ ಪೋಸ್ಟ್/ನೋಂದಾಯಿತ ಪಾರ್ಸೆಲ್) ಮೂಲಕ ಕಳುಹಿಸಲಾಗುತ್ತದೆ. ₹500 ಮೇಲಿನ ಆದೇಶಗಳಿಗೆ ಉಚಿತ ಸಾಗಾಟವಿರುತ್ತದೆ.',
    status: 'published'
  },
  {
    id: 'faq-04',
    category: 'Payments & GST',
    question: 'Are GST charges applicable on JSS publications?',
    questionKn: 'ಜೆಎಸ್ಎಸ್ ಪ್ರಕಟಣೆಗಳ ಮೇಲೆ ಜಿಎಸ್ಟಿ ತೆರಿಗೆ ಅನ್ವಯಿಸುತ್ತದೆಯೇ?',
    answer: 'Under statutory GST regulations for the Government of India (HSN Chapter 4901), printed books, journals, sacred scriptures, and classical publications are completely exempt from GST (0% CGST/SGST/IGST).',
    answerKn: 'ಕೇಂದ್ರ ಸರ್ಕಾರದ ಜಿಎಸ್ಟಿ ನಿಯಮಗಳನ್ವಯ (HSN 4901), ಮುದ್ರಿತ ಗ್ರಂಥಗಳು ಮತ್ತು ಧಾರ್ಮಿಕ ಸಾಹಿತ್ಯಕ್ಕೆ ಸಂಪೂರ್ಣ 0% ತೆರಿಗೆ ವಿನಾಯಿತಿ ಇದೆ.',
    status: 'published'
  },
  {
    id: 'faq-05',
    category: 'Bulk Orders',
    question: 'Can universities, colleges, and libraries place bulk procurement orders?',
    questionKn: 'ವಿಶ್ವವಿದ್ಯಾಲಯಗಳು, ಕಾಲೇಜುಗಳು ಮತ್ತು ಗ್ರಂಥಾಲಯಗಳು ಸಗಟು ಆದೇಶ ನೀಡಬಹುದೇ?',
    answer: 'Yes. JSS Publications provides institutional library procurement desks with graded institutional subsidies (10% to 20%), official proforma invoices, and direct dispatch for universities, colleges, research institutes, and public libraries.',
    answerKn: 'ಹೌದು. ಗ್ರಂಥಾಲಯಗಳು ಮತ್ತು ಶಿಕ್ಷಣ ಸಂಸ್ಥೆಗಳಿಗೆ ವಿಶೇಷ ರಿಯಾಯಿತಿ, ಪ್ರೊಫಾರ್ಮಾ ಇನ್‌ವಾಯ್ಸ್ ಮತ್ತು ನೇರ ಸಾಗಾಟ ವ್ಯವಸ್ಥೆ ಇದೆ.',
    status: 'published'
  },
  {
    id: 'faq-06',
    category: 'Vachana Literature',
    question: 'Are genuine editions of the 12th-century Vachanas available with commentaries?',
    questionKn: '12ನೇ ಶತಮಾನದ ವಚನಗಳ ಅಧಿಕೃತ ಆವೃತ್ತಿಗಳು ವಿವರಣೆಯೊಂದಿಗೆ ಲಭ್ಯವಿದೆಯೇ?',
    answer: 'Yes. We publish exhaustive anthologies of Basavanna, Allama Prabhu, Akkamahadevi, and hundreds of minor Sharanas with word-for-word glosses, philosophical introductions, English translations, and critical apparatus.',
    answerKn: 'ಹೌದು. ಬಸವಣ್ಣ, ಅಲ್ಲಮಪ್ರಭು, ಅಕ್ಕಮಹಾದೇವಿ ಹಾಗೂ ಇತರ ಶರಣರ ವಚನಗಳನ್ನು ಶಾಸ್ತ್ರೀಯ ವ್ಯಾಖ್ಯಾನ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಅನುವಾದದೊಂದಿಗೆ ಪ್ರಕಟಿಸಲಾಗಿದೆ.',
    status: 'published'
  }
];

// Published FAQs for Homepage with guaranteed fallback
  const [homeFaqs, setHomeFaqs] = useState(() => {
    try {
      const pub = adminService.getPublishedFaqs();
      if (Array.isArray(pub) && pub.length > 0) return pub.slice(0, 6);
    } catch (e) {
      console.warn('FAQ retrieval error:', e);
    }
    return CANONICAL_HOME_FAQS;
  });
  const [expandedHomeFaqId, setExpandedHomeFaqId] = useState('faq-01');

  useEffect(() => {
    const updateFaqs = () => {
      try {
        const pub = adminService.getPublishedFaqs();
        if (Array.isArray(pub) && pub.length > 0) {
          setHomeFaqs(pub.slice(0, 6));
          return;
        }
      } catch (e) {
        console.warn('FAQ sync error:', e);
      }
      setHomeFaqs(CANONICAL_HOME_FAQS);
    };

    updateFaqs();
    return adminService.subscribe(updateFaqs);
  }, []);

  // Curated canonical books for Featured Publications based on active tab
  const featuredPublications = useMemo(() => {
    if (featuredTab === 'All') {
      const picks = [
        products.find(p => p.slug === 'patanjali-yoga-sutras' || p.id === 3),
        products.find(p => p.slug === 'shivapada-ratnakosha' || p.id === 1),
        products.find(p => p.slug === 'sharanara-vachanagalu' || p.id === 7),
        products.find(p => p.slug === 'the-heritage-of-sri-suttur-math' || p.id === 5)
      ].filter(Boolean);
      return picks.length === 4 ? picks : products.slice(0, 4);
    }

    const filtered = products.filter(p => p.category === featuredTab);
    return filtered.slice(0, 4);
  }, [products, featuredTab]);

  // 4 curated books for New / Recent Publications
  const recentPublications = useMemo(() => {
    const picks = [
      products.find(p => p.slug === 'allama-prabhu-devara-vachana' || p.id === 2),
      products.find(p => p.slug === 'shiva-sutras' || p.id === 4),
      products.find(p => p.slug === 'molige-mahadevi-vachanagalu' || p.id === 11),
      products.find(p => p.slug === 'panchachara' || p.id === 16)
    ].filter(Boolean);

    return picks.length === 4 ? picks : products.slice(4, 8);
  }, [products]);

  // Category subject folios with vector icons (NO emojis) and exact counts
  const subjectList = useMemo(() => {
    const subjects = [
      {
        name: 'Vachana Literature',
        kannada: 'ವಚನ ಸಾಹಿತ್ಯ',
        IconComponent: Scroll,
        desc: 'Sacred verses of Basavanna, Allama Prabhu, Akkamahadevi & 12th-century Sharanas'
      },
      {
        name: 'Veerashaiva Philosophy',
        kannada: 'ವೀರಶೈವ ತತ್ವಶಾಸ್ತ್ರ',
        IconComponent: Landmark,
        desc: 'Shaiva Agamas, Shatsthala theology, encyclopedias & classical commentaries'
      },
      {
        name: 'Spirituality & Yoga',
        kannada: 'ಆಧ್ಯಾತ್ಮ ಮತ್ತು ಯೋಗ',
        IconComponent: Flame,
        desc: 'Patanjali Yoga Sutras, Shiva Sutras, meditation manuals & devotional treatises'
      },
      {
        name: 'Biographies & Heritage',
        kannada: 'ಜೀವನ ಚರಿತ್ರೆ ಮತ್ತು ಪರಂಪರೆ',
        IconComponent: Crown,
        desc: 'Historical chronicles of Sri Suttur Math pontiffs & Veerashaiva luminaries'
      },
      {
        name: 'Education & Science',
        kannada: 'ಶಿಕ್ಷಣ ಮತ್ತು ವಿಜ್ಞಾನ',
        IconComponent: GraduationCap,
        desc: 'Scientific treatises, educational lectures, space technology & memorial series'
      }
    ];

    return subjects.map(s => ({
      ...s,
      count: products.filter(p => p.category === s.name).length
    }));
  }, [products]);

  // O(1) set lookup for cart items
  const cartIdSet = useMemo(() => new Set(cart.map((item) => item.id)), [cart]);

  const handleCategoryClick = (catName) => {
    if (setActiveCategory) setActiveCategory(catName);
    if (onNavigate) onNavigate('/books');
  };

  const featuredTabs = [
    { label: 'All Curated', value: 'All' },
    { label: 'Vachana Literature', value: 'Vachana Literature' },
    { label: 'Veerashaiva Philosophy', value: 'Veerashaiva Philosophy' },
    { label: 'Spirituality & Yoga', value: 'Spirituality & Yoga' }
  ];

  return (
    <div className="homepage-content-wrapper">
      {/* 1. COMPACT HERO WITH SPOTLIGHT SELECTOR */}
      <HeroEditorial
        onNavigate={onNavigate}
        onInspectBook={onSelectBook}
        onAddToCart={onAddToCart}
        cart={cart}
      />

      {/* 2. FEATURED PUBLICATIONS (PRIMARY COMMERCE SECTION WITH TABS) */}
      <section className="homepage-section section-featured reveal-on-scroll" aria-label="Featured Publications">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="section-eyebrow">
                  Bookstore Highlights · ಮೈಸೂರು ಪುಸ್ತಕ ಭಂಡಾರ
                </span>
              </div>
              <h2 className="section-title text-serif">
                FEATURED PUBLICATIONS
              </h2>
              <p className="section-desc">
                Foundational reference volumes, critical editions, and canonical texts in print at subsidized rates.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onNavigate('/books')}
                className="btn btn-outline btn-sm"
                style={{ gap: '6px' }}
              >
                <span>Browse full catalogue ({products.length})</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Interactive Category Filter Pills for Featured Section */}
          <div className="featured-filter-bar" role="tablist">
            {featuredTabs.map(tab => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={featuredTab === tab.value}
                onClick={() => setFeaturedTab(tab.value)}
                className={`featured-filter-btn ${featuredTab === tab.value ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 4 Square Books Grid with Pop-In Animations */}
          <div className="books-grid">
            {featuredPublications.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelectBook={onSelectBook}
                onAddToCart={onAddToCart}
                isAddedToCart={cartIdSet.has(book.id)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW / RECENT PUBLICATIONS (MOVED UP AS REQUESTED: NEW BOOKS FIRST) */}
      <section className="homepage-section section-bordered reveal-on-scroll" aria-label="New and Recent Publications">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">
                Catalogue Editions · ನೂತನ ಪ್ರಕಟಣೆಗಳು
              </span>
              <h2 className="section-title text-serif">
                NEW & RECENT PUBLICATIONS
              </h2>
              <p className="section-desc">
                Scholarly translations, palm-leaf manuscript editions, and spiritual monographs recently brought to print.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/books')}
              className="btn btn-outline btn-sm"
              style={{ gap: '6px' }}
            >
              <span>View full catalogue ({products.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* 4 Square Books Grid */}
          <div className="books-grid">
            {recentPublications.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelectBook={onSelectBook}
                onAddToCart={onAddToCart}
                isAddedToCart={cartIdSet.has(book.id)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXPLORE BY SUBJECT (CATEGORIES WITH BESPOKE VECTOR ICONS - NO EMOJIS) */}
      <section className="homepage-section section-subjects reveal-on-scroll" aria-label="Explore by Subject">
        <div className="container">
          <div style={{ marginBottom: '24px' }}>
            <span className="section-eyebrow">
              Publishing Classification · ಗ್ರಂಥ ವರ್ಗೀಕರಣ
            </span>
            <h2 className="section-title text-serif">
              EXPLORE BY SUBJECT
            </h2>
            <p className="section-desc">
              Browse scholarly editions, Agamas, and literature categorized under canonical publishing series.
            </p>
          </div>

          <div className="subject-cards-grid">
            {subjectList.map((subject) => {
              const Icon = subject.IconComponent;
              return (
                <div
                  key={subject.name}
                  onClick={() => handleCategoryClick(subject.name)}
                  className="subject-folio-card"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCategoryClick(subject.name); }}
                >
                  <div className="subject-card-top">
                    <div className="subject-vector-badge">
                      <Icon size={20} color="var(--color-maroon)" strokeWidth={2.2} />
                    </div>
                    <span className="subject-count-pill">{subject.count} titles</span>
                  </div>

                  <div className="subject-card-info">
                    <h3 className="subject-folio-title text-serif">{subject.name}</h3>
                    <span className="subject-folio-kannada text-kannada">{subject.kannada}</span>
                    <p className="subject-folio-desc">{subject.desc}</p>
                  </div>

                  <div className="subject-card-action">
                    <span>Explore Series</span>
                    <ArrowRight size={14} className="subject-arrow-icon" />
                  </div>
                </div>
              );
            })}

            {/* Complete Catalogue Callout Card */}
            <div
              onClick={() => {
                if (setActiveCategory) setActiveCategory('All Categories');
                if (onNavigate) onNavigate('/books');
              }}
              className="subject-folio-card subject-folio-complete"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (setActiveCategory) setActiveCategory('All Categories');
                  if (onNavigate) onNavigate('/books');
                }
              }}
            >
              <div className="subject-card-top">
                <div className="subject-vector-badge" style={{ backgroundColor: '#DFBF5F', borderColor: '#FFFFFF' }}>
                  <Library size={20} color="#420D18" strokeWidth={2.2} />
                </div>
                <span className="subject-count-pill" style={{ backgroundColor: '#DFBF5F', color: '#420D18' }}>
                  {products.length} titles
                </span>
              </div>

              <div className="subject-card-info">
                <h3 className="subject-folio-title text-serif" style={{ color: '#FFFFFF' }}>Complete Catalogue</h3>
                <span className="subject-folio-kannada text-kannada" style={{ color: '#DFBF5F' }}>ಸಮಗ್ರ ಗ್ರಂಥ ಸೂಚಿ</span>
                <p className="subject-folio-desc" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  View all 49+ publications in print with ISBN, variant binding options, and postal delivery.
                </p>
              </div>

              <div className="subject-card-action subject-card-action-gold">
                <span>Open Master Index</span>
                <ArrowRight size={14} className="subject-arrow-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE 3D VACHANA MANUSCRIPT TURNER (FLIPPING BOOK FEATURE) */}
      <InteractiveVachanaFlipper
        onNavigate={onNavigate}
        onSelectBook={onSelectBook}
      />

      {/* 6. ABOUT JSS PUBLICATIONS (INSTITUTIONAL HERITAGE & MISSION) */}
      <section className="homepage-section section-bordered section-about reveal-on-scroll" aria-label="About JSS Publications">
        <div className="container">
          <div className="about-summary-grid">
            {/* Left Narrative */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(197, 155, 39, 0.4)',
                    boxShadow: '0 2px 8px rgba(94, 22, 36, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3px'
                  }}
                >
                  <img
                    src={jssLogo}
                    alt="JSS Publications Emblem Crest"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', lineHeight: 1.1 }}>
                    JSS Mahavidyapeetha · Mysore
                  </span>
                  <span className="text-kannada" style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', display: 'block' }}>
                    ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ · ಸ್ಥಾಪನೆ ೧೯೫೪
                  </span>
                </div>
              </div>

              <h2 className="text-serif" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.1rem)', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '14px', lineHeight: 1.25 }}>
                ABOUT JSS PUBLICATIONS
              </h2>

              <p style={{ fontSize: '0.94rem', color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: '12px' }}>
                Jagadguru Sri Shivarathreeshwara Granthamale (JSS Publications) is the publication division of JSS Mahavidyapeetha, Mysuru. Founded under the holy vision of the 22nd Pontiff of Sri Suttur Math, His Holiness Jagadguru Sri Shivarathri Rajendra Mahaswamiji, the institution has dedicated itself to the critical editing, preservation, and subsidized dissemination of sacred Vachana literature, Veerashaiva philosophy, Sanskrit commentaries, and academic treatises.
              </p>

              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: '20px' }}>
                All titles are priced strictly at subsidized non-profit rates to ensure that invaluable Indian philosophical heritage remains accessible to research scholars, university libraries, mutts, and readers across India.
              </p>

              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px' }}
              >
                <span>Read Full Publisher History & Archive</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Right Trust Column */}
            <div className="about-trust-box">
              <h3 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '18px' }}>
                Publishing & Dispatch Standards
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={20} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-charcoal)', display: 'block', marginBottom: '2px' }}>
                      0% GST on All Printed Books
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45, display: 'block' }}>
                      In accordance with HSN Chapter 4901, all printed books and journals are completely exempt from GST.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Truck size={20} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-charcoal)', display: 'block', marginBottom: '2px' }}>
                      India Post Direct Postal Dispatch
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45, display: 'block' }}>
                      Securely packed and dispatched directly from the JSS Book House sales counter at Dr. Shivarathri Rajendra Circle, Mysuru.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <BookMarked size={20} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-charcoal)', display: 'block', marginBottom: '2px' }}>
                      Critical Philological Accuracy
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45, display: 'block' }}>
                      Editions prepared by eminent scholars with authentic palm-leaf readings and word-by-word commentaries.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (BILINGUAL FAQ ACCORDION) */}
      <section id="faqs" className="homepage-section reveal-on-scroll revealed" aria-label="Frequently Asked Questions" style={{ backgroundColor: '#FAF7F2', padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <HelpCircle size={18} color="var(--color-maroon)" />
              <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-maroon)' }}>
                Reader Assistance & Queries · ಪ್ರಶ್ನೋತ್ತರಗಳು
              </span>
            </div>

            <h2 className="text-serif" style={{ fontSize: 'clamp(1.75rem, 2.8vw, 2.25rem)', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '10px' }}>
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
              Everything you need to know about purchasing authentic publications, India Post Speed Post delivery across India, statutory 0% GST exemptions, and bulk library procurement.
            </p>
          </div>

          {/* Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {homeFaqs.map((faq) => {
              const isExpanded = expandedHomeFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isExpanded ? '1.5px solid var(--color-maroon)' : '1px solid var(--color-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: isExpanded ? '0 6px 18px rgba(94, 22, 36, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedHomeFaqId(prev => (prev === faq.id ? null : faq.id))}
                    aria-expanded={isExpanded}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.6px',
                          color: 'var(--color-maroon)'
                        }}
                      >
                        {faq.category}
                      </span>
                      <h3
                        className="text-serif"
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: isExpanded ? 'var(--color-maroon)' : 'var(--color-text-charcoal)',
                          lineHeight: 1.35,
                          margin: 0
                        }}
                      >
                        {faq.question}
                      </h3>
                      {faq.questionKn && (
                        <div style={{ fontSize: '0.84rem', color: 'var(--color-maroon)', marginTop: '2px' }}>
                          {faq.questionKn}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isExpanded ? 'var(--color-maroon)' : '#FAF7F2',
                        color: isExpanded ? '#FFFFFF' : 'var(--color-maroon)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: '0 20px 18px',
                        borderTop: '1px solid var(--color-border-subtle)',
                        backgroundColor: '#FCFAF7',
                        paddingTop: '14px'
                      }}
                    >
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--color-text-charcoal)', lineHeight: 1.65 }}>
                        {faq.answer}
                      </p>
                      {faq.answerKn && (
                        <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                          {faq.answerKn}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Actions Row */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => onNavigate('/faqs')}
              className="btn btn-secondary"
              style={{ gap: '8px', padding: '10px 24px', fontSize: '0.88rem' }}
            >
              <span>View All Frequently Asked Questions</span>
              <ArrowRight size={14} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="var(--color-maroon)" />
                <span>Sales Counter: <strong>+91 821 2548212</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="var(--color-maroon)" />
                <span>Email: <strong>publications@jssonline.org</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BULK & INSTITUTIONAL ORDERS CALLOUT (REGAL MAROON & GOLD BANNER) */}
      <section className="homepage-section reveal-on-scroll" aria-label="Bulk Orders Callout">
        <div className="container">
          <div className="bulk-callout-banner">
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Library size={18} color="#DFBF5F" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#DFBF5F', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Institutions, Libraries, Mutts & Study Circles
                </span>
              </div>
              <h2 className="text-serif" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                BULK & INSTITUTIONAL ORDERS
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                Special library endowment terms, consolidated GST-exempt invoicing, and registered postal delivery for educational institutions, university libraries, mutts, and research departments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/bulk-orders')}
              className="btn btn-institutional-gold"
            >
              <span>Submit Institutional Enquiry</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
