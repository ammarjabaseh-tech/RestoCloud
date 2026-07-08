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
  console.log("✅ PostgreSQL connected: sufra_cloud database");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err.message);
});

export default pool;
