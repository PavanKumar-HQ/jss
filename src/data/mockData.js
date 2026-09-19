import rawBooks from '../../data/books.json';

// Helper function to extract numerical price from price strings
function parsePriceNumber(priceStr, fallback = 150) {
  if (!priceStr) return fallback;
  const match = priceStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : fallback;
}

// Transform raw scraped books into clean structured catalogue items
export const mockProducts = rawBooks.map((item, index) => {
  const numericPrice = parsePriceNumber(item.price, 150);
  const numericSpecialPrice = item.special_price ? parsePriceNumber(item.special_price) : null;
  const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return {
    id: item.id || index + 1,
    slug: slug,
    title: item.title,
    titleKannada: item.title, // In real deployment, holds Kannada script title
    author: item.author || 'JSS Granthamale Editorial Board',
    translator: item.translator || '',
    language: item.language || 'Kannada',
    series: item.series || (index % 3 === 0 ? 'Sharana Samskruti Male' : index % 4 === 0 ? 'Vachana Vyakyana Male' : ''),
    category: item.category || (index % 2 === 0 ? 'Vachana Literature' : index % 3 === 0 ? 'Veerashaiva Philosophy' : 'Spirituality & Yoga'),
    edition: item.edition || 'Standard Edition',
    variant: item.variant || (numericSpecialPrice ? 'Deluxe Hardbound' : 'Regular Paper'),
    hasVariants: Boolean(numericSpecialPrice),
    price: numericPrice,
    specialPrice: numericSpecialPrice,
    pages: item.pages || 160,
    publishedYear: 2020 + (index % 5),
    isbn: `978-81-94520-${(10 + index).toString().padStart(2, '0')}`,
    publisher: 'JSS Granthamale',
    inStock: true,
    rating: (4.7 + (index % 4) * 0.1).toFixed(1),
    reviewsCount: 15 + index * 3,
    description: item.description || `Authentic publication preserved under Jagadguru Sri Shivarathreeshwara Granthamale, JSS Mahavidyapeetha, Mysuru. Focuses on Vachana philosophy and Indian spiritual heritage.`,
    sampleExcerpt: `ವಚನ ಹಾಗೂ ಧರ್ಮ ಸಾಹಿತ್ಯದ ಅನರ್ಘ್ಯ ರತ್ನ: ${item.title}. ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆಯ ಪವಿತ್ರ ಪ್ರಕಟಣೆ...`,
    imageUrl: item.image_url,
    localImage: item.local_image_filename,
    isFeatured: index < 6
  };
});

export const mockCategories = [
  "All Categories",
  "Vachana Literature",
  "Veerashaiva Philosophy",
  "Spirituality & Yoga",
  "Biographies & Heritage",
  "Education & Science",
  "Periodicals & Panchangas"
];

export const mockSeries = [
  "All Series",
  "Sharana Samskruti Male",
  "Vachana Vyakyana Male",
  "Golden Jubilee Endowment Series"
];

export const mockLanguages = ["All Languages", "Kannada", "English", "Tamil", "Telugu"];

export const mockPublishers = ["All Publishers", "JSS Granthamale", "Distributed by JSS Book House"];

export const mockPeriodicals = [
  {
    id: "p1",
    name: "Prasada (ಪ್ರಸಾದ)",
    frequency: "Bimonthly (6 Issues / Year)",
    language: "Bilingual (Kannada & English)",
    foundedYear: 1967,
    priceYearly: 300,
    issn: "0970-4235",
    description: "Flagship cultural and philosophical journal featuring articles on Vachana literature, Lingayat tradition, and spiritual heritage.",
    coverUrl: "https://jssonline.org/wp-content/uploads/2021/11/Prasada.jpg"
  },
  {
    id: "p2",
    name: "Sharanapatha (ಶರಣಪಥ)",
    frequency: "Bi-Annual (2 Issues / Year)",
    language: "English",
    foundedYear: 1990,
    priceYearly: 200,
    issn: "0971-8893",
    description: "Scholarly English research journal dedicated to introducing Vachana philosophy and Indian spirituality to international readers.",
    coverUrl: "https://jssonline.org/wp-content/uploads/2021/11/Sharanapatha.jpg"
  },
  {
    id: "p3",
    name: "JSS Kannada Panchanga 2026",
    frequency: "Annual",
    language: "Kannada",
    foundedYear: 1954,
    priceYearly: 80,
    issn: "N/A",
    description: "Official astronomical calendar detailing tithi, nakshatra, religious festivals, and auspicious times calculated according to traditional Sidereal astronomy.",
    coverUrl: "https://jssonline.org/wp-content/uploads/2021/11/Panchanga.jpg"
  }
];

// DATA SERVICE LAYER (Easy to swap mock data with live API)
export const DataService = {
  async getProducts() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProducts), 100);
    });
  },

  async getProductById(id) {
    return new Promise((resolve) => {
      const found = mockProducts.find((p) => p.id === Number(id));
      resolve(found || null);
    });
  },

  async searchProducts(query, category, series, language, priceMax) {
    return new Promise((resolve) => {
      let filtered = [...mockProducts];
      if (query && query.trim() !== '') {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.author.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
      if (category && category !== 'All Categories') {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (series && series !== 'All Series') {
        filtered = filtered.filter((p) => p.series === series);
      }
      if (language && language !== 'All Languages') {
        filtered = filtered.filter((p) => p.language.includes(language));
      }
      if (priceMax) {
        filtered = filtered.filter((p) => p.price <= priceMax);
      }
      resolve(filtered);
    });
  }
};
