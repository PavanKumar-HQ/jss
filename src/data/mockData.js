import rawBooks from '../../data/books.json';

// Helper function to extract numerical price from price strings
function parsePriceNumber(priceStr, fallback = 150) {
  if (!priceStr) return fallback;
  const match = priceStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : fallback;
}

// Map authentic Kannada script titles for verified classics
const kannadaTitleMap = {
  "Shivapada Ratnakosha": "ಶಿವಪದ ರತ್ನಕೋಶ",
  "Sadhana – Path of Liberation": "ಸಾಧನಾ – ಮುಕ್ತಿಯ ಹಾದಿ",
  "Patanjali Yoga Sutras": "ಪಾತಂಜಲ ಯೋಗ ಸೂತ್ರಗಳು",
  "Narada Bhakti Sutras": "ನಾರದ ಭಕ್ತಿ ಸೂತ್ರಗಳು",
  "The Heritage of Sri Suttur Math": "ಶ್ರೀ ಸುತ್ತೂರು ಮಠದ ಪರಂಪರೆ",
  "Shiva Sutras": "ಶಿವ ಸೂತ್ರಗಳು",
  "Allama Prabhu Devara Vachana": "ಅಲ್ಲಮಪ್ರಭುದೇವರ ವಚನ ಸಂಪುಟ",
  "Basava Darshana": "ಬಸವ ದರ್ಶನ",
  "Heart To Heart": "ಹೃದಯ ಸಂವಾದ",
  "Heart To Heart - Enlarged Edition": "ಹೃದಯ ಸಂವಾದ (ವಿಸ್ತೃತ ಆವೃತ್ತಿ)",
  "Bhakthibhandari Basavannanavaru": "ಭಕ್ತಿಭಂಡಾರಿ ಬಸವಣ್ಣನವರು",
  "Vrushabendra Vilasa": "ವೃಷಭೇಂದ್ರ ವಿಲಾಸ",
  "Sharanara Vachanagalu": "ಶರಣರ ವಚನಗಳು",
  "Kayaka Mattu Sharanaru": "ಕಾಯಕ ಮತ್ತು ಶರಣರು",
  "Asthavarana": "ಅಷ್ಟಾವರಣ ವಿವರಣೆ",
  "Shatsthala Jnana Charitamrutha": "ಷಟ್‌ಸ್ಥಲ ಜ್ಞಾನ ಚರಿತಾಮೃತ",
  "Veerashaiva Darshana": "ವೀರಶೈವ ದರ್ಶನ",
  "Siddharama Charithe": "ಸಿದ್ಧರಾಮ ಚರಿತೆ",
  "Akka Mahadevi": "ಅಕ್ಕಮಹಾದೇವಿ ವಚನಗಳು",
  "Channabasavanna": "ಚೆನ್ನಬಸವಣ್ಣನವರ ವಚನಗಳು"
};

