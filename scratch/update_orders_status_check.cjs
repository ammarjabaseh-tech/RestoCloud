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
      ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;
      ALTER TABLE orders ADD CONSTRAINT orders_order_status_check 
        CHECK (order_status IN ('pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'));
    `);
    console.log("SUCCESS: Updated 'orders_order_status_check' constraint to include 'out_for_delivery'!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();
