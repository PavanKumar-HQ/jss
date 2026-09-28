/**
 * Search & Discovery Domain Service
 * Authoritative search engine for JSS Publications.
 *
 * Responsibilities:
 * - Bilingual search across English and Kannada scripts
 * - Transliteration bridge (Latin <-> Kannada script queries)
 * - Typo-tolerant fuzzy matching (Levenshtein distance & n-gram scoring)
 * - Faceted filtering (Category, Series, Language, Price)
 * - Deterministic relevance scoring
 * - Zero-result state detection, query tracking, and discovery recovery suggestions
 * - Fast autocomplete suggestions for Navbar typeahead
 */

import { catalogueService } from './catalogueService.js';

// Transliteration phoneme pairs for common Kannada/English literary terms
const TRANSLITERATION_MAP = [
  { latin: 'shiva', kn: 'ಶಿವ' },
  { latin: 'shivapada', kn: 'ಶಿವಪದ' },
  { latin: 'basava', kn: 'ಬಸವ' },
  { latin: 'basavanna', kn: 'ಬಸವಣ್ಣ' },
  { latin: 'allama', kn: 'ಅಲ್ಲಮ' },
  { latin: 'prabhu', kn: 'ಪ್ರಭು' },
  { latin: 'vachana', kn: 'ವಚನ' },
  { latin: 'vachanagalu', kn: 'ವಚನಗಳು' },
  { latin: 'sharana', kn: 'ಶರಣ' },
  { latin: 'sharanara', kn: 'ಶರಣರ' },
  { latin: 'patanjali', kn: 'ಪಾತಂಜಲ' },
  { latin: 'yoga', kn: 'ಯೋಗ' },
  { latin: 'sutra', kn: 'ಸೂತ್ರ' },
  { latin: 'sutras', kn: 'ಸೂತ್ರಗಳು' },
  { latin: 'suttur', kn: 'ಸುತ್ತೂರು' },
  { latin: 'math', kn: 'ಮಠ' },
  { latin: 'prasada', kn: 'ಪ್ರಸಾದ' },
  { latin: 'narada', kn: 'ನಾರದ' },
  { latin: 'bhakti', kn: 'ಭಕ್ತಿ' },
  { latin: 'siddheshwara', kn: 'ಸಿದ್ಧೇಶ್ವರ' },
  { latin: 'siddharama', kn: 'ಸಿದ್ಧರಾಮ' },
  { latin: 'akka', kn: 'ಅಕ್ಕ' },
  { latin: 'mahadevi', kn: 'ಮಹಾದೇವಿ' },
  { latin: 'channabasavanna', kn: 'ಚೆನ್ನಬಸವಣ್ಣ' },
  { latin: 'veerashaiva', kn: 'ವೀರಶೈವ' },
  { latin: 'darshana', kn: 'ದರ್ಶನ' },
  { latin: 'shatsthala', kn: 'ಷಟ್‌ಸ್ಥಲ' },
  { latin: 'kayaka', kn: 'ಕಾಯಕ' }
];

// In-memory zero-result query audit log for analytics
const zeroResultQueryLog = [];

/**
 * Normalize search string: lowercase, remove excess punctuation
 */
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0C80-\u0CFF-]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Calculate Levenshtein distance for typo tolerance
 */
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // Optimize: single row matrix
  let prevRow = Array.from({ length: n + 1 }, (_, i) => i);
  let currRow = new Array(n + 1);

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1,       // Insertion
        prevRow[j] + 1,           // Deletion
        prevRow[j - 1] + cost     // Substitution
      );
    }
    prevRow = [...currRow];
  }
  return currRow[n];
}

/**
 * Calculate similarity ratio between 0 and 1
 */
