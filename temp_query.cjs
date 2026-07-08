const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/sufra_cloud"
});

async function run() {
  try {
    const res = await pool.query("SELECT id, order_number, cashier_name, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT 5");
    console.log("Last 5 orders in DB:");
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
