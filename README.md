# JSS Publications E-Commerce Platform
### ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ · ಜೆಎಸ್‌ಎಸ್ ಮಹಾವಿದ್ಯಾಪೀಠ, ಮೈಸೂರು
*Authoritative Bookstore for Sacred Vachana Literature, Veerashaiva Philosophy, Shaiva Agamas, and Indian Heritage*

---

## 📖 About the Institution

Founded in 1954 under the spiritual vision of the 22nd Pontiff of Sri Suttur Math, **His Holiness Jagadguru Sri Shivarathri Rajendra Mahaswamiji**, **Jagadguru Sri Shivarathreeshwara Granthamale (JSS Publications)** is the scholarly publication wing of **JSS Mahavidyapeetha, Mysuru**.

The institution is dedicated to the critical philological editing, palm-leaf manuscript preservation, and subsidized dissemination of classical 12th-century Sharana literature, Shaiva Agamas, Sanskrit commentaries, and academic research treatises. All publications are priced strictly at non-profit subsidized rates and are completely exempt from GST (HSN Chapter 4901). Physical consignments are packed and dispatched directly from the JSS Book House sales counter at Dr. Shivarathri Rajendra Circle, Mysuru, via India Post Speed Post.

---

## 🏛️ System Architecture

The application is structured around a decoupled **Client Domain Services** architecture, separating user interface components from domain logic, persistence, and external service contracts.

```text
src/
├── services/                     # Client Domain Services Layer
│   ├── cartService.js            # Cart state, item limits, variant pricing, totals & pub/sub
│   ├── wishlistService.js        # Study Reading List (Wishlist) curation & cart migration
│   ├── couponService.js          # Subsidized academic & promotional discount validation
│   ├── pincodeService.js         # Indian PIN validation, postal circle estimation
│   ├── orderService.js           # Order lifecycle, internal IDs, proforma invoice generation
│   ├── recentlyViewedService.js  # Deduplicated chronological browsing history (last 10)
│   └── index.js                  # Clean barrel export
│
├── utils/                        # Shared Enterprise Utilities
│   ├── storage.js                # Safe localStorage abstraction with in-memory fallback
│   ├── validation.js             # PIN code, email, phone, and quantity bounds validation
│   └── ids.js                    # Collision-resistant internal order reference & key generator
│
├── components/                   # Reusable UI & Experience Components
│   ├── BookCard.jsx              # Responsive book card with 3D tilt, hover tag & bookmark button
│   ├── WishlistDrawer.jsx        # Slide-in study reading list drawer with batch cart transfer
│   ├── CartDrawer.jsx            # Quick cart drawer with milestone free-shipping progress meter
│   ├── CheckoutModal.jsx         # Express checkout overlay with postal address verification
│   ├── BookPreviewModal.jsx      # Modal with publication overview, excerpt reading & metadata
│   ├── FilterSidebar.jsx         # Faceted catalogue filters (Categories, Series, Languages, Price)
│   ├── FlippingBookLoader.jsx    # Pure CSS authentic flipping book initial page loader
│   ├── Footer.jsx                # Institutional 4-column footer with contact & counter info
│   ├── HeroEditorial.jsx         # 2-column editorial hero with real-time 3-book spotlight showcase
│   ├── InteractiveVachanaFlipper.jsx # 3D physical book-turning leaf manuscript simulation
│   ├── LocationSection.jsx       # Physical bookstore counter details & embedded location
│   ├── Navbar.jsx                # Header with top utility bar, instant search, and badge counters
│   ├── OrderTrackingModal.jsx    # India Post consignment tracking & dispatch status lookup
│   ├── PageLoader.jsx            # Lightweight route transition fallback
│   ├── PeriodicalsSection.jsx    # Subscriptions to Prasadha and Sharana Patha journals
│   └── SampleExcerptModal.jsx    # Palm-leaf commentary excerpt reader
│
├── pages/                        # Full Routed Views
│   ├── HomePage.jsx              # Hero, Featured, New Arrivals, Subject Folios, 3D Flipper, About
│   ├── CataloguePage.jsx         # Full 49-title master catalogue with live faceted filtering & sorting
│   ├── BookDetailPage.jsx        # Individual monograph view with variant binding switcher
│   ├── CategoriesPage.jsx        # Subject classifications with bespoke vector insignia
│   ├── CartPage.jsx              # Dedicated cart page with desktop table and mobile cards
│   ├── CheckoutPage.jsx          # Formal dispatch address, proforma totals & order placement
│   ├── BulkOrdersPage.jsx        # Institutional & endowment procurement for mutts & universities
│   ├── AboutPage.jsx             # Comprehensive publisher history, archives, and pontiff vision
│   └── ContactPage.jsx           # Mysore retail counter contact, operating hours & enquiries
│
├── data/
│   └── mockData.js               # Structured 49-book catalog data with bilingual titles & ISBNs
│
├── hooks/
│   └── useScrollReveal.js        # High-performance IntersectionObserver scroll reveal controller
│
├── styles/
│   └── index.css                 # Master design system (Maroon, Gold, Ivory tokens, keyframes)
│
├── App.jsx                       # Root routing controller & service subscribers
└── main.jsx                      # React 18 DOM entrypoint
```

