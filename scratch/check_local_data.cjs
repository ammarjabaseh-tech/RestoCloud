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
    
    const tenants = await client.query("SELECT id, subdomain, name_ar, owner_email FROM tenants LIMIT 5");
    console.log("=== Tenants ===");
    console.log(tenants.rows);

    const users = await client.query("SELECT id, tenant_id, name, email, role, password_hash FROM tenant_users LIMIT 5");
    console.log("=== Users ===");
    console.log(users.rows);
  } catch (err) {
    console.error("Query failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
