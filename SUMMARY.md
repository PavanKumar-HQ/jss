# JSS Publications — Research Summary

**Date:** 17 September 2026  
**Project:** E-commerce website for JSS Mahavidyapeetha book publications  
**Client:** JSS Publications / JSS Book House (Jagadguru Sri Shivarathreeshwara Granthamale)  
**Website researched:** https://jssonline.org/publications/books-published

---

## What We Found

### Organization
JSS Mahavidyapeetha is a large educational and social service institution based in Mysuru, Karnataka. Its publication division — **Jagadguru Sri Shivarathreeshwara Granthamale** (JSS Granthamale) — has published over 100 book titles, calendars, panchangas, periodicals (Prasada, Sharanapatha, JSS Monthly), audio/video CDs, and mementos. A retail outlet called **JSS Book House** sells these publications, allegedly located in Agrahara, Mysore (unverified from official site — the official /jss-book-house/ page is a 404).

### The Current Website Is NOT E-Commerce
The existing site at jssonline.org is a WordPress brochure site. The Books Published page lists 49 books with cover images, prices, and page counts, but there is **no cart, no checkout, no payment, no ordering mechanism**. Customers presumably enquire by phone/email or visit the book house in person.

### Book Catalogue (49 books scraped)
The catalogue is rich but unstructured:

- **Languages:** Primarily Kannada, with English, Tamil, and Telugu titles
- **Content themes:** Veerashaiva/Lingayat religion, Vachana literature (12th century saints), philosophy, spirituality, yoga, biographies, education, science
- **Series identified:** Sharana Samskruti Male (~69+ books planned, 6 on site), Vachana Vyakyana Male (multiple sub-series), Golden Jubilee Endowment Series, Virashaiva Punya Purusharu Male
- **Pricing:** Rs.10 to Rs.2000; most books Rs.12–Rs.500. Multiple pricing tiers (Ordinary/Special/Deluxe) for some books
- **Key titles:** Shivapada Ratnakosha (Rs.1000, 896 pages), Patanjali Yoga Sutras (Rs.300/500, 334 pages), Basava Darshana (Rs.300/400, 388 pages), Heart To Heart by Dr. A.P.J. Abdul Kalam (Rs.350/450, 216 pages), Allama Prabhu Devara Vachana (Rs.300, 1116 pages), Vrushabendra Vilasa (Rs.2000, 438 pages)

### Data Quality Issues
- **Missing authors:** ~15 books have no author listed on detail pages
- **Missing prices:** 1 book (Sirumana charithe)
- **Inconsistent price formats:** "Rs.1000" vs "Rs. 50" vs "2000 Rs." vs "Ordinary- Rs. 200; Special- Rs. 400"
- **Pages inconsistency:** Narada Bhakti Sutras — listing says 188, detail says 175
- **Duplicate titles:** "Veerashiva Darshana" appears as two different books (Rs.500/594 pages and Rs.12/80 pages) with the same cover image — likely a data error
- **No ISBNs found** for any book
- **No publication dates** structured
- **No structured categories** — series are listed as sub-headings on a single page
- **Language** is often inferred, not explicit

### Images
49 book cover images were downloaded from the site (all from `jssonline.org/wp-content/uploads/`). These are resized thumbnails (e.g., 394x600, 409x600). Higher-resolution originals may exist but are not publicly exposed.

---

## The Gap (What Needs to Be Built)

| Area | Current State | Needed |
|------|---------------|--------|
| Catalogue | Single flat page, 49 books | Structured database with series, categories, languages, authors, editions |
| Search/Filter | None | Full-text search, filter by series/category/language/author/price |
| Product pages | Basic title/image/price/pages | Rich pages with full metadata, descriptions, related books |
| Cart/Checkout | None | Full cart, quantity, address, shipping, payment, confirmation |
| Payments | None | Payment gateway integration (provider TBD by client) |
| Shipping | None | Shipping zones, rates, COD option, delivery estimates |
| Orders | None | Order management, status tracking, invoices |
| Customer accounts | None | Optional — for order history, saved addresses |
| Notifications | None | Email/SMS/WhatsApp (optional, client preference) |
| Admin | Manual WordPress posts | Admin dashboard for products, inventory, orders, customers |
| SEO | No structured data, no sitemap found | Book/Product schema, sitemap, meta descriptions, alt text |
| Mobile | Unverified | Mobile-first responsive design |

---

## Files Created

| File | Description |
|------|-------------|
| `data/books.json` | Complete structured dataset of all 49 books (JSON) |
| `data/books.csv` | Same dataset in CSV format |
| `books/<slug>/cover.jpg` | 49 downloaded book cover images |
| `JSS_PUBLICATIONS_RESEARCH.md` | Full research document with all findings, sources, and analysis |
| `JSS_CLIENT_QUESTIONS.md` | 64 questions for the client covering inventory, pricing, shipping, payments, returns, features, admin, legal, timeline |

---

## Key Questions for the Client

1. **Is JSS Book House operational?** Official address and contact for book sales? (The official website page is a 404.)
2. **Are all 49 listed books currently in stock and available for purchase?**
3. **Are prices current?** When were they last updated?
4. **What are the physical differences** between Ordinary/Special/Deluxe variants?
5. **Shipping:** Within India? International? Charges? COD?
6. **Online payments:** Yes/No? Preferred gateway?
7. **GST:** Applicable? Rate? Invoice requirements?
8. **Return/refund/cancellation/replacement policy?**
9. **Who will manage the e-commerce admin?**
10. **Should the site be part of jssonline.org or separate?**
11. **Do you have higher-resolution cover images?**
12. **Complete book metadata:** Do you have a structured database/spreadsheet of all books with authors, translators, languages, descriptions?
13. **Sharana Samskruti Male series:** Full list of 69+ published books — only 6 are on the website.
14. **Customer accounts:** Yes or no?
15. **WhatsApp/Email/SMS notifications:** Yes or no?
16. **Timeline and budget?**

---

## Recommended Starting Point

Given the existing WordPress site, **WordPress + WooCommerce** with a custom theme is the most pragmatic approach. The 49-book catalogue can be migrated into WooCommerce products, with custom taxonomies for Series, Category, Language, and Author. This keeps the client in a familiar admin environment while adding full e-commerce capability.

The data is ready. The images are downloaded. The research is documented. What's needed now is a conversation with the client to answer the questions above and confirm requirements before building.
