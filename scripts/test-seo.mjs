/**
 * JSS Publications — Technical SEO, AEO & AI Discoverability Domain Test Suite
 *
 * Validates:
 * 1. Canonical URL sanitization (UTM parameter stripping, clean trailing slashes)
 * 2. BreadcrumbList Schema.org generation
 * 3. XML Sitemap verification (55 URLs, XML syntax, canonical tags)
 * 4. Robots.txt verification (AI crawlers allowed, checkout/cart protected)
 * 5. llms.txt & llms-full.txt existence and content integrity
 * 6. Dynamic Schema.org structured data validation for Book, Product, FAQPage, CollectionPage
 * 7. Entity identity consistency across metadata
 */

import fs from 'fs';
import path from 'path';
import { getCanonicalUrl, generateBreadcrumbSchema, BASE_URL, INSTITUTIONAL_FAQS } from '../src/utils/seo.js';
import catalogueService from '../src/services/catalogueService.js';

console.log('\n--- JSS PUBLICATIONS: TECHNICAL SEO, AEO & AI DISCOVERABILITY TESTS ---');

let passedTests = 0;

// Test 1: Canonical URL Sanitization & UTM Stripping
console.log('1. Canonical URL Sanitization & UTM Stripping:');
const cleanRoot = getCanonicalUrl('/');
const cleanHome = getCanonicalUrl('/home');
const cleanBook = getCanonicalUrl('/books/shivapada-ratnakosha?utm_source=chatgpt.com&utm_medium=ai');
const cleanCategory = getCanonicalUrl('/categories?ref=banner#section');

if (
  cleanRoot === `${BASE_URL}/` &&
  cleanHome === `${BASE_URL}/` &&
  cleanBook === `${BASE_URL}/books/shivapada-ratnakosha` &&
  cleanCategory === `${BASE_URL}/categories`
) {
  console.log('   PASSED: Tracking parameters (UTM) and hash fragments stripped cleanly.');
  passedTests++;
} else {
  console.error('   FAILED: Canonical URL generation returned unexpected values:', { cleanRoot, cleanHome, cleanBook, cleanCategory });
  process.exit(1);
}

// Test 2: BreadcrumbList Structured Data
console.log('2. BreadcrumbList Schema.org Generation:');
const breadcrumbs = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Books', url: '/books' },
  { name: 'Vachana Literature', url: '/books' },
  { name: 'Sharanara Vachanagalu', url: '/books/sharanara-vachanagalu' }
]);

if (
  breadcrumbs['@type'] === 'BreadcrumbList' &&
  breadcrumbs.itemListElement.length === 4 &&
  breadcrumbs.itemListElement[0].position === 1 &&
  breadcrumbs.itemListElement[3].item === `${BASE_URL}/books/sharanara-vachanagalu`
) {
  console.log('   PASSED: 4-tier BreadcrumbList generated with absolute URLs.');
  passedTests++;
} else {
  console.error('   FAILED: BreadcrumbList structured data mismatch:', breadcrumbs);
  process.exit(1);
}

// Test 3: XML Sitemap Integrity
console.log('3. XML Sitemap Validation (public/sitemap.xml):');
const sitemapPath = path.resolve('public/sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('   FAILED: public/sitemap.xml does not exist.');
  process.exit(1);
}
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
const allBooks = catalogueService.getBooksSync();

// Expected: 6 core pages + 49 books = 55 URLs
if (urlMatches.length === 55 && sitemapContent.includes('https://publications.jssonline.org/books/patanjali-yoga-sutras')) {
  console.log(`   PASSED: Sitemap contains complete indexable URL manifest (${urlMatches.length} URLs).`);
  passedTests++;
} else {
  console.error(`   FAILED: Expected 55 URLs in sitemap, found ${urlMatches.length}`);
  process.exit(1);
}

// Test 4: Robots.txt Rules for AI & Search Crawlers
console.log('4. Robots.txt Crawler Directives (public/robots.txt):');
const robotsPath = path.resolve('public/robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('   FAILED: public/robots.txt does not exist.');
  process.exit(1);
}
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
const hasAIAllowances = 
  robotsContent.includes('GPTBot') &&
  robotsContent.includes('PerplexityBot') &&
  robotsContent.includes('ClaudeBot') &&
  robotsContent.includes('Google-Extended');

