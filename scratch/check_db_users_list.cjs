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
    const res = await client.query("SELECT id, tenant_id, name, email, role, status FROM tenant_users");
    console.log("=== All Tenant Users in Database ===");
    console.table(res.rows);
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
