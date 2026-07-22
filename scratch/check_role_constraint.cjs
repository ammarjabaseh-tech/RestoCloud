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
    const result = await client.query(`
      SELECT pg_get_constraintdef(oid) 
      FROM pg_constraint 
      WHERE conname = 'tenant_users_role_check'
    `);
    console.log("tenant_users_role_check definition:", result.rows[0]);
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
