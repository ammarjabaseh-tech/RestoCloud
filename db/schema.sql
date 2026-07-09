-- ==========================================
-- RestoCloud - PostgreSQL Schema
-- قاعدة بيانات منصة ريستو كلاود (RestoCloud) SaaS
-- ==========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. TENANTS (المطاعم / المستأجرون)
-- ==========================================
CREATE TABLE IF NOT EXISTS tenants (
  id              TEXT PRIMARY KEY DEFAULT 'tenant-' || gen_random_uuid()::TEXT,
  subdomain       TEXT UNIQUE NOT NULL,
  name_ar         TEXT NOT NULL,
  logo            TEXT NOT NULL DEFAULT '🍽️',
  theme_color     TEXT NOT NULL DEFAULT 'emerald',
  currency        TEXT NOT NULL DEFAULT 'ر.س',
  tax_rate        NUMERIC(5,2) NOT NULL DEFAULT 15,
  address         TEXT NOT NULL DEFAULT '',
  phone           TEXT NOT NULL DEFAULT '',
  owner_name      TEXT NOT NULL DEFAULT '',
  owner_email     TEXT,
  password_hash   TEXT,
  status          TEXT NOT NULL DEFAULT 'pending_approval'
                  CHECK (status IN ('active','trial','suspended','pending_payment','pending_approval')),
  slogan          TEXT,
  wifi_password   TEXT,
  banner_image    TEXT,
  subscription_plan   TEXT DEFAULT 'starter'
                      CHECK (subscription_plan IN ('starter','pro','enterprise')),
  subscription_amount NUMERIC(10,2) DEFAULT 199,
  subscription_date   DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 2. CATEGORIES (فئات المنيو)
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY DEFAULT 'cat-' || gen_random_uuid()::TEXT,
  tenant_id   TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name_ar     TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '🍽️',
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 3. MENU ITEMS (أصناف المنيو)
-- ==========================================
CREATE TABLE IF NOT EXISTS menu_items (
  id                   TEXT PRIMARY KEY DEFAULT 'item-' || gen_random_uuid()::TEXT,
  tenant_id            TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category_id          TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name_ar              TEXT NOT NULL,
  description_ar       TEXT NOT NULL DEFAULT '',
  price                NUMERIC(10,2) NOT NULL DEFAULT 0,
  cost_price           NUMERIC(10,2) NOT NULL DEFAULT 0,
  calories             INTEGER,
  image                TEXT NOT NULL DEFAULT '',
  is_available         BOOLEAN NOT NULL DEFAULT TRUE,
  is_best_seller       BOOLEAN NOT NULL DEFAULT FALSE,
  preparation_time_min INTEGER,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 4. RESTAURANT TABLES (طاولات المطعم)
-- ==========================================
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id               TEXT PRIMARY KEY DEFAULT 'tbl-' || gen_random_uuid()::TEXT,
  tenant_id        TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  table_number     INTEGER NOT NULL,
  capacity         INTEGER NOT NULL DEFAULT 4,
  status           TEXT NOT NULL DEFAULT 'available'
                   CHECK (status IN ('available','occupied','reserved','needs_cleaning')),
  current_order_id TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, table_number)
);

-- ==========================================
-- 5. ORDERS (الطلبات)
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY DEFAULT 'ord-' || gen_random_uuid()::TEXT,
  order_number     TEXT NOT NULL,
  tenant_id        TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_type       TEXT NOT NULL CHECK (order_type IN ('dine_in','takeaway','delivery')),
  table_number     INTEGER,
  customer_name    TEXT,
  customer_phone   TEXT,
  customer_address TEXT,
  subtotal         NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_amount       NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
  total            NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method   TEXT NOT NULL DEFAULT 'pending'
                   CHECK (payment_method IN ('cash','card','pending','credit')),
  payment_status   TEXT NOT NULL DEFAULT 'pending'
                   CHECK (payment_status IN ('paid','pending','refunded')),
  order_status     TEXT NOT NULL DEFAULT 'pending'
                   CHECK (order_status IN ('pending','preparing','ready','delivered','cancelled')),
  cashier_name     TEXT NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 6. ORDER ITEMS (أصناف الطلبات)
-- ==========================================
CREATE TABLE IF NOT EXISTS order_items (
  id        TEXT PRIMARY KEY DEFAULT 'oi-' || gen_random_uuid()::TEXT,
  order_id  TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id   TEXT NOT NULL,
  name_ar   TEXT NOT NULL,
  price     NUMERIC(10,2) NOT NULL,
  quantity  INTEGER NOT NULL DEFAULT 1,
  notes     TEXT
);

-- ==========================================
-- 7. TENANT USERS (موظفو المطاعم)
-- ==========================================
CREATE TABLE IF NOT EXISTS tenant_users (
  id           TEXT PRIMARY KEY DEFAULT 'user-' || gen_random_uuid()::TEXT,
  tenant_id    TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  password_hash TEXT,
  role         TEXT NOT NULL DEFAULT 'cashier'
               CHECK (role IN ('owner','manager','cashier','waiter','worker')),
  status       TEXT NOT NULL DEFAULT 'active'
               CHECK (status IN ('active','inactive')),
  avatar       TEXT,
  -- Permissions
  can_manage_pos      BOOLEAN NOT NULL DEFAULT TRUE,
  can_manage_menu     BOOLEAN NOT NULL DEFAULT FALSE,
  can_manage_users    BOOLEAN NOT NULL DEFAULT FALSE,
  can_view_reports    BOOLEAN NOT NULL DEFAULT FALSE,
  can_manage_settings BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, email)
);

-- ==========================================
-- 8. INVOICES (فواتير الاشتراك)
-- ==========================================
CREATE TABLE IF NOT EXISTS invoices (
  id             TEXT PRIMARY KEY DEFAULT 'inv-' || gen_random_uuid()::TEXT,
  invoice_number TEXT NOT NULL UNIQUE,
  tenant_id      TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  tenant_name    TEXT NOT NULL,
  plan           TEXT NOT NULL CHECK (plan IN ('starter','pro','enterprise')),
  amount         NUMERIC(10,2) NOT NULL,
  billing_period TEXT NOT NULL,
  issue_date     DATE NOT NULL,
  due_date       DATE NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('paid','pending','overdue')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 9. VERIFICATION OTPS (رموز التحقق عبر البريد الإلكتروني)
-- ==========================================
CREATE TABLE IF NOT EXISTS tenant_otps (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL,
  otp_code    TEXT NOT NULL,
  action_type TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- INDEXES (فهارس للأداء)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_categories_tenant    ON categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_tenant    ON menu_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category  ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_tables_tenant        ON restaurant_tables(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant        ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order    ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant  ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant      ON invoices(tenant_id);
