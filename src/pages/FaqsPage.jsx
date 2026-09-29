import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Phone, Mail, MapPin, ArrowRight, BookOpen, ShieldCheck, Truck } from 'lucide-react';
import { adminService } from '../services';

const FAQ_CATEGORIES = [
  'All',
  'Ordering',
  'Payments',
  'Shipping',
  'Returns',
  'Books',
  'Bulk Orders',
  'JSS Publications'
];

export default function FaqsPage({ onNavigate }) {
  const [faqs, setFaqs] = useState(() => adminService.getPublishedFaqs());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState('faq-01');

  useEffect(() => {
    return adminService.subscribe(() => {
      setFaqs(adminService.getPublishedFaqs());
    });
  }, []);

  const filteredFaqs = useMemo(() => {
    let result = faqs;
    if (activeCategory !== 'All') {
      result = result.filter(f => f.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.category && f.category.toLowerCase().includes(q))
      );
    }
    return result;
  }, [faqs, activeCategory, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="faqs-page-wrapper" style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', paddingBottom: '70px' }}>
      {/* Editorial Page Header */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--color-border)', padding: '48px 0 38px' }}>
        <div className="container" style={{ maxWidth: '920px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <HelpCircle size={18} color="var(--color-maroon)" />
            <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-maroon)' }}>
              Reader Support & Assistance · ಪ್ರಶ್ನೋತ್ತರಗಳು
            </span>
          </div>

          <h1 className="text-serif" style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '10px', lineHeight: 1.2 }}>
            FREQUENTLY ASKED QUESTIONS
          </h1>

          <p style={{ fontSize: '0.96rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 28px' }}>
            Authoritative information regarding publication ordering, India Post registered delivery, 0% GST statutory exemptions, library bulk procurement, and reader assistance.
          </p>

          {/* Interactive Search Bar */}
          <div style={{ position: 'relative', maxWidth: '580px', margin: '0 auto' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, question, or keyword (e.g., shipping, GST, tracking, bulk)..."
              style={{
                width: '100%',
                padding: '13px 18px 13px 44px',
                fontSize: '0.92rem',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--color-border-dark)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(94, 22, 36, 0.05)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <div className="container" style={{ maxWidth: '920px', paddingTop: '36px' }}>
        {/* Category Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '28px',
            scrollbarWidth: 'none'
          }}
          role="tablist"
        >
          {FAQ_CATEGORIES.map(category => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.84rem',
                fontWeight: 600,
                border: activeCategory === category ? '1.5px solid var(--color-maroon)' : '1px solid var(--color-border)',
                backgroundColor: activeCategory === category ? 'var(--color-maroon)' : '#FFFFFF',
                color: activeCategory === category ? '#FFFFFF' : 'var(--color-text-charcoal)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: activeCategory === category ? '0 2px 8px rgba(94, 22, 36, 0.2)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQs Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center'
            }}
          >
            <HelpCircle size={36} color="var(--color-border-dark)" style={{ margin: '0 auto 12px' }} />
            <h3 className="text-serif" style={{ fontSize: '1.25rem', color: 'var(--color-text-charcoal)', marginBottom: '6px' }}>
              No matching questions found
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
              Try adjusting your search terms or select "All" categories to view all published guidelines.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="btn btn-secondary btn-sm"
            >
              Reset Search & Category
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <article
                  key={faq.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isExpanded ? '1.5px solid var(--color-maroon)' : '1px solid var(--color-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: isExpanded ? '0 6px 18px rgba(94, 22, 36, 0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(faq.id)}
                    aria-expanded={isExpanded}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
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
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.6px',
                          color: 'var(--color-maroon)'
                        }}
                      >
                        {faq.category}
                      </span>
                      <h2
                        className="text-serif"
                        style={{
                          fontSize: '1.14rem',
                          fontWeight: 700,
                          color: isExpanded ? 'var(--color-maroon)' : 'var(--color-text-charcoal)',
                          lineHeight: 1.35,
                          margin: 0
                        }}
                      >
                        {faq.question}
                      </h2>
                    </div>

                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isExpanded ? 'var(--color-maroon)' : 'var(--color-bg-neutral)',
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
                        padding: '0 22px 20px',
                        borderTop: '1px solid var(--color-border-subtle)',
                        paddingTop: '14px'
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.92rem',
                          color: '#4A423D',
                          lineHeight: 1.7,
                          margin: 0
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Quick Contact & Assistance Card */}
        <section
          style={{
            marginTop: '44px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(197, 155, 39, 0.4)',
            borderLeft: '4px solid var(--color-maroon)',
            borderRadius: '8px',
            padding: '28px',
            boxShadow: '0 4px 16px rgba(94, 22, 36, 0.06)'
          }}
          aria-label="Direct Assistance"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '580px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-maroon)', display: 'block', marginBottom: '4px' }}>
                Still Have Questions?
              </span>
              <h3 className="text-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-charcoal)', marginBottom: '8px' }}>
                Contact the JSS Book House Desk in Mysuru
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                Our team is available Monday through Saturday from 9:30 AM to 6:00 PM IST to assist with special edition requests, consignment dispatches, and mutt library procurement.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/contact')}
                className="btn btn-primary"
                style={{ padding: '10px 20px', gap: '6px' }}
              >
                <span>Bookstore Contact</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/bulk-orders')}
                className="btn btn-outline"
                style={{ padding: '10px 18px' }}
              >
                <span>Bulk Enquiries</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