---

## ⚙️ Domain Services Specification

### 1. `cartService` ([`src/services/cartService.js`](src/services/cartService.js))
- **Authoritative Price Reconciliation**: Reconciles all prices directly against `catalogueService`. Any tampered client prices (e.g. attempting to submit ₹1 for a ₹1000 volume) are immediately overwritten with authoritative catalogue pricing.
- **Multi-Binding Edition Snapshots**: Captures full physical attributes upon item addition: `binding`, `formatLabel`, `editionId`, `isbn`, `weightGrams`, `mrp`, and authoritative `price`.
- **Item Bounds & Retail Ceilings**: Enforces strict retail limits (max 10 copies for standard editions, max 5 copies for deluxe collector editions). Quantities exceeding limits are clamped automatically.
- **Storage Self-Healing**: Automatically detects corrupted or malformed `localStorage` state (non-array records or corrupted entries), cleans them, and restores valid cart state without UI crashes.
- **Catalogue Synchronization on Mount**: In `CartPage.jsx`, runs `reconcileCart()` to detect discontinued titles or price changes and displays a dismissible institutional alert banner.
- **Deterministic Currency & Weight Arithmetic**: Integer-safe calculations for subtotal, ₹500 free shipping qualification, standard ₹40 India Post delivery, statutory 0% GST (HSN 4901), and cumulative consignment parcel weight.
- **Pub/Sub Reactivity**: Exposes `subscribe(callback)` allowing `Navbar`, `CartPage`, `CheckoutPage`, and quick-view modals to remain synchronised in real time.

### 2. `wishlistService` ([`src/services/wishlistService.js`](src/services/wishlistService.js))
- **Study Reading List (ನನ್ನ ಆಯ್ಕೆಯ ಗ್ರಂಥಗಳು)**: Enables scholars, research students, and readers to bookmark works for later consultation.
- **Duplicate Prevention**: Idempotent item insertion ensuring consistent unique entries.
- **Cart Migration**: Supports single-item `moveToCart()` and batch `moveAllToCart()` operations.
- **Persistence**: Automatically synced with safe local storage.

### 3. `couponService` ([`src/services/couponService.js`](src/services/couponService.js))
- **Client Validation Interface**: Clean contract designed for future backend API delegation (`/api/v1/coupons/validate`).
- **Configurable Subsidies**:
  - `JSSSTUDENT15`: 15% academic subsidy for university and mutt research scholars.
  - `JNANA10`: 10% reader welcome discount on sacred literature.
  - `FREESHIP`: Free postal delivery across India on qualifying orders.
  - `SUTTURMATH20`: 20% institutional endowment code for study circles.
- **Rules Engine**: Validates code matching, expiration dates, and minimum order values.

