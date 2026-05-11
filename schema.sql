-- Run once: npx wrangler d1 execute creative-solace-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  workshop_type TEXT NOT NULL,
  preferred_date TEXT,
  guests INTEGER,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  preferred_date TEXT,
  guests INTEGER,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stripe_session_id TEXT UNIQUE,
  customer_email TEXT,
  customer_name TEXT,
  amount TEXT,
  status TEXT DEFAULT 'paid',
  created_at TEXT DEFAULT (datetime('now'))
);
