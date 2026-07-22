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
      SELECT conname, contype 
      FROM pg_constraint 
      WHERE conrelid = 'tenant_users'::regclass
    `);
    console.log("Constraints:", result.rows);
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