### 4. `pincodeService` ([`src/services/pincodeService.js`](src/services/pincodeService.js))
- **PIN Verification**: Validates 6-digit Indian Postal PIN codes (`/^[1-9][0-9]{5}$/`).
- **Postal Circle Inference**: Automatically determines delivery zones:
  - `570xxx`: Mysuru Local District (1–2 business days).
  - `56xxxx–59xxxx`: Karnataka Postal Circle (2–3 business days).
  - `50xxxx–53xxxx`: Andhra Pradesh & Telangana Circle (3–4 business days).
  - `60xxxx–64xxxx`: Tamil Nadu Circle (3–4 business days).
  - `67xxxx–69xxxx`: Kerala Circle (3–4 business days).
  - Other prefixes: National Postal Circle (4–6 business days).
- **Carrier Standards**: Clearly notes dispatch origin from JSS Book House sales counter, Mysuru via India Post.

### 5. `orderService` ([`src/services/orderService.js`](src/services/orderService.js))
- **Internal Reference Generation**: Generates standardized order IDs formatted as `JSS-YYYY-XXXXX` (e.g. `JSS-2026-K7M9P`).
- **Realistic Dispatch State**: Explicitly tracks status as `pending_dispatch` with a note that real India Post consignment tracking numbers are assigned upon physical booking at the post office.
- **Proforma Invoice Preparation**: Formats an official Tax-Exempt Proforma Invoice with institution credentials, customer billing, itemized line items, and HSN 4901 statutory notice.

### 6. `recentlyViewedService` ([`src/services/recentlyViewedService.js`](src/services/recentlyViewedService.js))
- **Browse Tracking**: Records visited publications on every product detail navigation.
- **Deduplication & Capping**: Automatically moves re-visited titles to the front and caps history to the 10 most recent titles.

---

## 🏗️ Domain-by-Domain Architecture Progression

The platform is systematically constructed following rigorous domain boundaries. Every domain includes isolated service logic, defensive edge-case handling, full UI integration, and an automated verification test suite:

| Phase | Domain | Service / Components | Verification Suite | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | Architecture Audit | Component & route decoupling | Build & Tree-shake Audit | ✅ Completed |
| **Phase 1** | Catalogue Service | `catalogueService.js`, `rawBooks.js` (49 books) | `scripts/test-catalogue.mjs` (11 tests) | ✅ Verified & Pushed |
| **Phase 2** | Search & Discovery | `searchService.js`, `Navbar.jsx`, `CataloguePage.jsx` | `scripts/test-search.mjs` (9 tests) | ✅ Verified & Pushed |
| **Phase 3** | Product / Edition Domain | `BookDetailPage.jsx`, `BookPreviewModal.jsx`, `recentlyViewedService.js` | `scripts/test-product-edition.mjs` (6 tests) | ✅ Verified & Pushed |
| **Phase 4** | Cart Domain Service | `cartService.js`, `CartPage.jsx`, `CheckoutPage.jsx` | `scripts/test-cart.mjs` (8 tests) | ✅ Verified & Pushed |
| **Phase 5** | Wishlist / Reading List | `wishlistService.js`, `WishlistDrawer.jsx` | `scripts/test-wishlist.mjs` (8 tests) | ✅ Verified & Pushed |
| **Phase 6** | Inventory Domain Service | `inventoryService.js`, `BookDetailPage.jsx` | `scripts/test-inventory.mjs` (8 tests) | ✅ Verified & Pushed |
| **Phase 7** | Pricing & Tax Service | `pricingService.js`, HSN 4901 0% GST, Institutional Tiers | `scripts/test-pricing.mjs` (8 tests) | ✅ Verified & Pushed |
| **Phase 8** | Promotions & Coupons | `couponService.js`, Category Eligibility & Vouchers | `scripts/test-coupon.mjs` (8 tests) | ✅ Verified & Pushed |
| **Phase 9** | Shipping & Dispatch | `shippingService.js`, `pincodeService.js`, Weight Tiers | `scripts/test-shipping.mjs` (8 tests) | ✅ Verified & Pushed |
| **Phase 10** | Checkout State Machine | `checkoutStateMachine.js`, `orderService.js`, Proforma Invoice | `scripts/test-order-checkout.mjs` (8 tests) | ✅ Verified |

