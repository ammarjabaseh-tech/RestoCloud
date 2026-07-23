import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Connection pool - supports both DATABASE_URL and individual variables
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      }
    : {
        host:     process.env.DB_HOST     || "localhost",
        port:     Number(process.env.DB_PORT)     || 5432,
        user:     process.env.DB_USER     || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME     || "sufra_cloud",
        ssl: false,
      }
);

// Test connection on startup
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected: RestoCloud database");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err.message);
});

// Auto-create tenant_otps table if it doesn't exist on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS tenant_otps (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    action_type TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    supplier_name TEXT NOT NULL,
    invoice_number TEXT,
    category TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'cash',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'cash',
    notes TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS cash_shifts (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    cashier_name TEXT NOT NULL,
    opening_cash NUMERIC(10,2) NOT NULL DEFAULT 0,
    expected_cash NUMERIC(10,2) NOT NULL DEFAULT 0,
    actual_cash NUMERIC(10,2) NOT NULL DEFAULT 0,
    difference NUMERIC(10,2) NOT NULL DEFAULT 0,
    cash_sales NUMERIC(10,2) NOT NULL DEFAULT 0,
    card_sales NUMERIC(10,2) NOT NULL DEFAULT 0,
    cash_expenses NUMERIC(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open',
    notes TEXT,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ
  );
`).then(() => {
  console.log("🔒 Verification & Accounting tables (purchases, expenses, cash_shifts) initialized.");
  
  // Migration to update plan CHECK constraints to support 'lite' plan
  return pool.query(`
    DO $$
    BEGIN
      -- Drop old constraints if they exist
      ALTER TABLE tenants DROP CONSTRAINT IF EXISTS tenants_subscription_plan_check;
      ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_plan_check;
      
      -- Add updated constraints
      ALTER TABLE tenants ADD CONSTRAINT tenants_subscription_plan_check CHECK (subscription_plan IN ('lite', 'starter', 'pro', 'enterprise'));
      ALTER TABLE invoices ADD CONSTRAINT invoices_plan_check CHECK (plan IN ('lite', 'starter', 'pro', 'enterprise'));
      
      -- Add location_url column
      ALTER TABLE tenants ADD COLUMN IF NOT EXISTS location_url TEXT;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Migration error: %', SQLERRM;
    END $$;
  `);
}).then(() => {
  console.log("🔄 Database plan CHECK constraints migrated successfully.");
}).catch((err) => {
  console.error("❌ Failed to initialize database tables or constraints:", err.message);
});

export default pool;
