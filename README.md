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
- **Item Bounds**: Enforces a strict retail limit of maximum 10 copies per title (bulk orders redirected to institutional workflow).
- **Variant Pricing**: Resolves binding variants dynamically (e.g. Paperback ₹200 vs. Deluxe Hardbound ₹350).
- **Financial Calculations**: Computes item counts, gross subtotal, applied discount, ₹40 standard shipping vs. free postal delivery over ₹500, and 0% GST compliance.
- **Pub/Sub Reactivity**: Exposes `subscribe(callback)` allowing disparate components (`Navbar`, `CartDrawer`, `BookCard`) to synchronize state automatically without prop drilling.

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

## 📜 Compliance & Legal
- **HSN Chapter 4901**: In accordance with the Goods and Services Tax Act of India, all printed books, religious scriptures, scholarly monographs, and academic periodicals published by JSS Mahavidyapeetha are **100% exempt from GST (0% GST)**.
- **India Post Dispatch**: Parcels are dispatched directly from the JSS Book House retail sales counter, Mysore, Karnataka 570004.

---

*© Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru.*
