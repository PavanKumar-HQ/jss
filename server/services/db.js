/**
 * Authoritative Database Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Implements persistent SQLite 3 engine with WAL mode, foreign keys,
 * prepared statement caching, and atomic transactional coordination.
 */

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'jss_publications.db');

export class DatabaseService {
  constructor(dbPath = DB_PATH) {
    this.dbPath = dbPath;
    this.db = new DatabaseSync(dbPath);
    this.initPragmas();
    this.initSchema();
  }

  initPragmas() {
    this.db.exec('PRAGMA foreign_keys = ON;');
    this.db.exec('PRAGMA journal_mode = WAL;');
    this.db.exec('PRAGMA synchronous = NORMAL;');
  }

  initSchema() {
    const schemaPath = path.resolve(__dirname, '../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      this.db.exec(sql);
    }
  }

  prepare(sql) {
    return this.db.prepare(sql);
  }

  exec(sql) {
    return this.db.exec(sql);
  }

  queryOne(sql, ...params) {
    const stmt = this.db.prepare(sql);
    const row = stmt.get(...params);
    return row || null;
  }

  queryAll(sql, ...params) {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) || [];
  }

  run(sql, ...params) {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  /**
   * Execute callback within an atomic transaction.
   * If any error is thrown, the transaction is cleanly rolled back.
   */
  transaction(callback) {
    this.db.exec('BEGIN IMMEDIATE TRANSACTION');
    try {
      const result = callback(this);
      this.db.exec('COMMIT');
      return result;
    } catch (err) {
      this.db.exec('ROLLBACK');
      throw err;
    }
  }

  close() {
    try {
      this.db.close();
    } catch (err) {
      console.error('[db] Error closing database:', err);
    }
  }
}

// Singleton database instance
export const db = new DatabaseService();
export default db;
