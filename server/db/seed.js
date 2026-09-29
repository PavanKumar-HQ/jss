/**
 * Authoritative Database Seeder
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Populates persistent database tables from canonical cultural publications data.
 */

import { db } from '../services/db.js';
import rawBooks from '../../src/data/rawBooks.js';

const KANNADA_TITLE_MAP = {
  "Shivapada Ratnakosha": "ಶಿವಪದ ರತ್ನಕೋಶ",
  "Sadhana – Path of Liberation": "ಸಾಧನಾ – ಮುಕ್ತಿಯ ಹಾದಿ",
  "Patanjali Yoga Sutras": "ಪಾತಂಜಲ ಯೋಗ ಸೂತ್ರಗಳು",
  "Narada Bhakti Sutras": "ನಾರದ ಭಕ್ತಿ ಸೂತ್ರಗಳು",
  "The Heritage of Sri Suttur Math": "ಶ್ರೀ ಸುತ್ತೂರು ಮಠದ ಪರಂಪರೆ",
  "Shiva Sutras": "ಶಿವ ಸೂತ್ರಗಳು",
  "Allama Prabhu Devara Vachana": "ಅಲ್ಲಮಪ್ರಭುದೇವರ ವಚನ ಸಂಪುಟ",
  "Basava Darshana": "ಬಸವ ದರ್ಶನ",
  "Heart To Heart": "ಹೃದಯ ಸಂವಾದ",
  "Heart to Heart": "ಹೃದಯ ಸಂವಾದ (ಡಾ. ಎ.ಪಿ.ಜೆ. ಅಬ್ದುಲ್ ಕಲಾಂ)",
  "Bhakthibhandari Basavannanavaru": "ಭಕ್ತಿಭಂಡಾರಿ ಬಸವಣ್ಣನವರು",
  "Vrushabendra Vilasa": "ವೃಷಭೇಂದ್ರ ವಿಲಾಸ",
  "Sharanara Vachanagalu": "ಶರಣರ ವಚನಗಳು",
  "Kayaka Mattu Sharanaru": "ಕಾಯಕ ಮತ್ತು ಶರಣರು",
  "Asthavarana": "ಅಷ್ಟಾವರಣ ವಿವರಣೆ",
  "Shatsthala Jnana Charitamrutha": "ಷಟ್‌ಸ್ಥಲ ಜ್ಞಾನ ಚರಿತಾಮೃತ",
  "Veerashaiva Darshana": "ವೀರಶೈವ ದರ್ಶನ",
  "Siddharama Charithe": "ಸಿದ್ಧರಾಮ ಚರಿತೆ",
  "Akka Mahadevi": "ಅಕ್ಕಮಹಾದೇವಿ ವಚನಗಳು",
  "Channabasavanna": "ಚೆನ್ನಬಸವಣ್ಣನವರ ವಚನಗಳು",
  "Prasada": "ಪ್ರಸಾದ (ದ್ವೈಮಾಸಿಕ ಪತ್ರಿಕೆ)",
  "Panchachara": "ಪಂಚಾಚಾರ ವಿವರಣೆ",
  "Shaivagamagalu": "ಶೈವಾಗಮಗಳು",
  "Molige Mahadevi Vachanagalu": "ಮೊಳಿಗೆ ಮಹಾದೇವಿ ವಚನಗಳು"
};

function normalizeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePrice(raw) {
  if (typeof raw === 'number') return raw;
  if (!raw) return 150;
  const num = String(raw).replace(/[^0-9.]/g, '');
  return parseFloat(num) || 150;
}