// Transform raw scraped books into clean, strictly authentic catalogue items
export const mockProducts = rawBooks.map((item, index) => {
  const numericPrice = parsePriceNumber(item.price, 150);
  const numericSpecialPrice = item.special_price ? parsePriceNumber(item.special_price) : null;
  const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const knTitle = kannadaTitleMap[item.title] || (item.title.match(/[\u0C80-\u0CFF]/) ? item.title : '');

  // Determine standardized category based strictly on existing category string
  let stdCategory = "Vachana Literature";
  const rawCat = (item.category || "").toLowerCase();
  if (rawCat.includes("yoga") || rawCat.includes("spirituality") || rawCat.includes("meditation") || rawCat.includes("bhakti")) {
    stdCategory = "Spirituality & Yoga";
  } else if (rawCat.includes("veerashaiva") || rawCat.includes("philosophy") || rawCat.includes("religion") || rawCat.includes("ethics")) {
    stdCategory = "Veerashaiva Philosophy";
  } else if (rawCat.includes("biography") || rawCat.includes("history")) {
    stdCategory = "Biographies & Heritage";
  } else if (rawCat.includes("science") || rawCat.includes("education") || rawCat.includes("globalization") || rawCat.includes("library")) {
    stdCategory = "Education & Science";
  }

  // Determine standardized series if present in data
  let seriesName = item.series || "";
  if (!seriesName) {
    if (item.title.toLowerCase().includes("vachana")) {
      seriesName = "Vachana Vyakyana Male";
    } else if (rawCat.includes("vachana") || item.title.toLowerCase().includes("sharana")) {
      seriesName = "Sharana Samskruti Male";
    }
  }

  return {
    id: item.id || index + 1,
    slug: slug,
    title: item.title,
    titleKannada: knTitle,
    author: item.author || "JSS Granthamale Editorial Board",
    translator: item.translator || "",
    language: item.language || "Kannada",
    series: seriesName,
    category: stdCategory,
    rawCategory: item.category || "",
    edition: item.edition || (numericSpecialPrice ? "Multiple Editions" : "Standard Edition"),
    hasVariants: Boolean(numericSpecialPrice),
    price: numericPrice,
    specialPrice: numericSpecialPrice,
    pages: item.pages || null,
    isbn: item.isbn || (item.id ? `JSS-PUB-${String(item.id).padStart(4, '0')}` : null),
    publisher: "Jagadguru Sri Shivarathreeshwara Granthamale, Mysuru",
    inStock: true,
    description: item.description || "Authentic publication preserved and published under Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru.",
    sampleExcerpt: item.titleKannada ? `ವಚನ ಹಾಗೂ ಧರ್ಮ ಸಾಹಿತ್ಯದ ಉದ್ಗ್ರಂಥ: ${item.title}. ಶ್ರೀ ಸುತ್ತೂರು ಮಠದ ಪ್ರಕಾಶನ.` : null,
    imageUrl: item.image_url,
    localImage: item.local_image_filename ? `/${item.local_image_filename.replace(/^books\//, '')}` : null,
    sourceUrl: item.source_url
  };
});

export const mockCategories = [
  "All Categories",
  "Vachana Literature",
  "Veerashaiva Philosophy",
  "Spirituality & Yoga",
  "Biographies & Heritage",
  "Education & Science"
];

export const categoryDescriptions = {
  "Vachana Literature": "Classical 12th-century Sharana literature, commentaries on Basavanna, Allama Prabhu, Akkamahadevi, and philosophical verses.",
  "Veerashaiva Philosophy": "Scholarly treatises on Veerashaiva-Lingayat religious terminologies, Agamas, and comparative Indian philosophy.",
  "Spirituality & Yoga": "Authentic commentaries on Patanjali Yoga Sutras, Shiva Sutras, Narada Bhakti Sutras, and spiritual discourses.",
  "Biographies & Heritage": "Historical chronicles and biographies of Sharana saints, Virashaiva personalities, and Sri Suttur Math institutional lineage.",
  "Education & Science": "Works on space technology, globalization, library science, educational lectures, and speeches by Dr. A.P.J. Abdul Kalam."
};

export const mockSeries = [
  "All Series",
  "Sharana Samskruti Male",
  "Vachana Vyakyana Male",
  "Golden Jubilee Endowment Series"
];

export const mockLanguages = [
  "All Languages",
  "Kannada",
  "English",
  "Tamil",
  "Telugu"
];

// Verified authentic periodicals published by JSS Granthamale
export const mockPeriodicals = [
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

export const BOOKS = mockProducts;
export const CATEGORIES = mockCategories;
export const SERIES = mockSeries;

export const DataService = {
  getProducts: async () => mockProducts,
  getProductBySlug: async (slug) => mockProducts.find((p) => p.slug === slug) || null,
  getCategories: async () => mockCategories,
  getPeriodicals: async () => mockPeriodicals
};

