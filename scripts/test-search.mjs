import { searchService } from '../src/services/searchService.js';

async function runTests() {
  console.log('--- JSS PUBLICATIONS: SEARCH & DISCOVERY SERVICE DOMAIN TESTS ---');

  // Test 1: Exact English Search
  const res1 = searchService.search({ query: 'Patanjali' });
  console.log(`1. Exact Search "Patanjali": Found ${res1.totalCount} matches (Top: "${res1.books[0]?.title}")`);
  if (!res1.books.some(b => b.title.includes('Patanjali'))) throw new Error('Failed exact search for Patanjali');

  // Test 2: Authentic Kannada Script Search
  const res2 = searchService.search({ query: 'ಶಿವಪದ' });
  console.log(`2. Kannada Search "ಶಿವಪದ": Found ${res2.totalCount} matches (Top: "${res2.books[0]?.title}" / "${res2.books[0]?.titleKannada}")`);
  if (res2.totalCount === 0 || !res2.books[0].titleKannada.includes('ಶಿವಪದ')) {
    throw new Error('Failed Kannada script search');
  }

  // Test 3: Transliteration matching (Latin "vachana" finding Kannada works)
  const res3 = searchService.search({ query: 'vachana' });
  console.log(`3. Transliteration Search "vachana": Found ${res3.totalCount} matches`);
  if (res3.totalCount < 5) throw new Error('Transliteration failed to match expected Vachana titles');

  // Test 4: Typo-Tolerance
  // Searching with typo "patangali" (g instead of j)
  const res4 = searchService.search({ query: 'patangali' });
  console.log(`4. Typo-Tolerant Search "patangali": Found ${res4.totalCount} matches (Top: "${res4.books[0]?.title}")`);
  if (!res4.books.some(b => b.title.includes('Patanjali'))) {
    throw new Error('Typo tolerance failed to find Patanjali with single-char typo');
  }

  // Test 5: Author Search
  const res5 = searchService.search({ query: 'Abdul Kalam' });
  console.log(`5. Author Search "Abdul Kalam": Found ${res5.totalCount} matches (Top: "${res5.books[0]?.title}" by ${res5.books[0]?.author})`);
  if (res5.totalCount === 0 || !res5.books[0].author.includes('Kalam')) {
    throw new Error('Author search failed');
  }

  // Test 6: Faceted Constraints (Category + PriceMax)
  const res6 = searchService.search({
    category: 'Vachana Literature',
    priceMax: 150
  });
  console.log(`6. Faceted Filter (Category: "Vachana Literature", Price <= 150): Found ${res6.totalCount} matches`);
  const anyMismatch = res6.books.some(b => b.category !== 'Vachana Literature' || b.price > 150);
  if (anyMismatch) throw new Error('Faceted constraint breached');

  // Test 7: Autocomplete Typeahead
  const suggestions = searchService.getQuickSuggestions('suttur', 3);
  console.log(`7. Autocomplete Quick Suggestions for "suttur": [${suggestions.map(s => s.title).join(', ')}]`);
  if (suggestions.length === 0) throw new Error('Autocomplete returned empty suggestions');

  // Test 8: Zero-Result State, "Did you mean?", and Audit Log
  const res8 = searchService.search({ query: 'xyznonsenseterm999' });
  console.log(`8. Zero-Result Handling: isZeroResult = ${res8.isZeroResult}, totalCount = ${res8.totalCount}`);
  if (!res8.isZeroResult || res8.totalCount !== 0) throw new Error('Failed zero-result detection');
  if (res8.suggestedAlternatives.length !== 4) throw new Error('Expected 4 alternative fallback suggestions');

  const auditLog = searchService.getZeroResultAuditLog();
  console.log(`9. Zero-Result Audit Log: Recorded ${auditLog.length} queries (Latest: "${auditLog[auditLog.length - 1]?.query}")`);
  if (auditLog.length === 0 || auditLog[auditLog.length - 1].query !== 'xyznonsenseterm999') {
    throw new Error('Audit log failed to record zero-result query');
  }

  console.log('\n>>> ALL 9 SEARCH & DISCOVERY DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
}

runTests().catch(err => {
  console.error('Search Test Suite Failed:', err);
  process.exit(1);
});