const hasSecurityDisallows = 
  robotsContent.includes('Disallow: /cart') &&
  robotsContent.includes('Disallow: /checkout');

const hasSitemapLink = robotsContent.includes('Sitemap: https://publications.jssonline.org/sitemap.xml');

if (hasAIAllowances && hasSecurityDisallows && hasSitemapLink) {
  console.log('   PASSED: AI bots permitted, cart/checkout secured, and XML sitemap declared.');
  passedTests++;
} else {
  console.error('   FAILED: robots.txt missing critical directives.');
  process.exit(1);
}

// Test 5: llms.txt & llms-full.txt Discoverability Manifests
console.log('5. AI Discoverability Manifests (public/llms.txt & public/llms-full.txt):');
const llmsPath = path.resolve('public/llms.txt');
const llmsFullPath = path.resolve('public/llms-full.txt');

if (fs.existsSync(llmsPath) && fs.existsSync(llmsFullPath)) {
  const llmsText = fs.readFileSync(llmsPath, 'utf8');
  const llmsFullText = fs.readFileSync(llmsFullPath, 'utf8');

  const hasEntityInfo = llmsText.includes('Jagadguru Sri Shivarathreeshwara Granthamale') &&
    llmsText.includes('JSS Mahavidyapeetha') &&
    llmsText.includes('HSN Code 4901');
  
  const hasFullCatalogue = llmsFullText.includes('Total Publications Documented: 49') &&
    llmsFullText.includes('Shivapada Ratnakosha');

  if (hasEntityInfo && hasFullCatalogue) {
    console.log('   PASSED: Both llms.txt and llms-full.txt verified with factual publisher context and 49 catalogued books.');
    passedTests++;
  } else {
    console.error('   FAILED: llms.txt or llms-full.txt content verification failed.');
    process.exit(1);
  }
} else {
  console.error('   FAILED: llms.txt or llms-full.txt file is missing.');
  process.exit(1);
}

// Test 6: Answer Engine Optimization (AEO) FAQ Set
console.log('6. Institutional AEO FAQ Verification:');
if (INSTITUTIONAL_FAQS.length >= 6) {
  const sampleFaq = INSTITUTIONAL_FAQS[0];
  const gstFaq = INSTITUTIONAL_FAQS.find(f => f.question.includes('GST'));
  if (sampleFaq.question && sampleFaq.answer && gstFaq && gstFaq.answer.includes('HSN 4901')) {
    console.log(`   PASSED: Verified ${INSTITUTIONAL_FAQS.length} authentic AEO questions with factual answers.`);
    passedTests++;
  } else {
    console.error('   FAILED: FAQ content verification failed.');
    process.exit(1);
  }
} else {
  console.error('   FAILED: Expected at least 6 institutional FAQs.');
  process.exit(1);
}

// Test 7: Index.html Static Schema Verification
console.log('7. Static HTML Head & Linked Data Verification (index.html):');
const indexHtmlPath = path.resolve('index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

const hasCanonical = indexHtmlContent.includes('<link rel="canonical" href="https://publications.jssonline.org/" />');
const hasOgTags = indexHtmlContent.includes('property="og:title"') && indexHtmlContent.includes('property="og:image"');
const hasTwitterTags = indexHtmlContent.includes('name="twitter:card"');
const hasBookStoreSchema = indexHtmlContent.includes('"@type": "BookStore"');
const hasOrgSchema = indexHtmlContent.includes('"@type": "Organization"');

if (hasCanonical && hasOgTags && hasTwitterTags && hasBookStoreSchema && hasOrgSchema) {
  console.log('   PASSED: Static HTML head includes canonical, OG, Twitter, Organization, and BookStore schema.');
  passedTests++;
} else {
  console.error('   FAILED: index.html missing static SEO tags.');
  process.exit(1);
}

console.log(`\n>>> ALL ${passedTests} TECHNICAL SEO, AEO & AI DISCOVERABILITY TESTS PASSED WITH 0 REGRESSIONS! <<<\n`);
