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
  console.log("🔌 Connecting to PostgreSQL database for is_open column migration...");
  try {
    const client = await pool.connect();
    console.log("✅ Connected successfully.");

    console.log("Adding is_open column to 'tenants' table...");
    await client.query(`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT TRUE;
    `);
    console.log("✅ 'tenants' table updated.");

    client.release();
    console.log("🎉 Database schema migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await pool.end();
  }
}

migrate();
