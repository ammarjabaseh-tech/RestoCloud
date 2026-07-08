/**
 * db/setup.ts
 * سكريبت إعداد قاعدة بيانات سفرة كلاود
 * يُنشئ الجداول ويُدخل البيانات التجريبية
 * شغّله مرة واحدة: npm run db:setup
 */

import pg from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

async function setup() {
  // 1. Connect to 'postgres' default DB to create sufra_cloud if not exists
  const adminClient = new Client({
    host:     process.env.DB_HOST     || "localhost",
    port:     Number(process.env.DB_PORT) || 5432,
    user:     process.env.DB_USER     || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: "postgres", // connect to default DB first
  });

  const dbName = process.env.DB_NAME || "sufra_cloud";

  try {
    await adminClient.connect();
    console.log("🔌 Connected to PostgreSQL...");

    // Create database if it doesn't exist
    const dbCheck = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
    );
    if (dbCheck.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database '${dbName}' created.`);
    } else {
      console.log(`ℹ️  Database '${dbName}' already exists.`);
    }
  } finally {
    await adminClient.end();
  }

  // 2. Connect to the sufra_cloud DB and run schema + seed
  const appClient = new Client({
    host:     process.env.DB_HOST     || "localhost",
    port:     Number(process.env.DB_PORT) || 5432,
    user:     process.env.DB_USER     || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: dbName,
  });

  try {
    await appClient.connect();

    // Run schema.sql
    const schemaSQL = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
    await appClient.query(schemaSQL);
    console.log("✅ Schema created (tables, indexes).");

    // Run seed.sql
    const seedSQL = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf-8");
    await appClient.query(seedSQL);
    console.log("✅ Seed data inserted (tenants, menus, users).");

    console.log("\n🚀 Database setup complete! You can now run: npm run dev");
  } catch (err: any) {
    console.error("❌ Setup failed:", err.message);
    process.exit(1);
  } finally {
    await appClient.end();
  }
}

setup();
