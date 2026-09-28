/**
 * Catalogue Domain Service
 * Authoritative provider of JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale.
 *
 * Responsibilities:
 * - Clear separation of intellectual work (Book) and physical format (Edition)
 * - Deterministic pricing, ISBN, and stock per binding
 * - Institutional metadata normalization (Kannada script, series, categories, endowments)
 * - Multi-tier resilient cover image resolution with SVG fallback
 * - Full backward-compatibility layer for existing components
 */

import rawBooks from '../data/rawBooks.js';

// Authentic Kannada script title mapping for canonical works
const KANNADA_TITLE_MAP = {
  "Shivapada Ratnakosha": "ಶಿವಪದ ರತ್ನಕೋಶ",
  "Sadhana – Path of Liberation": "ಸಾಧನಾ – ಮುಕ್ತಿಯ ಹಾದಿ",
  "Patanjali Yoga Sutras": "ಪಾತಂಜಲ ಯೋಗ ಸೂತ್ರಗಳು",
  "Narada Bhakti Sutras": "ನಾರದ ಭಕ್ತಿ ಸೂತ್ರಗಳು",
  "The Heritage of Sri Suttur Math": "ಶ್ರೀ ಸುತ್ತೂರು ಮಠದ ಪರಂಪರೆ",
  "Shiva Sutras": "ಶಿವ ಸೂತ್ರಗಳು",
  "Allama Prabhu Devara Vachana": "ಅಲ್ಲಮಪ್ರಭುದೇವರ ವಚನ ಸಂಪುಟ",
  "Basava Darshana": "ಬಸವ ದರ್ಶನ",
  "Basava Darshana (English)": "ಬಸವ ದರ್ಶನ (ಆಂಗ್ಲ)",
  "Heart To Heart": "ಹೃದಯ ಸಂವಾದ",
  "Heart To Heart - Enlarged Edition": "ಹೃದಯ ಸಂವಾದ (ವಿಸ್ತೃತ ಆವೃತ್ತಿ)",
  "Heart to Heart": "ಹೃದಯ ಸಂವಾದ (ಡಾ. ಎ.ಪಿ.ಜೆ. ಅಬ್ದುಲ್ ಕಲಾಂ)",
  "Bhakthibhandari Basavannanavaru": "ಭಕ್ತಿಭಂಡಾರಿ ಬಸವಣ್ಣನವರು",
  "Bhakthibhandari Basavannanavaru (Kannada)": "ಭಕ್ತಿಭಂಡಾರಿ ಬಸವಣ್ಣನವರು",
  "Vrushabendra Vilasa": "ವೃಷಭೇಂದ್ರ ವಿಲಾಸ",
  "Sharanara Vachanagalu": "ಶರಣರ ವಚನಗಳು",
  "Sharanara Vachanagalu – Edition 4": "ಶರಣರ ವಚನಗಳು (೪ನೇ ಆವೃತ್ತಿ)",
  "Sharanara Vachanagalu – Edition 10": "ಶರಣರ ವಚನಗಳು (೧೦ನೇ ಆವೃತ್ತಿ)",
  "Sharanara Vachanagalu – Edition 11": "ಶರಣರ ವಚನಗಳು (೧೧ನೇ ಆವೃತ್ತಿ)",
  "Kayaka Mattu Sharanaru": "ಕಾಯಕ ಮತ್ತು ಶರಣರು",
  "Asthavarana": "ಅಷ್ಟಾವರಣ ವಿವರಣೆ",
  "Shatsthala Jnana Charitamrutha": "ಷಟ್‌ಸ್ಥಲ ಜ್ಞಾನ ಚರಿತಾಮೃತ",
  "Veerashaiva Darshana": "ವೀರಶೈವ ದರ್ಶನ",
  "Veerashiva Darshana": "ವೀರಶೈವ ದರ್ಶನ",
  "Veerashiva Dharma Darshana": "ವೀರಶೈವ ಧರ್ಮ ದರ್ಶನ",
  "Vishwa Dharma Darshana": "ವಿಶ್ವಧರ್ಮ ದರ್ಶನ",
  "Siddharama Charithe": "ಸಿದ್ಧರಾಮ ಚರಿತೆ",
  "Akka Mahadevi": "ಅಕ್ಕಮಹಾದೇವಿ ವಚನಗಳು",
  "Channabasavanna": "ಚೆನ್ನಬಸವಣ್ಣನವರ ವಚನಗಳು",
  "Prasada": "ಪ್ರಸಾದ (ದ್ವೈಮಾಸಿಕ ಪತ್ರಿಕೆ)",
  "Prasada Sampada": "ಪ್ರಸಾದ ಸಂಪದ",
  "Swara Vachana Samputa": "ಸ್ವರ ವಚನ ಸಂಪುಟ",
  "Yella Puratana Vachanagalu": "ಎಲ್ಲಾ ಪುರಾತನರ ವಚನಗಳು",
  "Shatasthalagalu": "ಷಟ್‌ಸ್ಥಲಗಳು",
  "Panchachara": "ಪಂಚಾಚಾರ ವಿವರಣೆ",
  "Shaivagamagalu": "ಶೈವಾಗಮಗಳು",
  "Molige Mahadevi Vachanagalu": "ಮೊಳಿಗೆ ಮಹಾದೇವಿ ವಚನಗಳು",
  "Dharmaratnakara K Nandibasappa": "ಧರ್ಮರತ್ನಕರ ಕೆ. ನಂದಿಬಸಪ್ಪ",
  "Dr. M J Najundaradya": "ಡಾ. ಎಂ.ಜೆ. ನಂಜುಂಡಾರಾಧ್ಯ",
  "M N Mahanthadevaru": "ಎಂ.ಎನ್. ಮಹಾಂತದೇವರು",
  "C Ankappa": "ಸಿ. ಅಂಕಪ್ಪ",
  "S N Mariyappa": "ಎಸ್.ಎನ್. ಮರಿಯಪ್ಪ",
  "M N Basavarajayya": "ಎಂ.ಎನ್. ಬಸವರಾಜಯ್ಯ",
  "Sirumana charithe": "ಸಿರುಮನ ಚರಿತೆ",
  "Kayaka Tapasvi Sri Shivaratri Rajendra Mahaswamigalu (Telugu)": "ಕಾಯಕ ತಪಸ್ವಿ ಶ್ರೀ ಶಿವರಾತ್ರಿ ರಾಜೇಂದ್ರ ಮಹಾಸ್ವಾಮಿಗಳು"
};

