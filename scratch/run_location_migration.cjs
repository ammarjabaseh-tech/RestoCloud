const { Client } = require("pg");
require("dotenv").config();

async function run() {
  const client = new Client({
    host:     process.env.DB_HOST     || "localhost",
    port:     Number(process.env.DB_PORT) || 5432,
    user:     process.env.DB_USER     || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME     || "sufra_cloud",
  });
  
  try {
    await client.connect();
    console.log("Connected to PostgreSQL, altering table tenants...");
    
    // Add location_url column
    await client.query(`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS location_url TEXT;
    `);
    
    console.log("✅ Column location_url successfully added to table tenants!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

run();