**Total Automated Domain Tests Passing**: **74/74** tests across all 10 implemented domains with 0 regressions.

---

## 🎨 Design System & Visual Identity

The platform adheres to a dignified, institutional South Indian aesthetic:

| Token | Value | Role |
| :--- | :--- | :--- |
| **`--color-maroon`** | `#5E1624` | Primary brand color, institutional authority, sacred binding tone |
| **`--color-maroon-dark`** | `#420D18` | Deep header tone, active states, high-contrast borders |
| **`--color-gold`** | `#C59B27` | Accent trim, medal badges, sacred verse highlights |
| **`--color-gold-light`** | `#DFBF5F` | Illuminated titles, Kannada subtitles, star elements |
| **`--color-bg-cream`** | `#FAF7F2` | Ivory manuscript canvas, body background, soft warmth |
| **`--color-bg-neutral`** | `#F3EDE2` | Card backgrounds, pill tags, dividers |
| **`--font-serif`** | `Cinzel, Georgia, serif` | Classical editorial headings |
| **`--font-kannada`** | `Noto Sans Kannada, sans-serif` | Sacred Kannada script rendering |

### Tactile Physical Button Styling
All buttons and triggers across the application are styled as tactile, elevated components:
- **Primary Buttons (`.btn-primary`)**: Solid maroon fill (`#5E1624`), white text, and shadow lift on hover.
- **Outline Buttons (`.btn-outline`)**: Solid white fill (`#FFFFFF`), bold 1.5px maroon border, maroon text (`700` weight), transitioning to solid maroon on hover.
- **Institutional Gold Buttons (`.btn-institutional-gold`)**: Rich gold gradient fill (`#DFBF5F` to `#C59B27`) with deep maroon text (`#420D18`).
- **Subject Folio Action Buttons (`.subject-card-action`)**: Full-width rounded buttons on every category card.
- **Top Utility Bar Buttons (`.top-bar-btn`, `.top-bar-btn-gold`)**: Subtle pill buttons for "Track Consignment" and "Bulk Orders".
- **Mobile Menu Buttons (`.mobile-nav-btn`)**: Full-width interactive card tiles with active maroon fill.

---

## 🌟 Key Application Features

### 1. Interactive 3D Vachana Manuscript Turner (`InteractiveVachanaFlipper.jsx`)
- **Genuine 3D Page Turn**: Simulates physical turning of a palm-leaf parchment codex using CSS 3D transforms (`rotateY` with perspective, dynamic book crease shadows, and dual-sided leaves).
- **Bilingual Manuscript Presentation**: Left leaf features the original Kannada text with sacred seal (`❖ ಶ್ರೀ ಗುರುಬಸವಲಿಂಗಾಯ ನಮಃ`), and right leaf features the scholarly English translation and critical philological commentary.
- **Direct Bookstore Integration**: Both leaves feature dedicated action buttons to inspect and order the parent volume in the bookstore.
- **Verse Selector Controls**: Numbered segmented pill buttons (`[ Verse 1 ]`, `[ Verse 2 ]`, `[ Verse 3 ]`) replace passive dots.
- **Mobile Optimization**: 3D turning leaf simulation tailored for touch screens with left/right swipe gestures.

### 2. Editorial Hero Section (`HeroEditorial.jsx`)
- **2-Column Layout**: Left column features institutional kicker, regal typography, Kannada sacred subtitle, full catalogue CTA, categories CTA, and trust points (0% GST, India Post dispatch, subsidized non-profit editions).
- **Featured Publication Showcase**: Right column hosts a clean book canvas with numbered volume switcher tabs (`[ 1 ] [ 2 ] [ 3 ]`), cover preview, short description, pricing, and instant "Add to Cart" / "Preview" buttons.