// Standard Institutional Category Definitions
export const CATEGORY_DEFINITIONS = {
  "Vachana Literature": {
    nameKannada: "ವಚನ ಸಾಹಿತ್ಯ",
    description: "Classical 12th-century Sharana literature, commentaries on Basavanna, Allama Prabhu, Akkamahadevi, and philosophical verses.",
    shelfColor: "#5E1624"
  },
  "Veerashaiva Philosophy": {
    nameKannada: "ವೀರಶೈವ ತತ್ವಶಾಸ್ತ್ರ",
    description: "Scholarly treatises on Veerashaiva-Lingayat religious terminologies, Agamas, Shatsthala philosophy, and comparative Indian thought.",
    shelfColor: "#420D18"
  },
  "Spirituality & Yoga": {
    nameKannada: "ಅಧ್ಯಾತ್ಮ ಮತ್ತು ಯೋಗ",
    description: "Authentic commentaries on Patanjali Yoga Sutras, Shiva Sutras, Narada Bhakti Sutras, and spiritual discourses by revered Swamijis.",
    shelfColor: "#7A2132"
  },
  "Biographies & Heritage": {
    nameKannada: "ಚರಿತ್ರೆ ಮತ್ತು ಪರಂಪರೆ",
    description: "Historical chronicles and biographies of Sharana saints, scholars, and the historic lineage of Jagadguru Sri Suttur Math.",
    shelfColor: "#A84214"
  },
  "Education & Science": {
    nameKannada: "ಶಿಕ್ಷಣ ಮತ್ತು ವಿಜ್ಞಾನ",
    description: "Works on modern education, library science, scientific philosophy, and visionary speeches including Dr. A.P.J. Abdul Kalam.",
    shelfColor: "#2D2624"
  }
};

export const CANONICAL_SERIES = [
  "All Series",
  "Sharana Samskruti Male",
  "Vachana Vyakyana Male",
  "Golden Jubilee Endowment Series"
];

export const CANONICAL_LANGUAGES = [
  "All Languages",
  "Kannada",
  "English",
  "Tamil",
  "Telugu"
];

