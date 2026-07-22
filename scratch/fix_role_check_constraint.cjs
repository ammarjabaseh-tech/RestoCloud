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
    console.log("Connected to PostgreSQL.");

    await client.query(`
      ALTER TABLE tenant_users DROP CONSTRAINT IF EXISTS tenant_users_role_check;
      ALTER TABLE tenant_users ADD CONSTRAINT tenant_users_role_check 
        CHECK (role IN ('owner', 'manager', 'cashier', 'waiter', 'worker', 'delivery'));
    `);
    console.log("Migration successful: Updated tenant_users_role_check to include 'delivery'.");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
