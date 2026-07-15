const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const { Pool } = pg;

const pool = new Pool(
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

async function migrate() {
  console.log("🔌 Connecting to PostgreSQL database for language columns migration...");
  try {
    const client = await pool.connect();
    console.log("✅ Connected successfully.");

    console.log("Adding name_en and name_tr columns to 'categories' table...");
    await client.query(`
      ALTER TABLE categories 
      ADD COLUMN IF NOT EXISTS name_en TEXT,
      ADD COLUMN IF NOT EXISTS name_tr TEXT;
    `);
    console.log("✅ 'categories' table updated.");

    console.log("Adding name_en, name_tr, description_en, description_tr columns to 'menu_items' table...");
    await client.query(`
      ALTER TABLE menu_items 
      ADD COLUMN IF NOT EXISTS name_en TEXT,
      ADD COLUMN IF NOT EXISTS name_tr TEXT,
      ADD COLUMN IF NOT EXISTS description_en TEXT,
      ADD COLUMN IF NOT EXISTS description_tr TEXT;
    `);
    console.log("✅ 'menu_items' table updated.");

    client.release();
    console.log("🎉 Database schema migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await pool.end();
  }
}

migrate();
