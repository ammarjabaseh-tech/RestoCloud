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
    console.log("Success! Connected to RestoCloud database.");
    
    const res = await client.query("SELECT id, tenant_id, category_id, name_ar, name_en FROM menu_items LIMIT 20");
    console.log("=== Menu Items Rows ===");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("Query failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
