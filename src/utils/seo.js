/**
 * JSS Publications — Centralized SEO, AEO & AI Discoverability Manager
 *
 * Provides authoritative, deterministic metadata management for:
 * - Traditional Search Engines (Google, Bing)
 * - AI Answer Engines & Generative Search (ChatGPT Search, Perplexity, Google AI Overviews, Claude, Bing Copilot)
 * - Social Graph Previews (Open Graph, Twitter Cards)
 * - Schema.org JSON-LD Structured Data (Organization, BookStore, WebSite, Book, Product, ItemList, BreadcrumbList, FAQPage)
 * - Canonical URL hygiene (UTM stripping, clean path canonicalization)
 */

export const BASE_URL = 'https://publications.jssonline.org';
export const PUBLISHER_NAME = 'Jagadguru Sri Shivarathreeshwara Granthamale';
export const PARENT_ORG_NAME = 'JSS Mahavidyapeetha';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/jss-logo.webp`;

// Static entity IDs for Schema.org linked data graph
export const ENTITY_IDS = {
  ORGANIZATION: `${BASE_URL}/#organization`,
  BOOKSTORE: `${BASE_URL}/#bookhouse`,
  WEBSITE: `${BASE_URL}/#website`
};

/**
 * Strips UTM and volatile query parameters to derive authoritative canonical URL
 * @param {string} route
 * @returns {string} Clean canonical URL
 */
export function getCanonicalUrl(route = '/') {
  // Strip hash and query parameters
  const cleanPath = (route || '/')
    .split('#')[0]
    .split('?')[0]
    .trim();

  // Normalize root path
  if (!cleanPath || cleanPath === '/' || cleanPath === '/home') {
    return `${BASE_URL}/`;
  }

  // Ensure leading slash and remove trailing slash for internal routes
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${BASE_URL}${normalizedPath.replace(/\/+$/, '')}`;
}

/**
 * Creates breadcrumb structured data
 * @param {Array<{ name: string, url: string }>} items
 * @returns {object} Schema.org BreadcrumbList
 */
export function generateBreadcrumbSchema(items = []) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url.startsWith('/') ? item.url : `/${item.url}`}`
    }))
  };
}

/**
 * Injects or updates dynamic JSON-LD structured data in the document head
 * @param {string} id Unique script ID
 * @param {object} schemaData JSON-LD payload
 */
export function injectJsonLd(id, schemaData) {
  if (typeof document === 'undefined') return;

  let scriptEl = document.getElementById(id);
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = id;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  scriptEl.textContent = JSON.stringify(schemaData, null, 2);
}

/**
 * Sets or updates a <meta> tag
 * @param {string} key 'name' or 'property'
 * @param {string} keyValue The attribute value
 * @param {string} content The content value
 */
