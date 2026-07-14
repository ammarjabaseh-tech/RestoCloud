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
    console.log("Connected to RestoCloud database.");
    
    // Try to delete cat-105
    console.log("Attempting to delete cat-105...");
    const res = await client.query("DELETE FROM categories WHERE id = $1 RETURNING *", ['cat-105']);
    console.log("Deleted row count:", res.rowCount);
    console.log("Deleted row:", res.rows[0]);
  } catch (err) {
    console.error("DELETE failed with error code:", err.code);
    console.error("Error message:", err.message);
    console.error("Error detail:", err.detail);
  } finally {
    await client.end();
  }
}
run();