// Authentic Periodicals Published by JSS Granthamale
export const CANONICAL_PERIODICALS = [
  {
    id: "prasada",
    name: "Prasada (ಪ್ರಸಾದ)",
    frequency: "Bimonthly (6 Issues / Year)",
    language: "Bilingual (Kannada & English)",
    foundedYear: 1967,
    priceYearly: 300,
    issn: "0970-4235",
    description: "Flagship cultural and philosophical journal featuring scholarly articles on Vachana literature, Lingayat tradition, and spiritual heritage. Published continuously since 1967.",
    coverUrl: "https://jssonline.org/wp-content/uploads/2021/11/Prasada.jpg"
  },
  {
    id: "sharanapatha",
    name: "Sharanapatha (ಶರಣಪಥ)",
    frequency: "Bi-Annual (2 Issues / Year)",
    language: "English",
    foundedYear: 1990,
    priceYearly: 200,
    issn: "0971-8893",
    description: "Scholarly English research journal dedicated to introducing Vachana philosophy and Indian spirituality to international readers and academic researchers.",
    coverUrl: "https://jssonline.org/wp-content/uploads/2021/11/Sharanapatha.jpg"
  },
  {
    id: "panchanga",
    name: "JSS Kannada Panchanga 2026",
    frequency: "Annual",
    language: "Kannada",
    foundedYear: 1954,
    priceYearly: 80,
    issn: "Registered Calendar",
    description: "Official astronomical calendar detailing tithi, nakshatra, religious festivals, and auspicious times calculated according to traditional sidereal astronomy.",
    coverUrl: "https://jssonline.org/wp-content/uploads/2021/11/Panchanga.jpg"
  }
];

/**
 * Robust numerical price parser
 */
function parsePrice(priceStr, fallback = 150) {
  if (typeof priceStr === 'number') return priceStr > 0 ? priceStr : fallback;
  if (!priceStr) return fallback;
  const match = String(priceStr).match(/\d+/);
  return match ? parseInt(match[0], 10) : fallback;
}

/**
 * Generate a deterministically branded SVG fallback book cover
 */
export function generateFallbackSvgCover(title, author = 'JSS Publications') {
  const safeTitle = encodeURIComponent(title || 'JSS Publication');
  const safeAuthor = encodeURIComponent(author || 'Jagadguru Sri Shivarathreeshwara Granthamale');

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23FAF7F2"/><rect x="14" y="14" width="272" height="392" fill="%235E1624" rx="4"/><rect x="22" y="22" width="256" height="376" fill="none" stroke="%23E5DFD5" stroke-width="1.2"/><text x="50%" y="46%" fill="%23FFFFFF" font-size="16" font-family="serif" text-anchor="middle" font-weight="bold">${safeTitle}</text><text x="50%" y="54%" fill="%23DFBF5F" font-size="12" font-family="sans-serif" text-anchor="middle">${safeAuthor}</text></svg>`;
}

/**
 * Build editions array for a book based on scraped prices and bindings
 */
function buildEditions(bookId, rawItem, parsedPrices) {
  const editions = [];
  const basePages = rawItem.pages ? parseInt(rawItem.pages, 10) : 180;
  const idStr = String(rawItem.id || 1).padStart(4, '0');

  // 1. Standard Paperback Edition
  const pbPrice = parsedPrices.paperback;
  editions.push({
    editionId: `jss-pub-${idStr}-pb`,
    bookId: `jss-pub-${idStr}`,
    binding: 'Paperback',
    formatLabel: 'Standard Paperback (ಸಾಮಾನ್ಯ ಆವೃತ್ತಿ)',
    isbn: `978-81-94921-${idStr}-1`,
    pages: basePages,
    weightGrams: Math.round(basePages * 1.1 + 45),
    mrp: pbPrice,
    sellingPrice: pbPrice,
    discountPercent: 0,
    inStock: true,
    stockQuantity: 45,
    maxOrderLimit: 10
  });

  // 2. Hardbound / Special Edition (if present in dataset)
  if (parsedPrices.hardbound) {
    const hbPrice = parsedPrices.hardbound;
    editions.push({
      editionId: `jss-pub-${idStr}-hb`,
      bookId: `jss-pub-${idStr}`,
      binding: 'Hardbound',
      formatLabel: 'Deluxe Hardbound (ಗಟ್ಟಿ ರಟ್ಟಿನ ಆವೃತ್ತಿ)',
      isbn: `978-81-94921-${idStr}-2`,
      pages: basePages,
      weightGrams: Math.round(basePages * 1.1 + 220),
      mrp: Math.round(hbPrice * 1.15),
      sellingPrice: hbPrice,
      discountPercent: Math.round(((hbPrice * 1.15 - hbPrice) / (hbPrice * 1.15)) * 100),
      inStock: true,
      stockQuantity: 20,
      maxOrderLimit: 10
    });
  }

  // 3. Deluxe Edition (if present in dataset)
  if (parsedPrices.deluxe) {
    const dxPrice = parsedPrices.deluxe;
    editions.push({
      editionId: `jss-pub-${idStr}-dx`,
      bookId: `jss-pub-${idStr}`,
      binding: 'Deluxe Hardbound',
      formatLabel: 'Collector Deluxe Edition (ವಿಶೇಷ ಸಂಪುಟ)',
      isbn: `978-81-94921-${idStr}-3`,
      pages: basePages,
      weightGrams: Math.round(basePages * 1.1 + 280),
      mrp: Math.round(dxPrice * 1.2),
      sellingPrice: dxPrice,
      discountPercent: Math.round(((dxPrice * 1.2 - dxPrice) / (dxPrice * 1.2)) * 100),
      inStock: true,
      stockQuantity: 12,
      maxOrderLimit: 5
    });
  }

  return editions;
}

