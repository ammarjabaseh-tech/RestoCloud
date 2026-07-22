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
    console.log("Connected to database...");
    await client.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_driver_name VARCHAR(255);
    `);
    console.log("SUCCESS: Added 'delivery_driver_name' column to 'orders' table!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();
