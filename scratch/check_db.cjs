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
    
    const catCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'categories'
    `);
    console.log("=== Categories Columns ===");
    catCols.rows.forEach(r => console.log(`- ${r.column_name} (${r.data_type})`));
  } catch (err) {
    console.error("Query failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