### 3. Study Reading List Drawer (`WishlistDrawer.jsx`)
- Accessible from the header bookmark icon and mobile menu drawer with live counter badge.
- Allows readers to curate books, remove titles, move individual items to the cart, or execute a one-click **"Move All Books to Cart"** batch transfer.

### 4. Comprehensive Master Catalogue (`CataloguePage.jsx`)
- **Full Catalog**: 49 canonical publications spanning Vachana literature, Veerashaiva philosophy, yoga, and historical chronicles.
- **Faceted Filters**: Instant multi-facet filtering by category, series, language (Kannada, English, Tamil, Telugu), and price range slider.
- **Active Filter Chips**: Clear visual badges for active criteria with one-click dismiss and a dedicated "Clear All" button.
- **Progressive Pagination**: Smooth incremental "Load More" functionality.

### 5. Single Monograph Detail Page (`BookDetailPage.jsx`)
- Full philological information, ISBN, page count, and language.
- Interactive binding variant selector (Paperback vs. Deluxe Hardbound) updating price in real time.
- Integrated quantity stepper, "Add to Cart", "Buy Now", and "Save to Study List" buttons.
- Related publications carousel from the same publishing series.

### 6. Seamless Postal Checkout & Invoicing (`CheckoutPage.jsx`)
- Postal shipping address form with real-time Indian PIN code validation.
- Itemized cost breakdown including subtotal, promotional discount, postal delivery fee, and 0% GST exemption.
- Generates official order reference numbers and structured proforma invoice data.

### 7. Performance & Loading Optimizations
- **Initial Load Only**: The flipping book loading animation runs strictly on the first browser entry and manual page refreshes; internal route switches are instantaneous.
- **Scroll Reveal**: Automatic intersection-observer animations (`useScrollReveal.js`) with tuned mobile margins to eliminate blank scroll pauses.
- **Build Performance**: Full production bundle builds in under 800ms with zero compilation warnings.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/PavanKumar-HQ/jss.git

# Navigate into the project directory
cd jss

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
The development server will spin up locally (typically at `http://localhost:5173/`).

### Production Build
```bash
npm run build
```
Generates an optimized production bundle inside the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

---

## 🛡️ Enterprise Security Architecture Charter

Security is treated as a **core architectural requirement**, not an afterthought added to checkout.

### Golden Rule: The Frontend is Never an Authority
> **"The frontend is never an authority. Any value affecting money, inventory, eligibility, customer data, payment, order state, shipping, discounts, or permissions must be independently validated and enforced by the backend. Client-side services exist for UX/state management; they must not be treated as security boundaries."**

---

### The 20 Security Pillars

#### 1. Zero Frontend Trust (Financial & Inventory Invariance)
* Never trust client-side prices, discounts, inventory levels, coupon validation, submitted order totals, or shipping charges.
* Recalculate every monetary and inventory figure on the server during checkout initiation.
* A client tampering with local state (`price: 499` → `price: 1`) will be rejected with an authoritative calculation error upon transaction settlement.

#### 2. Authentication & Authorization
* Password hashing using **Argon2id** with high-memory parameters.
* Short-lived access tokens and refresh-token rotation with family detection.
* Secure, `HttpOnly`, `SameSite=Strict` cookies for browser sessions to eliminate XSS token theft.
* Protection against session fixation and brute-force account enumeration.
* Role-based hierarchical authorization:
  ```text
  Customer → Staff → Operations → Admin → Super Admin
  ```
  Route guards in React are purely for UX; every sensitive API endpoint strictly enforces server-side roles.

#### 3. Admin Security & Role-Based Access Control (RBAC)
* Least-privilege model across institutional workflows:
  | Action | Customer | Staff | Admin | Super Admin |
  | :--- | :---: | :---: | :---: | :---: |
  | View Own Orders | ✓ | ✓ | ✓ | ✓ |
  | View Inventory | — | ✓ | ✓ | ✓ |
  | Modify Inventory | — | Limited | ✓ | ✓ |
  | Create Coupon / Offer | — | — | ✓ | ✓ |
  | Refund / Cancel Order | — | Limited | ✓ | ✓ |
  | Change Book Pricing | — | — | ✓ | ✓ |
  | Manage Admin Accounts | — | — | — | ✓ |
