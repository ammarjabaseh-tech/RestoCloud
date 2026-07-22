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
    console.log("Connected.");

    // Fetch a valid tenant ID
    const tenants = await client.query("SELECT id FROM tenants LIMIT 1");
    if (tenants.rows.length === 0) {
      console.log("No tenants found in db!");
      return;
    }
    const tenantId = tenants.rows[0].id;
    console.log("Using Tenant ID:", tenantId);

    const perms = {
      canManagePOS: true,
      canManageMenu: false,
      canManageUsers: false,
      canViewReports: false,
      canManageSettings: false,
      canAccessWaiter: true,
      canAccessDelivery: false
    };

    const result = await client.query(
      `INSERT INTO tenant_users
        (id, tenant_id, name, email, phone, password_hash, role, status, avatar,
         can_manage_pos, can_manage_menu, can_manage_users, can_view_reports, can_manage_settings, can_access_waiter, can_access_delivery)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [`user-test-${Date.now()}`, tenantId, "Test User", `test-${Date.now()}@test.com`, "123", "123456", "waiter", "🍽️",
       perms.canManagePOS, perms.canManageMenu, perms.canManageUsers, perms.canViewReports, perms.canManageSettings,
       perms.canAccessWaiter, perms.canAccessDelivery]
    );
    console.log("Success! Inserted user:", result.rows[0]);

    // Let's test the UPDATE query too!
    const updateResult = await client.query(
      `UPDATE tenant_users SET
        name = COALESCE($2, name), role = COALESCE($3, role), status = COALESCE($4, status),
        can_manage_pos = COALESCE($5, can_manage_pos), can_manage_menu = COALESCE($6, can_manage_menu),
        can_manage_users = COALESCE($7, can_manage_users), can_view_reports = COALESCE($8, can_view_reports),
        can_manage_settings = COALESCE($9, can_manage_settings),
        can_access_waiter = COALESCE($10, can_access_waiter),
        can_access_delivery = COALESCE($11, can_access_delivery)
       WHERE id = $1 RETURNING *`,
      [result.rows[0].id, "Updated Name", "waiter", "active",
       true, false, false, false, false, false, true]
    );
    console.log("Success! Updated user:", updateResult.rows[0]);

    // Let's clean it up
    await client.query("DELETE FROM tenant_users WHERE id = $1", [result.rows[0].id]);
    console.log("Cleaned up.");
  } catch (err) {
    console.error("Test failed with error:", err);
  } finally {
    await client.end();
  }
}
run();
