const { Client } = require("pg");

async function run() {
  const client = new Client({
    user: "ammarjabaseh",
    host: "localhost",
    database: "RestoCloud",
    password: "Aa0949920306#",
    port: 5432
  });

  try {
    await client.connect();
    console.log("Connected to database RestoCloud.");
    
    // Add delivery_driver_name column to orders table
    await client.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_driver_name text;
    `);
    console.log("Migration successful: Added delivery_driver_name to orders table.");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
