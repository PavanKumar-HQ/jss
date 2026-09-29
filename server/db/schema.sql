-- JSS Publications Relational Database Schema
-- Standard SQL compatible with SQLite 3 (WAL mode) and PostgreSQL

PRAGMA foreign_keys = ON;

-- 1. BOOKS (Intellectual Work)
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_kannada TEXT,
  author TEXT NOT NULL,
  author_kannada TEXT,
  translators TEXT,
  editors TEXT,
  publisher TEXT DEFAULT 'JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale',
  language TEXT DEFAULT 'Kannada',
  category TEXT NOT NULL,
  series TEXT,
  description TEXT,
  description_kannada TEXT,
  publication_year INTEGER,
  status TEXT CHECK(status IN ('draft', 'published', 'unlisted', 'archived')) DEFAULT 'published',
  featured INTEGER DEFAULT 0,
  cover_image TEXT,
  sample_pdf_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_books_slug ON books(slug);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);

-- 2. EDITIONS (Physical Format Variants)
CREATE TABLE IF NOT EXISTS editions (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  binding TEXT NOT NULL CHECK(binding IN ('Paperback', 'Hardbound', 'Collector Deluxe Edition (ವಿಶೇಷ ಸಂಪುಟ)')),
  isbn TEXT,
  isbn_10 TEXT,
  price REAL NOT NULL CHECK(price >= 0),
  pages INTEGER,
  weight_grams INTEGER DEFAULT 450,
  dimensions TEXT,
  is_deluxe INTEGER DEFAULT 0,
  stock_limit INTEGER DEFAULT 5,
  status TEXT DEFAULT 'published',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(book_id, binding)
);

CREATE INDEX IF NOT EXISTS idx_editions_book_id ON editions(book_id);
CREATE INDEX IF NOT EXISTS idx_editions_isbn ON editions(isbn);

-- 3. INVENTORY (Authoritative Physical Stock Ledger)
CREATE TABLE IF NOT EXISTS inventory (
  edition_id TEXT PRIMARY KEY REFERENCES editions(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  available_stock INTEGER NOT NULL DEFAULT 0 CHECK(available_stock >= 0),
  reserved_stock INTEGER NOT NULL DEFAULT 0 CHECK(reserved_stock >= 0),
  sold_stock INTEGER NOT NULL DEFAULT 0 CHECK(sold_stock >= 0),
  damaged_stock INTEGER NOT NULL DEFAULT 0 CHECK(damaged_stock >= 0),
  low_stock_threshold INTEGER DEFAULT 5,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inventory_book_id ON inventory(book_id);

-- 4. INVENTORY LEDGER (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS inventory_ledger (
  id TEXT PRIMARY KEY,
  edition_id TEXT NOT NULL REFERENCES editions(id),
  previous_stock INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  operation_type TEXT NOT NULL CHECK(operation_type IN ('RESTOCK', 'RESERVE', 'RELEASE_RESERVATION', 'SALE_CONFIRMED', 'RETURN', 'DAMAGE', 'MANUAL_ADJUSTMENT')),
  reason TEXT NOT NULL,
  reference_id TEXT,
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ledger_edition_id ON inventory_ledger(edition_id);
CREATE INDEX IF NOT EXISTS idx_ledger_created_at ON inventory_ledger(created_at);

-- 5. STOCK RESERVATIONS (Checkout Holds with TTL)
CREATE TABLE IF NOT EXISTS stock_reservations (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  edition_id TEXT NOT NULL REFERENCES editions(id),
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'CONFIRMED', 'EXPIRED', 'RELEASED')) DEFAULT 'ACTIVE',
  reserved_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reservations_session_id ON stock_reservations(session_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON stock_reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON stock_reservations(expires_at);

-- 6. COUPONS (Promotions & Cultural Discounts)
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK(discount_type IN ('percentage', 'flat')) NOT NULL,
  discount_value REAL NOT NULL CHECK(discount_value > 0),
  min_order_amount REAL DEFAULT 0,
  max_discount REAL,
  usage_limit INTEGER DEFAULT 100,
  times_used INTEGER DEFAULT 0,
  start_date TEXT,
  expires_at TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 7. ORDERS (Authoritative Customer Purchases)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  organization TEXT,
  address_line TEXT NOT NULL,
  landmark TEXT,
  city TEXT NOT NULL,
  district TEXT,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  dispatch_method TEXT NOT NULL,
  tracking_number TEXT,
  status TEXT NOT NULL CHECK(status IN ('pending_payment', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded')) DEFAULT 'confirmed',
  payment_status TEXT NOT NULL CHECK(payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  subtotal REAL NOT NULL,
  discount REAL DEFAULT 0,
  shipping_fee REAL DEFAULT 0,
  grand_total REAL NOT NULL,
  gst_rate TEXT DEFAULT '0%',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 8. ORDER ITEMS (Snapshot Purchased Items)
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES books(id),
  edition_id TEXT NOT NULL REFERENCES editions(id),
  title TEXT NOT NULL,
  binding TEXT NOT NULL,
  isbn TEXT,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  total REAL NOT NULL,
  hsn_code TEXT DEFAULT '4901'
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 9. ORDER EVENTS (Timeline Audit Log)
CREATE TABLE IF NOT EXISTS order_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events(order_id);

-- 10. BULK ENQUIRIES (Institutional Procurement)
CREATE TABLE IF NOT EXISTS bulk_enquiries (
  id TEXT PRIMARY KEY,
  institution_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  designation TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  estimated_copies INTEGER,
  estimated_budget REAL,
  requirement_details TEXT NOT NULL,
  status TEXT CHECK(status IN ('new', 'under_review', 'quote_sent', 'approved', 'rejected', 'fulfilled')) DEFAULT 'new',
  quoted_discount REAL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bulk_enquiries_status ON bulk_enquiries(status);

-- 11. FAQS (Bilingual CMS)
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  question_kn TEXT,
  answer TEXT NOT NULL,
  answer_kn TEXT,
  status TEXT CHECK(status IN ('draft', 'published', 'unlisted', 'archived')) DEFAULT 'published',
  translation_status TEXT CHECK(translation_status IN ('published', 'draft', 'reviewed', 'outdated')) DEFAULT 'published',
  display_order INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);

-- 12. PERIODICALS (Suttur Vani & Sharana Sandesha)
CREATE TABLE IF NOT EXISTS periodicals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_kn TEXT,
  category TEXT NOT NULL,
  issue_number TEXT NOT NULL,
  month_year TEXT NOT NULL,
  price REAL DEFAULT 25,
  status TEXT CHECK(status IN ('published', 'draft', 'archived')) DEFAULT 'published',
  cover_url TEXT,
  pdf_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 13. STAFF USERS (Internal Admin Accounts)
CREATE TABLE IF NOT EXISTS staff_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Super Admin', 'Administrator', 'Operations Staff', 'Catalogue Manager', 'Order/Support Staff')),
  password_hash TEXT NOT NULL,
  status TEXT CHECK(status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  last_login TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_email ON staff_users(email);

-- 14. SUPPORT TICKETS (Scholar Desk)
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  scholar_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  priority TEXT CHECK(priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  assigned_to TEXT,
  replies TEXT DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 15. AUDIT LOGS (Immutable Operational Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  previous_value TEXT,
  new_value TEXT,
  reason TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 16. SETTINGS (Store Counter & General Configurations)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
