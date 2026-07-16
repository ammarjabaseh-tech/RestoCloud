const { Pool } = require('pg');
require('dotenv').config();

const config = process.env.DATABASE_URL
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    }
  : {
      host:     process.env.DB_HOST     || "localhost",
      port:     Number(process.env.DB_PORT)     || 5432,
      user:     process.env.DB_USER     || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME     || "sufra_cloud",
      ssl: false,
    };

const pool = new Pool(config);

async function run() {
  console.log("Running social media URLs migration using environment variables...");
  try {
    await pool.query(`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS tiktok_url TEXT DEFAULT '';
    `);
    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}
run();