/**
 * Standardize and enrich raw scraped items into canonical Book entities
 */
function normalizeBook(rawItem, index) {
  const numericId = rawItem.id || index + 1;
  const canonicalId = `jss-pub-${String(numericId).padStart(4, '0')}`;
  const slug = (rawItem.title || `book-${numericId}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const knTitle = KANNADA_TITLE_MAP[rawItem.title] || 
    (rawItem.title && rawItem.title.match(/[\u0C80-\u0CFF]/) ? rawItem.title : '');

  // Categorization
  let stdCategory = "Vachana Literature";
  const rawCat = (rawItem.category || "").toLowerCase();
  if (rawCat.includes("yoga") || rawCat.includes("spirituality") || rawCat.includes("meditation") || rawCat.includes("bhakti")) {
    stdCategory = "Spirituality & Yoga";
  } else if (rawCat.includes("veerashaiva") || rawCat.includes("philosophy") || rawCat.includes("religion") || rawCat.includes("ethics")) {
    stdCategory = "Veerashaiva Philosophy";
  } else if (rawCat.includes("biography") || rawCat.includes("history")) {
    stdCategory = "Biographies & Heritage";
  } else if (rawCat.includes("science") || rawCat.includes("education") || rawCat.includes("globalization") || rawCat.includes("library")) {
    stdCategory = "Education & Science";
  }

  // Series
  let seriesName = rawItem.series || "";
  if (!seriesName) {
    if ((rawItem.title || "").toLowerCase().includes("vachana")) {
      seriesName = "Vachana Vyakyana Male";
    } else if (rawCat.includes("vachana") || (rawItem.title || "").toLowerCase().includes("sharana")) {
      seriesName = "Sharana Samskruti Male";
    } else if ((rawItem.description || "").toLowerCase().includes("golden jubilee") || (rawItem.description || "").toLowerCase().includes("endowment")) {
      seriesName = "Golden Jubilee Endowment Series";
    }
  }

  // Prices parsing for multi-edition support
  const pbPrice = parsePrice(rawItem.price, 150);
  const hbPrice = rawItem.special_price ? parsePrice(rawItem.special_price) : null;
  const dxPrice = rawItem.deluxe_price ? parsePrice(rawItem.deluxe_price) : null;

  const editions = buildEditions(canonicalId, rawItem, {
    paperback: pbPrice,
    hardbound: hbPrice,
    deluxe: dxPrice
  });

  const isEndowment = seriesName === "Golden Jubilee Endowment Series" || 
    (rawItem.description && rawItem.description.toLowerCase().includes("endowment"));

  // Cover image paths
  let cleanLocalPath = null;
  let cleanWebpPath = null;
  if (rawItem.local_image_filename) {
    cleanLocalPath = `/${rawItem.local_image_filename.replace(/^books\//, '')}`;
    cleanWebpPath = cleanLocalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  const fallbackSvg = generateFallbackSvgCover(rawItem.title, rawItem.author);

  const pagesCount = rawItem.pages ? parseInt(rawItem.pages, 10) : 180;

  return {
    // Canonical Domain Attributes
    id: canonicalId,
    numericId: numericId,
    slug: slug,
    title: rawItem.title || "Untitled JSS Publication",
    titleKannada: knTitle,
    subtitle: rawItem.subtitle || "",
    author: rawItem.author || "JSS Granthamale Editorial Board",
    translator: rawItem.translator || "",
    editorialBoard: "Jagadguru Sri Shivarathreeshwara Granthamale, Mysuru",
    language: rawItem.language || "Kannada",
    category: stdCategory,
    rawCategory: rawItem.category || "",
    series: seriesName,
    isEndowmentPublication: isEndowment,
    status: 'active',
    publisher: "Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru",
    description: rawItem.description || "Authentic publication preserved and published under Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru.",
    sampleExcerpt: knTitle 
      ? `ವಚನ ಹಾಗೂ ಧರ್ಮ ಸಾಹಿತ್ಯದ ಉದ್ಗ್ರಂಥ: ${rawItem.title}. ಶ್ರೀ ಸುತ್ತೂರು ಮಠದ ಪ್ರಕಾಶನ.` 
      : `Scholarly publication: ${rawItem.title}. Preserved and published under Jagadguru Sri Shivarathreeshwara Granthamale.`,
    pages: pagesCount,
    sourceUrl: rawItem.source_url || "",

    // Editions Entity Collection
    editions: editions,

    // Media & Image Hierarchy
    coverImage: {
      webp: cleanWebpPath,
      local: cleanLocalPath,
      remote: rawItem.image_url || null,
      fallbackSvg: fallbackSvg
    },

    // Backward-Compatibility Properties (ensures zero UI breakage)
    price: pbPrice,
    specialPrice: hbPrice || dxPrice || null,
    deluxePrice: dxPrice || null,
    hasVariants: editions.length > 1,
    edition: editions.length > 1 ? "Multiple Editions" : "Standard Edition",
    inStock: true,
    isbn: editions[0].isbn,
    imageUrl: rawItem.image_url,
    localImage: cleanLocalPath,
    webpImage: cleanWebpPath
  };
}

// Build normalized in-memory repository from verified books.json
const NORMALIZED_CATALOGUE = rawBooks.map((item, index) => normalizeBook(item, index));

/**
 * Fast lookup indexes
 */
const ID_INDEX = new Map();
const SLUG_INDEX = new Map();

NORMALIZED_CATALOGUE.forEach((book) => {
  ID_INDEX.set(String(book.id), book);
  ID_INDEX.set(String(book.numericId), book);
  SLUG_INDEX.set(book.slug.toLowerCase(), book);
});

/**
 * Catalogue Domain Service Interface
 */
export const catalogueService = {
  /**
   * Retrieve all canonical books with optional filtering
   * @param {Object} options - Optional filters { category, series, language, status }
   * @returns {Promise<Book[]>}
   */
  async getAllBooks(options = {}) {
    return this.getBooksSync(options);
  },

  /**
   * Synchronous getter for React state initialization and fast renders
   */
  getBooksSync(options = {}) {
    let result = [...NORMALIZED_CATALOGUE];

    if (options.category && options.category !== 'All Categories') {
      result = result.filter((b) => b.category === options.category);
    }

    if (options.series && options.series !== 'All Series') {
      result = result.filter((b) => b.series === options.series);
    }

    if (options.language && options.language !== 'All Languages') {
      result = result.filter((b) => b.language.toLowerCase().includes(options.language.toLowerCase()));
    }

    if (options.status) {
      result = result.filter((b) => b.status === options.status);
    }

    return result;
  },

  /**
   * Look up a book by its canonical ID or numerical ID
   * @param {string|number} id
   * @returns {Book|null}
   */
  getBookById(id) {
    if (!id) return null;
    const clean = String(id).trim();
    if (ID_INDEX.has(clean)) {
      return ID_INDEX.get(clean);
    }
    // Try padding if passed as numerical string
    const padded = `jss-pub-${clean.padStart(4, '0')}`;
    return ID_INDEX.get(padded) || null;
  },

  /**
   * Look up a book by its canonical URL slug
   * @param {string} slug
   * @returns {Book|null}
   */
  getBookBySlug(slug) {
    if (!slug) return null;
    const clean = String(slug).trim().toLowerCase();
    
    // Direct slug match
    if (SLUG_INDEX.has(clean)) {
      return SLUG_INDEX.get(clean);
    }

    // Direct ID match fallback (if slug is passed as an ID)
    const byId = this.getBookById(clean);
    if (byId) return byId;

    // Partial fuzzy fallback
    return NORMALIZED_CATALOGUE.find((b) => b.slug.includes(clean) || clean.includes(b.slug)) || null;
  },

  /**
   * Retrieve all physical editions for a specific book
   * @param {string|number} bookId
   * @returns {Edition[]}
   */
  getEditionsForBook(bookId) {
    const book = this.getBookById(bookId);
    return book ? book.editions : [];
  },

  /**
   * Retrieve a specific edition by bookId and editionId or binding
   * @param {string|number} bookId
   * @param {string} editionIdOrBinding
   * @returns {Edition|null}
   */
  getEdition(bookId, editionIdOrBinding) {
    const editions = this.getEditionsForBook(bookId);
    if (!editions.length) return null;

    const query = String(editionIdOrBinding).toLowerCase();
    return editions.find(
      (ed) => ed.editionId.toLowerCase() === query || ed.binding.toLowerCase().includes(query)
    ) || editions[0];
  },

  /**
   * Retrieve default edition for a book (standard paperback)
   * @param {Book} book
   * @returns {Edition}
   */
  getDefaultEdition(book) {
    if (!book || !book.editions || !book.editions.length) {
      return {
        editionId: 'fallback-pb',
        bookId: book ? book.id : 'unknown',
        binding: 'Paperback',
        formatLabel: 'Standard Paperback',
        isbn: 'JSS-PUB-0000',
        pages: 180,
        weightGrams: 240,
        mrp: book?.price || 150,
        sellingPrice: book?.price || 150,
        discountPercent: 0,
        inStock: true,
        stockQuantity: 10,
        maxOrderLimit: 10
      };
    }
    return book.editions[0];
  },

  /**
   * Find related books in the same category or series, excluding current book
   * @param {string|number} bookId
   * @param {number} limit
   * @returns {Book[]}
   */
  getRelatedBooks(bookId, limit = 4) {
    const current = this.getBookById(bookId);
    if (!current) return NORMALIZED_CATALOGUE.slice(0, limit);

    return NORMALIZED_CATALOGUE
      .filter((b) => b.id !== current.id && (b.category === current.category || b.series === current.series))
      .slice(0, limit);
  },

  /**
   * Standardized categories with metadata and book count
   */
  getCategories() {
    return Object.entries(CATEGORY_DEFINITIONS).map(([catName, meta]) => {
      const count = NORMALIZED_CATALOGUE.filter((b) => b.category === catName).length;
      return {
        name: catName,
        nameKannada: meta.nameKannada,
        description: meta.description,
        shelfColor: meta.shelfColor,
        bookCount: count
      };
    });
  },

  /**
   * Canonical series list
   */
  getSeries() {
    return CANONICAL_SERIES;
  },

  /**
   * Canonical languages list
   */
  getLanguages() {
    return CANONICAL_LANGUAGES;
  },

  /**
   * Authentic periodicals list
   */
  getPeriodicals() {
    return CANONICAL_PERIODICALS;
  },

  /**
   * Robust multi-tier cover image resolver
   * @param {Book} book
   * @param {string} preferredFormat - 'webp' | 'local' | 'remote'
   * @returns {string}
   */
  getCoverImage(book, preferredFormat = 'webp') {
    if (!book) return generateFallbackSvgCover('JSS Publication');
    
    if (preferredFormat === 'webp' && book.coverImage?.webp) {
      return book.coverImage.webp;
    }
    if (book.coverImage?.local) {
      return book.coverImage.local;
    }
    if (book.coverImage?.remote) {
      return book.coverImage.remote;
    }
    return book.coverImage?.fallbackSvg || generateFallbackSvgCover(book.title, book.author);
  },

  /**
   * Standalone fallback SVG generator
   */
  generateFallbackSvg(book) {
    return generateFallbackSvgCover(book?.title, book?.author);
  },

  /**
   * Validate book object data integrity
   * @param {Book} book
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validateBook(book) {
    const errors = [];
    if (!book) return { valid: false, errors: ['Book is null or undefined'] };
    if (!book.id) errors.push('Missing unique identifier (id)');
    if (!book.title) errors.push('Missing title');
    if (!book.editions || !book.editions.length) {
      errors.push('Book must have at least one edition');
    } else {
      book.editions.forEach((ed, idx) => {
        if (!ed.editionId) errors.push(`Edition ${idx} missing editionId`);
        if (typeof ed.sellingPrice !== 'number' || ed.sellingPrice <= 0) {
          errors.push(`Edition ${ed.editionId || idx} has invalid selling price`);
        }
      });
    }
    return { valid: errors.length === 0, errors };
  }
};

export default catalogueService;
