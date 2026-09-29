/**
 * Phase 5: Wishlist / Study Reading List Domain Verification Suite
 * Tests:
 * 1. Standard Bookmarking with canonical catalogue metadata
 * 2. Idempotent addition (duplicate prevention)
 * 3. Multi-binding distinct edition bookmarking (Paperback vs Hardbound)
 * 4. Toggle functionality (add if absent, remove if present)
 * 5. Corrupted storage recovery & schema sanitization
 * 6. Authoritative catalogue reconciliation (price updates & discontinued purge)
 * 7. Single item migration to cartService
 * 8. Batch moveAllToCart migration
 */

import { wishlistService } from '../src/services/wishlistService.js';
import { cartService } from '../src/services/cartService.js';
import { catalogueService } from '../src/services/catalogueService.js';
import storage from '../src/utils/storage.js';

console.log('--- JSS PUBLICATIONS: WISHLIST / READING LIST DOMAIN TESTS ---');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

// Ensure clean test isolation
wishlistService.clearWishlist();
cartService.clearCart();

// -------------------------------------------------------------
// 1. Standard Bookmarking with Canonical Catalogue Resolution
// -------------------------------------------------------------
const book1 = catalogueService.getBookById('jss-pub-0001');
const addRes1 = wishlistService.addItem(book1, 'Paperback');
assert(addRes1.success, 'Adding canonical book to wishlist should succeed');
assert(!addRes1.alreadyExists, 'Initial addition should not be flagged as existing');

const list1 = wishlistService.getWishlist();
assert(list1.length === 1, `Expected 1 wishlist item, got ${list1.length}`);
assert(list1[0].id === 'jss-pub-0001', 'Book ID should match canonical ID');
assert(list1[0].title === 'Shivapada Ratnakosha', 'Book title should match canonical title');
assert(list1[0].titleKannada === 'ಶಿವಪದ ರತ್ನಕೋಶ', 'Kannada title should be preserved');
assert(list1[0].price === 1000, `Expected price 1000, got ${list1[0].price}`);
assert(list1[0].binding === 'Paperback', 'Edition binding should be Paperback');
assert(list1[0].isbn === '978-81-94921-0001-1', 'ISBN should be canonical');
console.log('1. Canonical Metadata Bookmarking: PASSED ("Shivapada Ratnakosha" [Paperback] -> ₹1000)');

// -------------------------------------------------------------
// 2. Idempotent Addition
// -------------------------------------------------------------
const addResDuplicate = wishlistService.addItem(book1, 'Paperback');
assert(addResDuplicate.success, 'Duplicate call should return success');
assert(addResDuplicate.alreadyExists === true, 'Duplicate call should flag alreadyExists');
assert(wishlistService.getWishlist().length === 1, 'Duplicate must not create another entry');
console.log('2. Idempotent Bookmark Prevention: PASSED (Duplicate addition safely ignored)');

// -------------------------------------------------------------
// 3. Multi-Binding Distinct Edition Bookmarks
// -------------------------------------------------------------
const book3 = catalogueService.getBookById('jss-pub-0003'); // Patanjali Yoga Sutras
const addResPaperback = wishlistService.addItem(book3, 'Paperback');
const addResHardbound = wishlistService.addItem(book3, 'Hardbound');

assert(addResPaperback.success && !addResPaperback.alreadyExists, 'Paperback variant should be added');
assert(addResHardbound.success && !addResHardbound.alreadyExists, 'Hardbound variant should be added as separate edition');

const listMulti = wishlistService.getWishlist();
assert(listMulti.length === 3, `Expected 3 items in wishlist, got ${listMulti.length}`);

const pbItem = listMulti.find((i) => i.id === 'jss-pub-0003' && i.binding === 'Paperback');
const hbItem = listMulti.find((i) => i.id === 'jss-pub-0003' && i.binding === 'Hardbound');

assert(pbItem && pbItem.price === 300, 'Paperback edition price should be ₹300');
assert(hbItem && hbItem.price === 500, 'Hardbound edition price should be ₹500');
assert(pbItem.isbn !== hbItem.isbn, 'Paperback and Hardbound must have distinct ISBNs');
console.log('3. Multi-Edition Distinction: PASSED (Paperback: ₹300, Hardbound: ₹500 recorded concurrently)');

// -------------------------------------------------------------
// 4. Toggle Functionality
// -------------------------------------------------------------
const book11 = catalogueService.getBookById('jss-pub-0011');
const toggleRes1 = wishlistService.toggleItem(book11);
assert(toggleRes1.inWishlist === true, 'First toggle should add item to wishlist');
assert(wishlistService.isInWishlist('jss-pub-0011') === true, 'Item should be present in wishlist');