function calculateSimilarity(str1, str2) {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;

  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(s1, s2);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Score a book's relevance against a search query
 * Returns score: > 0 means match, higher = more relevant
 */
function scoreBookRelevance(book, rawQuery) {
  const q = normalizeString(rawQuery);
  if (!q) return 1.0; // No query matches everything with baseline score

  const qTokens = q.split(' ').filter(Boolean);
  let score = 0;

  const titleNorm = normalizeString(book.title);
  const knTitleNorm = normalizeString(book.titleKannada);
  const authorNorm = normalizeString(book.author);
  const categoryNorm = normalizeString(book.category);
  const seriesNorm = normalizeString(book.series);
  const isbnNorm = normalizeString(book.isbn);
  const descNorm = normalizeString(book.description);

  // 1. Exact Full Query Matches
  if (titleNorm === q || knTitleNorm === q) score += 100;
  else if (titleNorm.startsWith(q) || knTitleNorm.startsWith(q)) score += 75;
  else if (titleNorm.includes(q) || knTitleNorm.includes(q)) score += 50;

  // 2. Transliteration matches
  for (const pair of TRANSLITERATION_MAP) {
    if (q.includes(pair.latin) && (knTitleNorm.includes(pair.kn) || descNorm.includes(pair.kn))) {
      score += 45;
    } else if (q.includes(pair.kn) && (titleNorm.includes(pair.latin) || descNorm.includes(pair.latin))) {
      score += 45;
    }
  }

  // 3. ISBN Exact Match
  if (isbnNorm && isbnNorm.includes(q.replace(/-/g, ''))) {
    score += 90;
  }

  // 4. Author Match
  if (authorNorm.includes(q)) score += 40;

  // 5. Category & Series Match
  if (categoryNorm.includes(q)) score += 30;
  if (seriesNorm.includes(q)) score += 30;

  // 6. Token-level matching & Fuzzy tolerance
  for (const token of qTokens) {
    if (token.length < 2) continue;

    if (titleNorm.includes(token)) score += 20;
    else if (knTitleNorm.includes(token)) score += 20;
    else if (authorNorm.includes(token)) score += 15;
    else if (categoryNorm.includes(token)) score += 10;
    else if (descNorm.includes(token)) score += 5;
    else {
      // Fuzzy match tokens against words in title and author
      const titleWords = titleNorm.split(' ');
      for (const word of titleWords) {
        if (word.length >= 3 && Math.abs(word.length - token.length) <= 2) {
          const sim = calculateSimilarity(word, token);
          if (sim >= 0.75) {
            score += Math.round(sim * 15);
            break;
          }
        }
      }
    }
  }

  return score;
}

export const searchService = {
  /**
   * Primary search & discovery execution method
   * @param {Object} params
   * @param {string} params.query - Freeform search string
   * @param {string} params.category - Selected category filter
   * @param {string} params.series - Selected series filter
   * @param {string} params.language - Selected language filter
   * @param {number} params.priceMax - Upper price bound
   * @param {string} params.sortBy - Sorting key
   * @returns {SearchResult}
   */
  search(params = {}) {
    const {
      query = '',
      category = 'All Categories',
      series = 'All Series',
      language = 'All Languages',
      priceMax = 2000,
      sortBy = 'relevance'
    } = params;

    const allBooks = catalogueService.getBooksSync();
    const cleanQuery = normalizeString(query);

    // 1. Score and filter books by search query
    let scoredList = allBooks.map((book) => {
      const score = cleanQuery ? scoreBookRelevance(book, cleanQuery) : 1;
      return { book, score };
    });

    if (cleanQuery) {
      // Keep only items that matched above threshold
      scoredList = scoredList.filter((item) => item.score > 0);
    }

    // 2. Apply faceted constraints
    let filtered = scoredList.filter(({ book }) => {
      if (category !== 'All Categories' && book.category !== category) return false;
      if (series !== 'All Series' && book.series !== series) return false;
      if (language !== 'All Languages' && !book.language.toLowerCase().includes(language.toLowerCase())) {
        return false;
      }
      if (typeof priceMax === 'number' && book.price > priceMax) return false;
      return true;
    });

    // 3. Apply sorting
    if (sortBy === 'relevance' && cleanQuery) {
      filtered.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'title-asc') {
      filtered.sort((a, b) => a.book.title.localeCompare(b.book.title));
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.book.price - b.book.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.book.price - a.book.price);
    } else if (sortBy === 'pages-desc') {
      filtered.sort((a, b) => (b.book.pages || 0) - (a.book.pages || 0));
    }

    const matchedBooks = filtered.map((item) => item.book);
    const isZeroResult = matchedBooks.length === 0;

    // 4. Handle Zero-Result State (Track & produce recovery suggestions)
    let suggestedAlternatives = [];
    let didYouMean = null;

    if (isZeroResult) {
      if (cleanQuery) {
        zeroResultQueryLog.push({
          query: cleanQuery,
          timestamp: new Date().toISOString(),
          filters: { category, series, language, priceMax }
        });

        // Compute "Did you mean?" against all book titles
        let bestCandidate = null;
        let highestSim = 0;

        for (const b of allBooks) {
          const sim = calculateSimilarity(b.title, cleanQuery);
          if (sim > highestSim && sim >= 0.55) {
            highestSim = sim;
            bestCandidate = b.title;
          }
        }
        didYouMean = bestCandidate;
      }

      // Recommend foundational classic publications as fallback
      suggestedAlternatives = catalogueService.getBooksSync().slice(0, 4);
    }

    // 5. Compute dynamic facet counts from the current candidate pool
    const facetCounts = {
      categories: {},
      series: {},
      languages: {}
    };

    allBooks.forEach((b) => {
      facetCounts.categories[b.category] = (facetCounts.categories[b.category] || 0) + 1;
      if (b.series) {
        facetCounts.series[b.series] = (facetCounts.series[b.series] || 0) + 1;
      }
      const primaryLang = b.language.includes('(') ? b.language.split('(')[0].trim() : b.language;
      facetCounts.languages[primaryLang] = (facetCounts.languages[primaryLang] || 0) + 1;
    });

    return {
      books: matchedBooks,
      totalCount: matchedBooks.length,
      query: query.trim(),
      normalizedQuery: cleanQuery,
      didYouMean,
      facetCounts,
      isZeroResult,
      suggestedAlternatives
    };
  },

  /**
   * Instant autocomplete typeahead suggestions for Navbar
   * @param {string} query
   * @param {number} limit
   * @returns {Book[]}
   */
  getQuickSuggestions(query, limit = 5) {
    if (!query || query.trim().length < 2) return [];
    const results = this.search({ query, sortBy: 'relevance' });
    return results.books.slice(0, limit);
  },

  /**
   * Retrieve logged zero-result queries for operational audit
   */
  getZeroResultAuditLog() {
    return [...zeroResultQueryLog];
  }
};

export default searchService;
