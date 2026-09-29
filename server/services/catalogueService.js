/**
 * Authoritative Server Catalogue Domain Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Manages intellectual works, editions, price modifications, and real-time broadcasting.
 */

import { db } from './db.js';
import { realtimeService } from './realtimeService.js';

export class CatalogueService {
  /**
   * Get all books with their editions and stock
   */
  getAllBooks({ category = null, status = 'published', search = null } = {}) {
    let sql = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ' AND (title LIKE ? OR title_kannada LIKE ? OR author LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY featured DESC, title ASC';

    const books = db.queryAll(sql, ...params);

    return books.map((book) => {
      const editions = db.queryAll(`
        SELECT e.*, i.available_stock, i.reserved_stock, i.sold_stock
        FROM editions e
        LEFT JOIN inventory i ON e.id = i.edition_id
        WHERE e.book_id = ?
        ORDER BY e.price ASC
      `, book.id);

      const lowestPrice = editions.length > 0 ? Math.min(...editions.map(e => e.price)) : 150;
      const totalAvailable = editions.reduce((sum, e) => sum + (e.available_stock || 0), 0);

      return {
        ...book,
        price: lowestPrice,
        availableStock: totalAvailable,
        editions
      };
    });
  }

  /**
   * Get single book by slug
   */
  getBookBySlug(slug) {
    const book = db.queryOne('SELECT * FROM books WHERE slug = ?', slug);
    if (!book) return null;

    const editions = db.queryAll(`
      SELECT e.*, i.available_stock, i.reserved_stock, i.sold_stock
      FROM editions e
      LEFT JOIN inventory i ON e.id = i.edition_id
      WHERE e.book_id = ?
      ORDER BY e.price ASC
    `, book.id);

    return {
      ...book,
      editions,
      price: editions.length > 0 ? editions[0].price : 150
    };
  }

  /**
   * Get single book by ID
   */
  getBookById(id) {
    const book = db.queryOne('SELECT * FROM books WHERE id = ?', id);
    if (!book) return null;

    const editions = db.queryAll(`
      SELECT e.*, i.available_stock, i.reserved_stock, i.sold_stock
      FROM editions e
      LEFT JOIN inventory i ON e.id = i.edition_id
      WHERE e.book_id = ?
      ORDER BY e.price ASC
    `, book.id);

    return {
      ...book,
      editions,
      price: editions.length > 0 ? editions[0].price : 150
    };
  }

  /**
   * Add a new book (Admin mutation)
   */
  addBook(data) {
    if (!data.title || !data.author) {
      throw new Error('Title and Author are required.');
    }

    return db.transaction((tx) => {
      const id = data.id || `jss-pub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const nowIso = new Date().toISOString();

      tx.run(`
        INSERT INTO books (
          id, slug, title, title_kannada, author, publisher, language, category,
          series, description, publication_year, status, cover_image, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        id, slug, data.title.trim(), data.titleKannada || data.title_kannada || '',
        data.author.trim(), data.publisher || 'JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale',
        data.language || 'Kannada', data.category || 'Vachana Literature',
        data.series || '', data.description || '', data.publicationYear || 2026,
        data.status || 'published', data.coverImage || data.cover_image || '/assets/jss-logo.webp',
        nowIso, nowIso
      );

      // Create primary Paperback edition
      const editionId = `${id}-pb`;
      const price = parseFloat(data.price) || 200;
      const initialStock = parseInt(data.stock, 10) || 30;

      tx.run(`
        INSERT INTO editions (
          id, book_id, binding, isbn, price, pages, weight_grams, is_deluxe, stock_limit, status, created_at, updated_at
        ) VALUES (?, ?, 'Paperback', ?, ?, 250, 420, 0, 10, 'published', ?, ?)
      `, editionId, id, data.isbn || `978-81-94921-${Date.now().toString().slice(-4)}-1`, price, nowIso, nowIso);

      tx.run(`
        INSERT INTO inventory (edition_id, book_id, available_stock, reserved_stock, sold_stock, damaged_stock, low_stock_threshold, updated_at)
        VALUES (?, ?, ?, 0, 0, 0, 5, ?)
      `, editionId, id, initialStock, nowIso);

      tx.run(`
        INSERT INTO inventory_ledger (id, edition_id, previous_stock, change_amount, new_stock, operation_type, reason, actor, created_at)
        VALUES (?, ?, 0, ?, ?, 'RESTOCK', 'Initial Book Creation', 'Admin', ?)
      `, `ledg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, editionId, initialStock, initialStock, nowIso);

      const newBook = this.getBookById(id);

      realtimeService.broadcast('BOOK_MUTATED', {
        action: 'CREATED',
        book: newBook
      });

      return newBook;
    });
  }

  /**
   * Update book price (Authoritative Admin Mutation)
   */
  updatePrice(bookId, binding, newPrice, reason = 'Price Revision', actor = 'Administrator') {
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      throw new Error('Valid positive price is required.');
    }

    return db.transaction((tx) => {
      const edition = tx.queryOne(`
        SELECT * FROM editions
        WHERE book_id = ? AND binding = ?
      `, bookId, binding);

      if (!edition) {
        throw new Error(`Edition for book "${bookId}" with binding "${binding}" not found.`);
      }

      const previousPrice = edition.price;
      const nowIso = new Date().toISOString();

      tx.run(`
        UPDATE editions
        SET price = ?, updated_at = ?
        WHERE id = ?
      `, priceNum, nowIso, edition.id);

      tx.run(`
        INSERT INTO audit_logs (id, actor, action, entity, entity_id, previous_value, new_value, reason, ip_address, created_at)
        VALUES (?, ?, 'UPDATE_PRICE', 'edition', ?, ?, ?, ?, null, ?)
      `, `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, actor, edition.id, String(previousPrice), String(priceNum), reason, nowIso);

      realtimeService.broadcast('PRICE_CHANGED', {
        bookId,
        editionId: edition.id,
        binding,
        previousPrice,
        newPrice: priceNum,
        reason
      });

      return {
        success: true,
        bookId,
        editionId: edition.id,
        binding,
        previousPrice,
        newPrice: priceNum
      };
    });
  }

  /**
   * Archive / Unpublish / Update Status
   */
  updateBookStatus(bookId, status, actor = 'Administrator') {
    return db.transaction((tx) => {
      const nowIso = new Date().toISOString();
      tx.run(`UPDATE books SET status = ?, updated_at = ? WHERE id = ?`, status, nowIso, bookId);

      tx.run(`
        INSERT INTO audit_logs (id, actor, action, entity, entity_id, previous_value, new_value, reason, ip_address, created_at)
        VALUES (?, ?, 'UPDATE_BOOK_STATUS', 'book', ?, null, ?, 'Status updated', null, ?)
      `, `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, actor, bookId, status, nowIso);

      realtimeService.broadcast('BOOK_MUTATED', {
        action: 'STATUS_CHANGED',
        bookId,
        status
      });

      return { success: true, bookId, status };
    });
  }
}

export const catalogueService = new CatalogueService();
export default catalogueService;
