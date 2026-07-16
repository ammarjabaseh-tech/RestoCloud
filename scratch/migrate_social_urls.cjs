const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/restocloud';
const pool = new Pool({ connectionString });

async function run() {
  console.log("Running social media URLs migration...");
  try {
    // Add facebook_url, instagram_url, tiktok_url columns to tenants table if not exists
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