function setMetaTag(key, keyValue, content) {
  if (typeof document === 'undefined') return;
  if (!content) return;

  let meta = document.querySelector(`meta[${key}="${keyValue}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(key, keyValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Sets or updates the canonical link tag
 * @param {string} url
 */
function setCanonical(url) {
  if (typeof document === 'undefined') return;

  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Core Institutional FAQs for Answer Engine Optimization (AEO) & AI Overviews
 */
export const INSTITUTIONAL_FAQS = [
  {
    question: "What is Jagadguru Sri Shivarathreeshwara Granthamale (JSS Publications)?",
    answer: "Jagadguru Sri Shivarathreeshwara Granthamale is the premier publications and research wing of JSS Mahavidyapeetha, Mysuru. Founded under the spiritual auspices of Sri Suttur Veerashimhasana Math, it has been publishing authentic editions of 12th-century Vachana literature, Shaiva Agamas, Indian philosophy, and classical Kannada treatises since the mid-20th century."
  },
  {
    question: "Where is the physical JSS Book House located in Mysuru?",
    answer: "The physical JSS Book House retail counter is situated at JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004. It is open Monday to Saturday from 9:30 AM to 6:00 PM IST."
  },
  {
    question: "How are books shipped to individual readers across India?",
    answer: "All orders are dispatched directly from the Mysuru publication press and retail counter via India Post (Speed Post and Registered Book Parcel). Orders above ₹500 qualify for free postal delivery anywhere in India."
  },
  {
    question: "Are GST charges applicable on JSS publications?",
    answer: "Under statutory GST regulations for the Government of India (HSN 4901), printed books, journals, sacred scriptures, and classical publications are completely exempt from GST (0% CGST/SGST/IGST)."
  },
  {
    question: "Can universities, colleges, and libraries place bulk procurement orders?",
    answer: "Yes. JSS Publications provides institutional library procurement desks with graded institutional subsidies (10% to 20%), official proforma invoices, and direct dispatch for universities, colleges, research institutes, and public libraries."
  },
  {
    question: "What major canonical works are published by JSS Granthamale?",
    answer: "Key publications include the monumental 896-page 'Shivapada Ratnakosha' lexicon, authoritative critical editions of 'Sharanara Vachanagalu', 'Allama Prabhu Devara Vachana', exegeses on 'Patanjali Yoga Sutras' and 'Shiva Sutras', bi-monthly journal 'Prasada' (published continuously for over 58 years), and chronicles of Sri Suttur Math."
  }
];

/**
 * Updates full head metadata and structured data dynamically per active route
 * @param {object} params Route context and book data
 */
export function updateSEO({
  route = '/',
  routeType = 'home',
  book = null,
  category = null,
  searchQuery = ''
}) {
  if (typeof document === 'undefined') return;

  const canonicalUrl = getCanonicalUrl(route);
  setCanonical(canonicalUrl);

  // Default values
  let title = 'JSS Publications | Jagadguru Sri Shivarathreeshwara Granthamale, Mysuru';
  let description = 'Authentic Vachana literature, Shaiva Agamas, Indian philosophy, spiritual discourses, and academic treatises published by JSS Mahavidyapeetha, Mysuru. Non-profit subsidized editions with India Post dispatch.';
  let keywords = 'JSS Publications, JSS Granthamale, JSS Book House, Mysuru, Vachana Literature, Basavanna, Allama Prabhu, Lingayat Philosophy, Shaiva Agamas, Kannada Books, Suttur Math';
  let ogType = 'website';
  let ogImage = DEFAULT_OG_IMAGE;
  let robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  let jsonLdPayload = null;

  switch (routeType) {
    case 'home': {
      title = 'JSS Publications | Jagadguru Sri Shivarathreeshwara Granthamale & JSS Book House, Mysuru';
      description = 'Official online bookstore of Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru. Discover authentic 12th-century Vachana literature, Shaiva Agamas, Yoga Sutras, and classical Kannada works.';
      ogImage = DEFAULT_OG_IMAGE;

      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': ENTITY_IDS.WEBSITE,
            url: BASE_URL,
            name: 'JSS Publications',
            alternateName: 'Jagadguru Sri Shivarathreeshwara Granthamale',
            description: 'Official bookstore and publications repository of JSS Mahavidyapeetha, Mysuru.',
            publisher: { '@id': ENTITY_IDS.ORGANIZATION },
            inLanguage: ['en-IN', 'kn-IN'],
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/books?search={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@type': 'FAQPage',
            '@id': `${BASE_URL}/#faq`,
            mainEntity: INSTITUTIONAL_FAQS.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          }
        ]
      };
      break;
    }

    case 'books': {
      const isFiltered = category && category !== 'All Categories';
      title = isFiltered
        ? `${category} Books | JSS Granthamale Catalogue, Mysuru`
        : 'Catalogue of Publications | JSS Granthamale, Mysuru';
      description = isFiltered
        ? `Browse authentic publications in ${category} from Jagadguru Sri Shivarathreeshwara Granthamale. Subsidized retail prices and India Post postal dispatch.`
        : 'Explore the complete catalogue of 49 authentic publications by JSS Mahavidyapeetha, including Vachana literature, Veerashaiva philosophy, yoga, and heritage.';
      keywords = `JSS Publications catalogue, ${category || 'Kannada books'}, Vachana literature Mysuru, Lingayat philosophy books`;

      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': `${canonicalUrl}#collection`,
            url: canonicalUrl,
            name: title,
            description,
            isPartOf: { '@id': ENTITY_IDS.WEBSITE }
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: isFiltered ? category : 'Publications Catalogue', url: '/books' }
          ])
        ]
      };
      break;
    }

    case 'book-detail': {
      if (book) {
        const authorStr = book.author ? ` by ${book.author}` : '';
        title = `${book.title}${book.titleKannada ? ` (${book.titleKannada})` : ''}${authorStr} | JSS Publications`;
        description = book.shortDescription || 
          `Buy authentic edition of "${book.title}" (${book.titleKannada || ''}) published by Jagadguru Sri Shivarathreeshwara Granthamale, Mysuru. Price: ₹${book.price}. India Post delivery across India.`;
        keywords = `${book.title}, ${book.titleKannada || ''}, ${book.author || ''}, ${book.category || ''}, JSS Publications, JSS Granthamale Mysuru, Kannada book`;
        ogType = 'book';
        ogImage = book.webpImage ? `${BASE_URL}${book.webpImage}` : DEFAULT_OG_IMAGE;

        // Structured Data: Book & Product
        const defaultEdition = book.editions && book.editions.length > 0 ? book.editions[0] : null;
        const isbn = defaultEdition?.isbn || book.isbn || 'JSS-PUB-0001';
        const price = defaultEdition?.sellingPrice || book.price || 150;

        jsonLdPayload = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': ['Book', 'Product'],
              '@id': `${canonicalUrl}#book`,
              name: book.title,
              alternateName: book.titleKannada || undefined,
              author: {
                '@type': 'Person',
                name: book.author || 'JSS Granthamale Editorial Board'
              },
              publisher: { '@id': ENTITY_IDS.ORGANIZATION },
              inLanguage: book.language ? (book.language.includes('Kannada') ? 'kn' : 'en') : 'kn',
              isbn: isbn,
              bookFormat: defaultEdition?.binding === 'Hardbound' 
                ? 'https://schema.org/Hardcover' 
                : 'https://schema.org/Paperback',
              numberOfPages: defaultEdition?.pages || book.pages || undefined,
              image: ogImage,
              description: book.shortDescription || description,
              offers: {
                '@type': 'Offer',
                price: price,
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
                itemCondition: 'https://schema.org/NewCondition',
                url: canonicalUrl,
                seller: { '@id': ENTITY_IDS.BOOKSTORE }
              }
            },
            generateBreadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Books', url: '/books' },
              { name: book.category || 'Literature', url: '/books' },
              { name: book.title, url: canonicalUrl }
            ])
          ]
        };
      } else {
        title = 'Publication Not Found | JSS Granthamale, Mysuru';
        description = 'The requested publication could not be located in the JSS Publications catalogue.';
        robots = 'noindex, nofollow';
      }
      break;
    }

    case 'categories': {
      title = 'Subject Folios & Publishing Categories | JSS Granthamale, Mysuru';
      description = 'Explore publications by thematic classification: Vachana Literature, Veerashaiva Philosophy, Spirituality & Yoga, Biographies & Heritage, and Education & Science.';
      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': `${canonicalUrl}#categories`,
            url: canonicalUrl,
            name: title,
            description,
            isPartOf: { '@id': ENTITY_IDS.WEBSITE }
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Categories & Folios', url: '/categories' }
          ])
        ]
      };
      break;
    }

    case 'bulk-orders': {
      title = 'Institutional & Library Bulk Procurement | JSS Publications, Mysuru';
      description = 'Official procurement portal for university, college, research, and public libraries. Subsidized volume discounts (10% to 20%), proforma invoicing, and dispatch from JSS Mahavidyapeetha.';
      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${canonicalUrl}#procurement`,
            url: canonicalUrl,
            name: title,
            description,
            isPartOf: { '@id': ENTITY_IDS.WEBSITE }
          },
          {
            '@type': 'Service',
            name: 'JSS Institutional Library Procurement Desk',
            provider: { '@id': ENTITY_IDS.ORGANIZATION },
            serviceType: 'Library Book Supply & Monograph Procurement',
            areaServed: 'IN',
            termsOfService: 'Graded volume discounts on non-profit subsidized publications for recognized academic and public libraries.'
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Institutional Procurement', url: '/bulk-orders' }
          ])
        ]
      };
      break;
    }

    case 'about': {
      title = 'Heritage & History | Jagadguru Sri Shivarathreeshwara Granthamale, Mysuru';
      description = 'Learn about the 70+ year legacy of JSS Granthamale, established by Mantra Maharshi Sri Shivarathri Rajendra Mahaswamiji to preserve palm-leaf manuscripts and publish classical Veerashaiva thought.';
      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'AboutPage',
            '@id': `${canonicalUrl}#about`,
            url: canonicalUrl,
            name: title,
            description,
            isPartOf: { '@id': ENTITY_IDS.WEBSITE },
            about: { '@id': ENTITY_IDS.ORGANIZATION }
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Heritage & History', url: '/about' }
          ])
        ]
      };
      break;
    }

    case 'contact': {
      title = 'Contact & Retail Counter | JSS Book House, Mysuru';
      description = 'Visit JSS Book House at Dr. Shivarathri Rajendra Circle, Mysuru, or contact JSS Publications Division by phone (+91-821-2548212) or email for postal orders and reader enquiries.';
      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ContactPage',
            '@id': `${canonicalUrl}#contact`,
            url: canonicalUrl,
            name: title,
            description,
            isPartOf: { '@id': ENTITY_IDS.WEBSITE },
            mainEntity: { '@id': ENTITY_IDS.BOOKSTORE }
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Contact & Retail Counter', url: '/contact' }
          ])
        ]
      };
      break;
    }

    case 'cart': {
      title = 'Shopping Cart | JSS Publications';
      description = 'Review selected publications in your shopping cart before proceeding to postal dispatch and checkout.';
      robots = 'noindex, nofollow';
      break;
    }

    case 'checkout': {
      title = 'Postal Dispatch & Checkout | JSS Publications, Mysuru';
      description = 'Enter postal delivery details for direct Speed Post dispatch from JSS Book House, Mysuru.';
      robots = 'noindex, nofollow';
      break;
    }

    default: {
      title = 'Page Not Found | JSS Publications, Mysuru';
      description = 'The requested page could not be found. Explore our complete catalogue of publications.';
      robots = 'noindex, nofollow';
      break;
    }
  }

  // Update DOM Title and Standard Metas
  document.title = title;
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'keywords', keywords);
  setMetaTag('name', 'robots', robots);

  // Update Open Graph Metas
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:site_name', PUBLISHER_NAME);
  setMetaTag('property', 'og:locale', 'en_IN');

  // Update Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', ogImage);

  // Inject Dynamic JSON-LD structured data
  if (jsonLdPayload) {
    injectJsonLd('dynamic-seo-ld', jsonLdPayload);
  } else {
    const existing = document.getElementById('dynamic-seo-ld');
    if (existing) existing.remove();
  }
}
