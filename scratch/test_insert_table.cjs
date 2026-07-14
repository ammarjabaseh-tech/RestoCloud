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

    // Let's get the max table number for tenant-1
    const maxRes = await client.query("SELECT MAX(table_number) FROM restaurant_tables WHERE tenant_id = 'tenant-1'");
    const nextNum = (maxRes.rows[0].max || 0) + 1;
    console.log("Next table number will be:", nextNum);

    // Let's try inserting a table for tenant-1
    const res = await client.query(
      "INSERT INTO restaurant_tables (tenant_id, table_number, capacity, status) VALUES ($1, $2, $3, $4) RETURNING *",
      ['tenant-1', nextNum, 4, 'available']
    );
    console.log("Table inserted successfully:", res.rows[0]);

    // Let's clean it up
    await client.query("DELETE FROM restaurant_tables WHERE id = $1", [res.rows[0].id]);
    console.log("Cleanup successful.");
  } catch (err) {
    console.error("Insert failed with error code:", err.code);
    console.error("Error message:", err.message);
    console.error("Error detail:", err.detail);
  } finally {
    await client.end();
  }
}
run();