* Every privileged action records an immutable audit log (`who`, `what`, `when`, `previous_value`, `new_value`).

#### 4. Payment Security & Idempotency
* Raw card details never touch institutional servers. Integrations use PCI-DSS Level 1 tokenized hosted checkout.
* Server-side signature and cryptographic webhook verification for all gateway callbacks.
* Strict idempotency keys on payment initiation and order placement to prevent duplicate charges or double orders under network retry.

#### 5. Coupon Abuse Protection
* Server-side rate limiting on coupon redemption attempts to prevent brute-forcing.
* Authoritative verification of: activation window, expiry, customer eligibility, category exclusions, minimum subtotal, and per-user usage limits.
* Atomic promotion locking during checkout.

#### 6. Inventory Race-Condition Protection
* Atomic reservation locks during checkout initiation to prevent overselling scarce physical titles.
* Concrete lifecycle states:
  ```text
  Available → Reserved → Paid → Packed → Shipped → Returned → Damaged → Restocked
  ```

#### 7. Checkout State Machine
* Strict server-enforced state transitions:
  ```text
  CART → CHECKOUT_STARTED → INVENTORY_RESERVED → PAYMENT_PENDING → PAYMENT_VERIFIED → ORDER_CONFIRMED
  ```
* Client cannot arbitrarily mutate status (`POST /order/status { status: "paid" }` is prohibited).

#### 8. API Hardening & Injection Defense
* Strict JSON schema validation on every endpoint.
* Parameterized queries and ORM safeguards against SQL/NoSQL injection.
* Object-level authorization (BOLA/IDOR protection): Order lookup verifies that requesting identity matches order owner.

#### 9. Cross-Site Scripting (XSS) Defense
* Context-aware HTML escaping; strict React output encoding.
* Zero unescaped `dangerouslySetInnerHTML`.
* Strict Content Security Policy (CSP) blocking unauthorized script injection.

#### 10. Cross-Site Request Forgery (CSRF) Defense
* `SameSite=Strict` cookies combined with anti-CSRF token validation for all state-changing endpoints (password change, address updates, order submissions, refunds).

