const { Pool } = require("pg");
require("dotenv").config();

async function run() {
  console.log("Verifying Payment and Billing configuration...");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // 1. Check database connection
    const client = await pool.connect();
    console.log("🟢 Connected to database successfully.");

    // 2. Validate tenants subscription columns
    const tenantCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tenants' 
      AND column_name IN ('subscription_plan', 'subscription_amount', 'currency');
    `);
    console.log("\n📋 Tenants billing columns:");
    tenantCols.rows.forEach(col => {
      console.log(` - ${col.column_name}: ${col.data_type}`);
    });

    // 3. Validate orders payment columns
    const orderCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      AND column_name IN ('payment_method', 'payment_status', 'total');
    `);
    console.log("\n📋 Orders payment columns:");
    orderCols.rows.forEach(col => {
      console.log(` - ${col.column_name}: ${col.data_type}`);
    });

    // 4. Check a sample tenant subscription
    const sampleTenant = await client.query(`
      SELECT id, name_ar, subscription_plan, subscription_amount, status 
      FROM tenants 
      LIMIT 1;
    `);
    if (sampleTenant.rows[0]) {
      console.log("\n🔍 Sample Tenant subscription check:");
      console.log(` - ID: ${sampleTenant.rows[0].id}`);
      console.log(` - Name: ${sampleTenant.rows[0].name_ar}`);
      console.log(` - Plan: ${sampleTenant.rows[0].subscription_plan}`);
      console.log(` - Amount: ${sampleTenant.rows[0].subscription_amount}`);
      console.log(` - Status: ${sampleTenant.rows[0].status}`);
    } else {
      console.log("\n⚠️ No tenants found in database.");
    }

    // 5. Check sample invoices
    const sampleInvoices = await client.query(`
      SELECT id, tenant_name, plan, amount, billing_period, status 
      FROM invoices 
      LIMIT 3;
    `);
    console.log("\n🔍 Sample Invoices check:");
    if (sampleInvoices.rows.length > 0) {
      sampleInvoices.rows.forEach(inv => {
        console.log(` - Inv ID: ${inv.id} | Restaurant: ${inv.tenant_name} | Plan: ${inv.plan} | Amount: ${inv.amount} | Period: ${inv.billing_period} | Status: ${inv.status}`);
      });
    } else {
      console.log(" - No invoices found in database.");
    }

    // 6. Check sample POS orders and their payment methods
    const sampleOrders = await client.query(`
      SELECT id, order_number, order_type, payment_method, payment_status, total 
      FROM orders 
      ORDER BY id DESC 
      LIMIT 3;
    `);
    console.log("\n🔍 Sample POS Orders payment check:");
    if (sampleOrders.rows.length > 0) {
      sampleOrders.rows.forEach(ord => {
        console.log(` - Order: ${ord.order_number} | Type: ${ord.order_type} | Method: ${ord.payment_method} | Status: ${ord.payment_status} | Total: ${ord.total}`);
      });
    } else {
      console.log(" - No orders found in database.");
    }

    client.release();
    console.log("\n🟢 Verification checks completed.");
  } catch (err) {
    console.error("🔴 Verification failed:", err);
  } finally {
    await pool.end();
  }
}

run();
