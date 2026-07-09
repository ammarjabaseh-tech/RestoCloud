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
  )
`).then(() => {
  console.log("🔒 Verification (tenant_otps) table initialized.");
}).catch((err) => {
  console.error("❌ Failed to initialize tenant_otps table:", err.message);
});

export default pool;
