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
  console.log("🔌 Connecting to PostgreSQL for languages migration...");
  try {
    await client.connect();
    console.log("✅ Connected. Modifying categories and menu_items tables...");

    // Add categories columns
    await client.query(`
      ALTER TABLE categories 
      ADD COLUMN IF NOT EXISTS name_en TEXT,
      ADD COLUMN IF NOT EXISTS name_tr TEXT
    `);
    console.log("✅ Columns name_en and name_tr added to categories table.");

    // Add menu_items columns
    await client.query(`
      ALTER TABLE menu_items 
      ADD COLUMN IF NOT EXISTS name_en TEXT,
      ADD COLUMN IF NOT EXISTS name_tr TEXT,
      ADD COLUMN IF NOT EXISTS description_en TEXT,
      ADD COLUMN IF NOT EXISTS description_tr TEXT
    `);
    console.log("✅ Columns name_en, name_tr, description_en, description_tr added to menu_items table.");

    console.log("\n🚀 Languages Migration Completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

migrate();