export function seedDatabase(force = false) {
  const existingBooksCount = db.queryOne('SELECT COUNT(*) as count FROM books').count;
  if (existingBooksCount > 0 && !force) {
    console.log(`[seed] Database already contains ${existingBooksCount} books. Skipping seed.`);
    return;
  }

  console.log('[seed] Seeding JSS Publications database with authentic data...');

  db.transaction((tx) => {
    if (force) {
      tx.exec('DELETE FROM order_events');
      tx.exec('DELETE FROM order_items');
      tx.exec('DELETE FROM orders');
      tx.exec('DELETE FROM stock_reservations');
      tx.exec('DELETE FROM inventory_ledger');
      tx.exec('DELETE FROM inventory');
      tx.exec('DELETE FROM editions');
      tx.exec('DELETE FROM books');
      tx.exec('DELETE FROM faqs');
      tx.exec('DELETE FROM coupons');
      tx.exec('DELETE FROM staff_users');
      tx.exec('DELETE FROM settings');
    }

    const insertBook = tx.prepare(`
      INSERT INTO books (
        id, slug, title, title_kannada, author, publisher, language,
        category, series, description, publication_year, status,
        featured, cover_image, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertEdition = tx.prepare(`
      INSERT INTO editions (
        id, book_id, binding, isbn, price, pages, weight_grams, is_deluxe, stock_limit, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertInventory = tx.prepare(`
      INSERT INTO inventory (
        edition_id, book_id, available_stock, reserved_stock, sold_stock, damaged_stock, low_stock_threshold, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertLedger = tx.prepare(`
      INSERT INTO inventory_ledger (
        id, edition_id, previous_stock, change_amount, new_stock, operation_type, reason, actor, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    rawBooks.forEach((b, index) => {
      const bookId = `jss-pub-${String(b.id || index + 1).padStart(4, '0')}`;
      const slug = normalizeSlug(b.title);
      const titleKannada = KANNADA_TITLE_MAP[b.title] || '';
      const basePrice = parsePrice(b.price);
      let category = b.category || 'Vachana Literature';
      if (category.toLowerCase().includes('vachana')) category = 'Vachana Literature';
      else if (category.toLowerCase().includes('veerashaiva') || category.toLowerCase().includes('lingayat')) category = 'Veerashaiva Philosophy';
      else if (category.toLowerCase().includes('spirituality') || category.toLowerCase().includes('yoga')) category = 'Spirituality & Yoga';
      else if (category.toLowerCase().includes('biography') || category.toLowerCase().includes('heritage')) category = 'Biographies & Heritage';
      else category = 'Education & Science';

      insertBook.run(
        bookId,
        slug,
        b.title,
        titleKannada,
        b.author || 'JSS Publications',
        'JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale',
        b.language || 'Kannada',
        category,
        b.series || '',
        b.description || '',
        2024,
        'published',
        index < 4 ? 1 : 0,
        b.image_url || '/assets/jss-logo.webp',
        now,
        now
      );

      // Create Paperback Edition
      const pbEditionId = `${bookId}-pb`;
      const pbIsbn = `978-81-94921-${String(b.id || index + 1).padStart(4, '0')}-1`;
      insertEdition.run(
        pbEditionId,
        bookId,
        'Paperback',
        pbIsbn,
        basePrice,
        b.pages || 250,
        410,
        0,
        10,
        'published',
        now,
        now
      );

      insertInventory.run(pbEditionId, bookId, 60, 0, 0, 0, 5, now);
      insertLedger.run(
        `ledg-${pbEditionId}-init`,
        pbEditionId,
        0,
        60,
        60,
        'RESTOCK',
        'Mysuru Publication Press Initial Run',
        'System Seed',
        now
      );

      // Books with base price >= 100 get a Hardbound edition
      if (basePrice >= 100) {
        const hbEditionId = `${bookId}-hb`;
        const hbPrice = Math.round(basePrice * 1.5);
        const hbIsbn = `978-81-94921-${String(b.id || index + 1).padStart(4, '0')}-2`;
        insertEdition.run(
          hbEditionId,
          bookId,
          'Hardbound',
          hbIsbn,
          hbPrice,
          b.pages || 250,
          580,
          0,
          8,
          'published',
          now,
          now
        );

        insertInventory.run(hbEditionId, bookId, 25, 0, 0, 0, 5, now);
        insertLedger.run(
          `ledg-${hbEditionId}-init`,
          hbEditionId,
          0,
          25,
          25,
          'RESTOCK',
          'Mysuru Publication Press Hardbound Binding Run',
          'System Seed',
          now
        );
      }

      // First 5 books also get a Deluxe Collector Edition
      if (index < 5) {
        const dlxEditionId = `${bookId}-dlx`;
        const dlxPrice = basePrice * 2.5;
        const dlxIsbn = `978-81-94921-${String(b.id || index + 1).padStart(4, '0')}-3`;
        insertEdition.run(
          dlxEditionId,
          bookId,
          'Collector Deluxe Edition (ವಿಶೇಷ ಸಂಪುಟ)',
          dlxIsbn,
          dlxPrice,
          b.pages || 250,
          890,
          1,
          5,
          'published',
          now,
          now
        );

        insertInventory.run(dlxEditionId, bookId, 8, 0, 0, 0, 3, now);
        insertLedger.run(
          `ledg-${dlxEditionId}-init`,
          dlxEditionId,
          0,
          8,
          8,
          'RESTOCK',
          'Limited Archival Deluxe Edition Reserve',
          'System Seed',
          now
        );
      }
    });

    // Seed Bilingual FAQs
    const insertFaq = tx.prepare(`
      INSERT INTO faqs (
        id, category, question, question_kn, answer, answer_kn, status, translation_status, display_order, views, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedFaqs = [
      {
        id: 'faq-01',
        category: 'JSS Publications',
        question: 'What is Jagadguru Sri Shivarathreeshwara Granthamale (JSS Publications)?',
        questionKn: 'ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆ ಎಂದರೇನು?',
        answer: 'Jagadguru Sri Shivarathreeshwara Granthamale is the premier publications and research wing of JSS Mahavidyapeetha, Mysuru. Founded under the spiritual auspices of Sri Suttur Veerashimhasana Math, it has been publishing authentic editions of 12th-century Vachana literature, Shaiva Agamas, Indian philosophy, and classical Kannada treatises since the mid-20th century.',
        answerKn: 'ಜಗದ್ಗುರು ಶ್ರೀ ಶಿವರಾತ್ರೀಶ್ವರ ಗ್ರಂಥಮಾಲೆಯು ಜೆಎಸ್ಎಸ್ ಮಹಾವಿದ್ಯಾಪೀಠದ ಪ್ರಮುಖ ಪ್ರಕಾಶನ ಮತ್ತು ಸಂಶೋಧನಾ ವಿಭಾಗವಾಗಿದೆ. ಶ್ರೀ ಸುತ್ತೂರು ಮಠದ ಪರಂಪರೆಯಲ್ಲಿ 12ನೇ ಶತಮಾನದ ವಚನ ಸಾಹಿತ್ಯ, ಶೈವಾಗಮಗಳು ಮತ್ತು ದಾರ್ಶನಿಕ ಗ್ರಂಥಗಳನ್ನು ಇದು ಪ್ರಕಟಿಸುತ್ತದೆ.',
        order: 1
      },
      {
        id: 'faq-02',
        category: 'JSS Publications',
        question: 'Where is the physical JSS Book House located in Mysuru?',
        questionKn: 'ಮೈಸೂರಿನಲ್ಲಿ ಜೆಎಸ್ಎಸ್ ಪುಸ್ತಕ ಭವನ ಎಲ್ಲಿದೆ?',
        answer: 'The physical JSS Book House retail counter is situated at JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004. It is open Monday to Saturday from 9:30 AM to 6:00 PM IST.',
        answerKn: 'ಜೆಎಸ್ಎಸ್ ಪುಸ್ತಕ ಭವನದ ಮಳಿಗೆಯು ಮೈಸೂರಿನ ಡಾ. ಶಿವರಾತ್ರಿ ರಾಜೇಂದ್ರ ವೃತ್ತದ ಜೆಎಸ್ಎಸ್ ಮಹಾವಿದ್ಯಾಪೀಠದ ಆವರಣದಲ್ಲಿದೆ.',
        order: 2
      },
      {
        id: 'faq-03',
        category: 'Shipping',
        question: 'How are books shipped to individual readers across India?',
        questionKn: 'ಭಾರತದಾದ್ಯಂತ ಓದುಗರಿಗೆ ಪುಸ್ತಕಗಳನ್ನು ಹೇಗೆ ರವಾನಿಸಲಾಗುತ್ತದೆ?',
        answer: 'All orders are dispatched directly from the Mysuru publication press and retail counter via India Post (Speed Post and Registered Book Parcel). Orders above ₹500 qualify for free postal delivery anywhere in India.',
        answerKn: 'ಎಲ್ಲಾ ಆದೇಶಗಳನ್ನು ಮೈಸೂರಿನಿಂದ ಭಾರತೀಯ ಅಂಚೆ (ಸ್ಪೀಡ್ ಪೋಸ್ಟ್/ನೋಂದಾಯಿತ ಪಾರ್ಸೆಲ್) ಮೂಲಕ ಕಳುಹಿಸಲಾಗುತ್ತದೆ. ₹500 ಮೇಲಿನ ಆದೇಶಗಳಿಗೆ ಉಚಿತ ಸಾಗಾಟವಿರುತ್ತದೆ.',
        order: 3
      },
      {
        id: 'faq-04',
        category: 'Payments',
        question: 'Are GST charges applicable on JSS publications?',
        questionKn: 'ಜೆಎಸ್ಎಸ್ ಪ್ರಕಟಣೆಗಳ ಮೇಲೆ ಜಿಎಸ್ಟಿ ತೆರಿಗೆ ಅನ್ವಯಿಸುತ್ತದೆಯೇ?',
        answer: 'Under statutory GST regulations for the Government of India (HSN Chapter 4901), printed books, journals, sacred scriptures, and classical publications are completely exempt from GST (0% CGST/SGST/IGST).',
        answerKn: 'ಕೇಂದ್ರ ಸರ್ಕಾರದ ಜಿಎಸ್ಟಿ ನಿಯಮಗಳನ್ವಯ (HSN 4901), ಮುದ್ರಿತ ಗ್ರಂಥಗಳು ಮತ್ತು ಧಾರ್ಮಿಕ ಸಾಹಿತ್ಯಕ್ಕೆ ಸಂಪೂರ್ಣ 0% ತೆರಿಗೆ ವಿನಾಯಿತಿ ಇದೆ.',
        order: 4
      },
      {
        id: 'faq-05',
        category: 'Bulk Orders',
        question: 'Can universities, colleges, and libraries place bulk procurement orders?',
        questionKn: 'ವಿಶ್ವವಿದ್ಯಾಲಯಗಳು, ಕಾಲೇಜುಗಳು ಮತ್ತು ಗ್ರಂಥಾಲಯಗಳು ಸಗಟು ಆದೇಶ ನೀಡಬಹುದೇ?',
        answer: 'Yes. JSS Publications provides institutional library procurement desks with graded institutional subsidies (10% to 20%), official proforma invoices, and direct dispatch for universities, colleges, research institutes, and public libraries.',
        answerKn: 'ಹೌದು. ಗ್ರಂಥಾಲಯಗಳು ಮತ್ತು ಶಿಕ್ಷಣ ಸಂಸ್ಥೆಗಳಿಗೆ ವಿಶೇಷ ರಿಯಾಯಿತಿ, ಪ್ರೊಫಾರ್ಮಾ ಇನ್‌ವಾಯ್ಸ್ ಮತ್ತು ನೇರ ಸಾಗಾಟ ವ್ಯವಸ್ಥೆ ಇದೆ.',
        order: 5
      },
      {
        id: 'faq-06',
        category: 'Vachana Literature',
        question: 'Are genuine editions of the 12th-century Vachanas available with commentaries?',
        questionKn: '12ನೇ ಶತಮಾನದ ವಚನಗಳ ಅಧಿಕೃತ ಆವೃತ್ತಿಗಳು ವಿವರಣೆಯೊಂದಿಗೆ ಲಭ್ಯವಿದೆಯೇ?',
        answer: 'Yes. We publish exhaustive anthologies of Basavanna, Allama Prabhu, Akkamahadevi, and hundreds of minor Sharanas with word-for-word glosses, philosophical introductions, English translations, and critical apparatus.',
        answerKn: 'ಹೌದು. ಬಸವಣ್ಣ, ಅಲ್ಲಮಪ್ರಭು, ಅಕ್ಕಮಹಾದೇವಿ ಹಾಗೂ ಇತರ ಶರಣರ ವಚನಗಳನ್ನು ಶಾಸ್ತ್ರೀಯ ವ್ಯಾಖ್ಯಾನ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಅನುವಾದದೊಂದಿಗೆ ಪ್ರಕಟಿಸಲಾಗಿದೆ.',
        order: 6
      }
    ];

    seedFaqs.forEach((f) => {
      insertFaq.run(
        f.id,
        f.category,
        f.question,
        f.questionKn,
        f.answer,
        f.answerKn,
        'published',
        'published',
        f.order,
        1500,
        now,
        now
      );
    });

    // Seed Promotional Coupons
    const insertCoupon = tx.prepare(`
      INSERT INTO coupons (
        id, code, discount_type, discount_value, min_order_amount, max_discount, usage_limit, times_used, is_active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCoupon.run('coup-01', 'BASAVA10', 'percentage', 10, 300, 100, 200, 14, 1, now);
    insertCoupon.run('coup-02', 'SUTTUR20', 'percentage', 20, 1000, 300, 50, 8, 1, now);
    insertCoupon.run('coup-03', 'SCHOLAR50', 'flat', 50, 400, 50, 100, 22, 1, now);
    insertCoupon.run('coup-04', 'VPPFREE', 'flat', 40, 200, 40, 500, 45, 1, now);

    // Seed Staff Users
    const insertStaff = tx.prepare(`
      INSERT INTO staff_users (
        id, name, email, role, password_hash, status, last_login, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // In production, passwords are encrypted. Default development password: admin@jss2026
    const devPassHash = '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyUIXe/qlsuG657t0gYswGwvWjy0M6wS';
    insertStaff.run('staff-01', 'Pavan Kumar', 'publications@jssonline.org', 'Super Admin', devPassHash, 'active', now, now, now);
    insertStaff.run('staff-02', 'Shivananda Swamy', 'catalogue@jssonline.org', 'Catalogue Manager', devPassHash, 'active', now, now, now);
    insertStaff.run('staff-03', 'Ramesh Rao', 'dispatch@jssonline.org', 'Operations Staff', devPassHash, 'active', now, now, now);

    // Seed Settings
    const insertSetting = tx.prepare(`INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)`);
    insertSetting.run('store_name', 'JSS Publications (Jagadguru Sri Shivarathreeshwara Granthamale)', now);
    insertSetting.run('store_address', 'JSS Mahavidyapeetha, Dr. Shivarathri Rajendra Circle, Mysuru, Karnataka 570004', now);
    insertSetting.run('helpline_phone', '+91 821 2548212', now);
    insertSetting.run('support_email', 'publications@jssonline.org', now);
    insertSetting.run('free_shipping_threshold', '500', now);
    insertSetting.run('base_shipping_rate', '40', now);
    insertSetting.run('gst_exemption_hsn', '4901 (0% GST Statutory)', now);
  });

  console.log('[seed] Database seeded successfully.');
}

if (process.argv.includes('--run') || process.argv.includes('--force')) {
  seedDatabase(process.argv.includes('--force'));
}
