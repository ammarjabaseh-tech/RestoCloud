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
    // Add delivery user for tenant-1
    await client.query(`
      INSERT INTO tenant_users (id, tenant_id, name, email, role, password_hash, phone, status, can_access_delivery)
      VALUES ('user-105', 'tenant-1', 'كابتن سامر التوصيل', 'delivery@shami-food.com', 'delivery', 'delivery123', '0551234567', 'active', true)
      ON CONFLICT (id) DO UPDATE SET 
        role = 'delivery',
        password_hash = 'delivery123',
        can_access_delivery = true;
    `);

    // Add a delivery test order for tenant-1 in ready state so the driver sees it!
    await client.query(`
      INSERT INTO orders (id, tenant_id, order_number, order_type, customer_name, customer_phone, customer_address, total, payment_method, payment_status, order_status, created_at)
      VALUES (
        'ord-test-del-1',
        'tenant-1',
        '1001',
        'delivery',
        'أحمد المحمد',
        '0501112233',
        'الرياض - حي العليا - شارع التخصصي - المربع 4',
        145.00,
        'cash',
        'pending',
        'ready',
        NOW()
      ) ON CONFLICT (id) DO UPDATE SET order_status = 'ready', order_type = 'delivery';
    `);

    // Add order item for the test order
    await client.query(`
      INSERT INTO order_items (id, order_id, item_id, name_ar, price, quantity)
      VALUES ('oi-test-del-1', 'ord-test-del-1', 'item-1', 'مشاوي مشكلة فخارة', 145.00, 1)
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Successfully seeded test delivery user (delivery@shami-food.com / delivery123) and test ready delivery order!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.end();
  }
}

run();
