const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new pg.Client({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'RestoCloud',
});

async function migrate() {
  console.log("🔌 Connecting to PostgreSQL for migration...");
  try {
    await client.connect();
    console.log("✅ Connected. Running migrations...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS printers (
        id                  TEXT PRIMARY KEY DEFAULT 'prt-' || gen_random_uuid()::TEXT,
        tenant_id           TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name                TEXT NOT NULL,
        connection_type     TEXT NOT NULL CHECK (connection_type IN ('network', 'usb', 'bluetooth')),
        ip_address          TEXT,
        port                INTEGER DEFAULT 9100,
        paper_size          TEXT NOT NULL DEFAULT '80mm' CHECK (paper_size IN ('80mm', '58mm')),
        printer_role        TEXT NOT NULL DEFAULT 'receipt' CHECK (printer_role IN ('receipt', 'kitchen', 'bar', 'general')),
        is_active           BOOLEAN NOT NULL DEFAULT TRUE,
        created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("✅ Table 'printers' created successfully.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS printer_categories (
        printer_id          TEXT NOT NULL REFERENCES printers(id) ON DELETE CASCADE,
        category_id         TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (printer_id, category_id)
      )
    `);
    console.log("✅ Table 'printer_categories' created successfully.");

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_printers_tenant ON printers(tenant_id)
    `);
    console.log("✅ Index idx_printers_tenant created successfully.");

    console.log("\n🚀 Migration Completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

migrate();