#### 11. Security Headers
* Production deployment enforces:
  - `Content-Security-Policy: default-src 'self' ...`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), camera=(), microphone=()`
  - Framing protection via `frame-ancestors 'none'`.

#### 12. Secrets Management
* Zero credentials, API keys, or database passwords committed to version control.
* Environment isolation via `.env.local` and cloud secret managers, with mandatory immediate rotation upon potential exposure.

#### 13. PII Protection & Data Minimization
* Collect only strictly necessary shipping and contact details.
* Encrypted in transit (TLS 1.3) and encrypted at rest with restricted database read permissions.

#### 14. Order Privacy
* Internal order identifiers and customer order tracking URLs use non-guessable, cryptographically random reference tokens, preventing sequential ID enumeration.

#### 15. Secure Document & File Handling
* For institutional purchase orders or proof documents: MIME-type verification, magic number inspection, file-size limits, randomized file storage names outside public webroots, and signed temporary URLs for admin access.

#### 16. Audit Logging
* Comprehensive audit logging for all authentication attempts, administrative updates, price revisions, refunds, and cancellations.
* Zero logging of sensitive data (no passwords, card numbers, or authorization tokens).

#### 17. Cryptographic Webhook Security
* Asynchronous payment and courier webhook endpoints verify HMAC signatures, timestamp freshness, and deduplicate events via transaction event tracking.

#### 18. Supply-Chain & Dependency Security
* Regular automated vulnerability audits (`npm audit`), automated dependency version pin verification, and minimal third-party surface area.

#### 19. Security Verification Protocol
* Multi-layer security testing: Unit test edge cases, state transition fuzzing, authorization tests, and concurrency simulation before production promotion.

#### 20. Architectural Covenant
* Client-side services (`cartService`, `orderService`, `pincodeService`, `couponService`) remain clean domain drivers for local state and responsive UI; authoritative settlement belongs exclusively to backend contracts.

---

## 11. Technical SEO, AEO, AI Search & Web Performance Engine

A complete, production-grade optimization engine built directly into the Vite/React SPA architecture:

### 1. Traditional & Generative Search Optimization (SEO / GEO)
* **Centralized Metadata Manager (`src/utils/seo.js`)**: Dynamic DOM head controller maintaining synchronized `document.title`, `<meta name="description">`, `<meta name="keywords">`, and `<link rel="canonical">`.
* **Canonical URL Hygiene**: Deterministic stripping of query tokens, tracking fragments, and referral tracking (`utm_source=chatgpt.com`, `utm_medium=ai`, etc.) ensuring duplicate indexed URLs cannot form.
* **Open Graph & Twitter Cards**: Complete social graph parity with high-resolution image cards, localized alternate tags (`kn_IN`, `en_IN`), and entity publishers.
* **Institutional 404 Routing**: Clean archival fallback view with search recommendations and explicit `robots: noindex, nofollow` headers to eliminate soft 404 indexing.

### 2. Answer Engine Optimization (AEO)
* **Direct Factual Answers**: Embedded high-density factual question-and-answer pairs answering core questions (Entity identity, Vachana literature scope, Mysuru bookstore location, 0% GST HSN 4901 exemption, postal Speed Post dispatch, and library procurement guidelines).
* **Schema.org FAQPage**: Dynamic structured FAQ graph enabling instant citations on Google AI Overviews, Gemini, Bing Copilot, and Perplexity.

### 3. AI Discoverability & Model Training Manifests (`/llms.txt`)
* **Standard `public/llms.txt`**: Concise markdown specification for LLM agents detailing institutional identity, canonical collections, series, and ordering procedures.
* **Full Manifest `public/llms-full.txt`**: Complete 49-publication textual manifest detailing titles, Kannada scripts, ISBNs, authors, pricing, page counts, and authentic excerpts for non-JavaScript LLM scrapers.
* **Direct Robot Directives (`public/robots.txt`)**: Explicit permissions for `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, and `Applebot-Extended`, while strictly shielding private transactional paths (`/cart`, `/checkout`, `/admin`).

### 4. Rich Schema.org Linked Data Graphs
* **`Organization`**: Authoritative entity representation of *JSS Mahavidyapeetha - Publications Division / Jagadguru Sri Shivarathreeshwara Granthamale* with `@id`, contact points, and verified social links.
* **`BookStore` / `LocalBusiness`**: Complete physical retail counter definition (*JSS Book House, Mysuru*) with geo coordinates (`12.3051, 76.6552`), INR price range, payment types, and operating hours.
* **`Book` & `Product` Dual Graph**: Injected per book route with ISBN, author, Kannada alternate title, page count, binding format, inLanguage, and Offer details linked to the physical bookstore counter.
* **`BreadcrumbList`**: Full 4-tier navigation breadcrumb schema reflecting live hierarchy.
* **`CollectionPage` & `ItemList`**: Category and catalogue search indexes for search engine crawler spiders.

### 5. Web Performance & Accessibility (WCAG 2.1 AA)
* **CLS Elimination**: Explicit `width` and `height` dimensions on all catalogue cover cards (`BookCard`), hero showcases, and product details.
* **LCP Acceleration**: Preconnected Google Fonts, `loading="eager"` and `fetchPriority="high"` on primary hero and product covers.
* **Asynchronous Off-Screen Loading**: `loading="lazy"` and `decoding="async"` applied across all secondary book cards.
* **Semantic Anchor Breadcrumbs**: Upgraded all breadcrumbs from non-standard `<span>` tags to semantic `<nav aria-label="Breadcrumb">` and accessible `<a href="...">` links.
* **Unit Test Coverage**: Automated test suite (`scripts/test-seo.mjs`) verifying canonicalization, sitemap URL count (55 URLs), robots directives, and structured data schemas.

---

*© Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru.*

