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
    
    // Add columns to tenant_users
    await client.query(`
      ALTER TABLE tenant_users ADD COLUMN IF NOT EXISTS can_access_waiter boolean DEFAULT false;
      ALTER TABLE tenant_users ADD COLUMN IF NOT EXISTS can_access_delivery boolean DEFAULT false;
    `);
    console.log("Migration successful: Added can_access_waiter and can_access_delivery columns to tenant_users table.");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
