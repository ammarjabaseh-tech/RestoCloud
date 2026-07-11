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
  console.log("🔌 Connecting to PostgreSQL for WiFi migration...");
  try {
    await client.connect();
    console.log("✅ Connected. Adding 'wifi_name' column to 'tenants' table...");

    await client.query(`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS wifi_name TEXT
    `);
    console.log("✅ Column 'wifi_name' added successfully (or already exists).");

    console.log("\n🚀 WiFi Migration Completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

migrate();
