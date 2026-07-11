const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new pg.Client({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'RestoCloud',
});

async function run() {
  await client.connect();
  console.log("Tenants:");
  const tenants = await client.query("SELECT id, subdomain, name_ar FROM tenants");
  console.log(tenants.rows);

  console.log("\nCategories:");
  const cats = await client.query("SELECT id, tenant_id, name_ar, order_index FROM categories");
  console.log(cats.rows);

  console.log("\nMenu Items:");
  const items = await client.query("SELECT id, tenant_id, category_id, name_ar, is_available FROM menu_items");
  console.log(items.rows);

  await client.end();
}
run();
