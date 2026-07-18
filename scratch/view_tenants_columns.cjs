const { Client } = require("pg");
require("dotenv").config();

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'tenants'
  `);
  
  console.log("Tenants columns:");
  res.rows.forEach(row => {
    console.log(`- ${row.column_name}: ${row.data_type}`);
  });
  
  await client.end();
}

run();
