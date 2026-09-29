import { catalogueService } from '../src/services/catalogueService.js';
import { recentlyViewedService } from '../src/services/recentlyViewedService.js';
import { wishlistService } from '../src/services/wishlistService.js';

async function runTests() {
  console.log('--- JSS PUBLICATIONS: PRODUCT & EDITION DOMAIN TESTS ---');

  // Test 1: Single Edition Resolution
  const book1 = catalogueService.getBookById(1); // Shivapada Ratnakosha
  if (!book1 || book1.editions.length !== 1) {
    throw new Error('Expected 1 edition for Shivapada Ratnakosha');
  }
  const pbEd = book1.editions[0];
  console.log(`1. Single-Edition Resolution: PASSED (${book1.title} -> ${pbEd.binding}, ₹${pbEd.sellingPrice}, ISBN: ${pbEd.isbn})`);

  // Test 2: Multi-Edition Resolution with Distinct Pricing & ISBNs
  const book3 = catalogueService.getBookById(3); // Patanjali Yoga Sutras (Paperback + Hardbound)
  if (!book3 || book3.editions.length < 2) {
    throw new Error('Expected multiple editions for Patanjali Yoga Sutras');
  }
  const [b3Paperback, b3Hardbound] = book3.editions;
  if (b3Paperback.sellingPrice === b3Hardbound.sellingPrice) {
    throw new Error('Paperback and Hardbound prices must be distinct');
  }
  if (b3Paperback.isbn === b3Hardbound.isbn) {
    throw new Error('Paperback and Hardbound ISBNs must be distinct');
  }
  console.log(`2. Multi-Edition Distinct Pricing & ISBNs: PASSED:`);
  console.log(`   - ${b3Paperback.binding}: ₹${b3Paperback.sellingPrice}, ISBN: ${b3Paperback.isbn}, Weight: ${b3Paperback.weightGrams}g`);
  console.log(`   - ${b3Hardbound.binding}: ₹${b3Hardbound.sellingPrice}, ISBN: ${b3Hardbound.isbn}, Weight: ${b3Hardbound.weightGrams}g`);

  // Test 3: Deluxe Collector Edition
  const book11 = catalogueService.getBookById(11); // Bhakthibhandari Basavannanavaru (Deluxe)
  const deluxeEd = book11.editions.find(e => e.binding === 'Deluxe Hardbound');
  if (!deluxeEd) throw new Error('Expected Deluxe Hardbound edition for book 11');
  if (deluxeEd.maxOrderLimit !== 5) throw new Error('Deluxe edition must have max order limit of 5');
  console.log(`3. Deluxe Collector Edition: PASSED (${deluxeEd.formatLabel}, Limit: ${deluxeEd.maxOrderLimit})`);

  // Test 4: Recently Viewed Service - History Recording & Deduplication
  recentlyViewedService.clearHistory();
  recentlyViewedService.recordView(book1.id);
  recentlyViewedService.recordView(book3.id);
  recentlyViewedService.recordView(book11.id);
  // Re-record book1 (should move to top without duplication)
  recentlyViewedService.recordView(book1.id);

  const historyIds = recentlyViewedService.getRecentlyViewedIds();
  if (historyIds.length !== 3) throw new Error(`Expected 3 history items, got ${historyIds.length}`);
  if (historyIds[0] !== book1.id) throw new Error('Deduplication must move most recent item to index 0');
  console.log(`4. Recently Viewed History & Deduplication: PASSED (Chronological order: [${historyIds.join(', ')}])`);

  // Test 5: Recently Viewed Resolution with Current Book Exclusion
  const recentBooks = recentlyViewedService.getRecentBooks(4, book1.id);
  if (recentBooks.some(b => b.id === book1.id)) {
    throw new Error('Current opened book must be excluded from recent recommendations');
  }
  if (recentBooks.length !== 2) {
    throw new Error(`Expected 2 recent books excluding book1, got ${recentBooks.length}`);
  }
  console.log(`5. Recent Books Resolution (Excluding current book): PASSED (${recentBooks.map(b => b.title).join(', ')})`);

  // Test 6: Reading List (Wishlist) Synchronization
  wishlistService.clearWishlist();
  if (wishlistService.isInWishlist(book3.id)) throw new Error('Should not be in empty wishlist');
  
  wishlistService.toggleItem(book3);
  if (!wishlistService.isInWishlist(book3.id)) throw new Error('Book 3 should be in wishlist after toggle');

  wishlistService.toggleItem(book3);
  if (wishlistService.isInWishlist(book3.id)) throw new Error('Book 3 should be removed after second toggle');
  console.log('6. Reading List (Wishlist) Toggle & Membership: PASSED');

  console.log('\n>>> ALL 6 PRODUCT & EDITION DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
}

runTests().catch(err => {
  console.error('Product & Edition Domain Test Failed:', err);
  process.exit(1);
});
