import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTests() {
  console.log('--- JSS PUBLICATIONS: CATALOGUE SERVICE DOMAIN TESTS ---');
  
  // Dynamic import of the catalogue service (via dist or node module)
  const booksData = require('../data/books.json');
  console.log(`Loaded ${booksData.length} raw publications from verified database.`);

  const { catalogueService, CATEGORY_DEFINITIONS } = await import('../src/services/catalogueService.js');

  const allBooks = catalogueService.getBooksSync();
  console.log(`1. Total Catalogued Books: ${allBooks.length} (Expected: 49)`);
  if (allBooks.length !== 49) throw new Error(`Book count mismatch: expected 49, got ${allBooks.length}`);

  // Test ID lookups
  const b1 = catalogueService.getBookById('jss-pub-0001');
  const b1Num = catalogueService.getBookById(1);
  const b1Str = catalogueService.getBookById('1');
  if (!b1 || b1.title !== 'Shivapada Ratnakosha') throw new Error('Failed canonical ID lookup');
  if (b1 !== b1Num || b1 !== b1Str) throw new Error('Failed numerical and string ID lookups');
  console.log(`2. ID Lookups: PASSED (${b1.id} -> "${b1.title}", titleKannada: "${b1.titleKannada}")`);

  // Test Slug lookups
  const bSlug = catalogueService.getBookBySlug('shivapada-ratnakosha');
  if (!bSlug || bSlug.id !== 'jss-pub-0001') throw new Error('Failed canonical slug lookup');
  const bSlugPatanjali = catalogueService.getBookBySlug('patanjali-yoga-sutras');
  if (!bSlugPatanjali || bSlugPatanjali.title !== 'Patanjali Yoga Sutras') throw new Error('Failed slug lookup for Patanjali');
  console.log(`3. Slug Lookups: PASSED ("${bSlug.slug}" -> "${bSlug.title}")`);

  // Test Multi-Edition & Single-Edition Bindings
  const multiEd = catalogueService.getBookById(3); // Patanjali Yoga Sutras (Paperback + Hardbound)
  if (multiEd.editions.length < 2) throw new Error('Expected at least 2 editions for Patanjali');
  console.log(`4. Multi-Edition Bindings: PASSED for ${multiEd.title}: [${multiEd.editions.map(e => `${e.binding}: ₹${e.sellingPrice}`).join(', ')}]`);

  const deluxeEd = catalogueService.getBookById(11); // Bhakthibhandari Basavannanavaru (Deluxe)
  if (deluxeEd.editions.length < 2) throw new Error('Expected deluxe edition for book 11');
  console.log(`5. Deluxe Editions: PASSED for ${deluxeEd.title}: [${deluxeEd.editions.map(e => `${e.binding}: ₹${e.sellingPrice}`).join(', ')}]`);

  // Test Default Edition
  const defaultEd = catalogueService.getDefaultEdition(multiEd);
  if (!defaultEd || defaultEd.binding !== 'Paperback') throw new Error('Default edition must be Paperback');
  console.log(`6. Default Edition: PASSED (${defaultEd.binding}, ₹${defaultEd.sellingPrice}, ISBN: ${defaultEd.isbn})`);

  // Test Categories
  const categories = catalogueService.getCategories();
  const totalInCats = categories.reduce((sum, c) => sum + c.bookCount, 0);
  if (totalInCats !== 49) throw new Error(`Category book count sum (${totalInCats}) != 49`);
  console.log(`7. Categories: PASSED (${categories.length} categories, total 49 books allocated):`);
  categories.forEach(c => console.log(`   - ${c.name} (${c.nameKannada}): ${c.bookCount} books`));

  // Test Related Books
  const related = catalogueService.getRelatedBooks('jss-pub-0001', 4);
  if (related.length !== 4) throw new Error('Expected 4 related books');
  if (related.some(r => r.id === 'jss-pub-0001')) throw new Error('Related books must not include source book');
  console.log(`8. Related Books: PASSED (Returned ${related.length} books in category "${b1.category}")`);

  // Test Periodicals
  const periodicals = catalogueService.getPeriodicals();
  if (periodicals.length !== 3) throw new Error('Expected 3 authentic periodicals');
  console.log(`9. Periodicals: PASSED (${periodicals.map(p => p.name).join(', ')})`);

  // Test Data Integrity Validation on all 49 books
  let validCount = 0;
  for (const book of allBooks) {
    const check = catalogueService.validateBook(book);
    if (!check.valid) throw new Error(`Book ${book.id} validation failed: ${check.errors.join(', ')}`);
    validCount++;
  }
  console.log(`10. Data Integrity: PASSED (100% of ${validCount} books validated with valid prices, editions, and bindings)`);

  // Test Edge Cases: Unknown ID / Slug
  const unknownId = catalogueService.getBookById('non-existent-id-999');
  if (unknownId !== null) throw new Error('Unknown ID should return null');
  const unknownSlug = catalogueService.getBookBySlug('some-fake-unknown-slug');
  if (unknownSlug !== null) throw new Error('Unknown slug should return null');
  console.log(`11. Graceful Edge Case Resolution: PASSED (Null returned for missing IDs/slugs without throwing)`);

  console.log('\n>>> ALL 11 CATALOGUE SERVICE TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