const toggleRes2 = wishlistService.toggleItem(book11);
assert(toggleRes2.inWishlist === false, 'Second toggle should remove item from wishlist');
assert(wishlistService.isInWishlist('jss-pub-0011') === false, 'Item should no longer be in wishlist');
console.log('4. Toggle Membership: PASSED (Toggle accurately adds when absent, removes when present)');

// -------------------------------------------------------------
// 5. Corrupted Storage Healing
// -------------------------------------------------------------
storage.set('jss_granthamale_wishlist', 'MALFORMED_NON_ARRAY_STRING');
const healedList = wishlistService.getWishlist();
assert(Array.isArray(healedList) && healedList.length === 0, 'Corrupted storage should auto-heal to empty array');

// Corrupted items inside array
storage.set('jss_granthamale_wishlist', [
  { id: 'valid-item', title: 'Valid Book' },
  null,
  { noId: true },
  { id: 'corrupted-no-title' }
]);
const sanitizedList = wishlistService.getWishlist();
assert(sanitizedList.length === 1 && sanitizedList[0].id === 'valid-item', 'Malformed records should be purged');
console.log('5. Storage Healing & Sanitization: PASSED (Purged corrupted records cleanly)');

// -------------------------------------------------------------
// 6. Authoritative Catalogue Reconciliation
// -------------------------------------------------------------
// Seed with a tampered price and a discontinued title
storage.set('jss_granthamale_wishlist', [
  {
    id: 'jss-pub-0003',
    slug: 'patanjali-yoga-sutras',
    title: 'Patanjali Yoga Sutras',
    binding: 'Hardbound',
    price: 99 // Stale/tampered price (Authoritative is ₹500)
  },
  {
    id: 'discontinued-title-999',
    slug: 'old-out-of-print',
    title: 'Discontinued Manuscript'
  }
]);

const reconResult = wishlistService.reconcileWishlist();
assert(reconResult.hasModifications, 'Reconciliation should detect modifications');
assert(reconResult.notifications.length === 2, `Expected 2 notifications, got ${reconResult.notifications.length}`);
assert(reconResult.wishlist.length === 1, 'Discontinued item must be purged');
assert(reconResult.wishlist[0].price === 500, `Authoritative price ₹500 enforced, got ${reconResult.wishlist[0].price}`);
console.log('6. Catalogue Reconciliation: PASSED (Stale prices updated & discontinued titles purged)');

// -------------------------------------------------------------
// 7. Single Migration to Cart
// -------------------------------------------------------------
cartService.clearCart();
const singleMove = wishlistService.moveToCart('jss-pub-0003', cartService, 'Hardbound');
assert(singleMove.success, 'Migration of single item to cart should succeed');
assert(wishlistService.getWishlist().length === 0, 'Wishlist should be empty after item migrated');

const activeCart = cartService.getCart();
assert(activeCart.length === 1, 'Cart should receive the migrated item');
assert(activeCart[0].id === 'jss-pub-0003', 'Cart item ID should match migrated publication');
assert(activeCart[0].format === 'Hardbound', 'Cart item format should match migrated binding');
assert(activeCart[0].price === 500, 'Cart item price should be authoritative ₹500');
console.log('7. Single Item Migration to Cart: PASSED (Hardbound edition transitioned to cart seamlessly)');

// -------------------------------------------------------------
// 8. Batch Migration to Cart (moveAllToCart)
// -------------------------------------------------------------
cartService.clearCart();
wishlistService.clearWishlist();

wishlistService.addItem(catalogueService.getBookById('jss-pub-0001'), 'Paperback');
wishlistService.addItem(catalogueService.getBookById('jss-pub-0002'), 'Paperback');
wishlistService.addItem(catalogueService.getBookById('jss-pub-0004'), 'Paperback');

assert(wishlistService.getWishlist().length === 3, 'Wishlist should have 3 items ready for batch transfer');

const batchMove = wishlistService.moveAllToCart(cartService);
assert(batchMove.success, 'Batch migration should return success');
assert(batchMove.count === 3, `Expected 3 items moved, got ${batchMove.count}`);
assert(wishlistService.getWishlist().length === 0, 'Wishlist should be completely cleared after batch move');

const finalCart = cartService.getCart();
assert(finalCart.length === 3, `Cart should contain all 3 items, got ${finalCart.length}`);
const finalTotals = cartService.getTotals(finalCart);
assert(finalTotals.subtotal > 0, `Cart subtotal should be positive: ₹${finalTotals.subtotal}`);
console.log(`8. Batch Migration (Move All to Cart): PASSED (All 3 titles transferred, Subtotal: ₹${finalTotals.subtotal})`);

console.log('\n>>> ALL 8 WISHLIST DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
