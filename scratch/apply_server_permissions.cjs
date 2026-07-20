const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");

  // 1. Replace POST user endpoint query
  const postTarget = `  const perms = permissions || {
    canManagePOS: true,
    canManageMenu: role === "owner" || role === "manager",
    canManageUsers: role === "owner",
    canViewReports: role === "owner" || role === "manager",
    canManageSettings: role === "owner",
  };

  try {
    const result = await pool.query(
      \`INSERT INTO tenant_users
        (id, tenant_id, name, email, phone, password_hash, role, status, avatar,
         can_manage_pos, can_manage_menu, can_manage_users, can_view_reports, can_manage_settings)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8,$9,$10,$11,$12,$13) RETURNING *\`,
      [\`user-\${Date.now()}\`, tenantId, name, email, phone || "", password || "123456", role || "cashier",
       avatar || (role === "owner" ? "👨‍🍳" : role === "manager" ? "👔" : role === "cashier" ? "🖥️" : "🍽️"),
       perms.canManagePOS, perms.canManageMenu, perms.canManageUsers, perms.canViewReports, perms.canManageSettings]
    );`;

  const postReplacement = `  const perms = permissions || {
    canManagePOS: true,
    canManageMenu: role === "owner" || role === "manager",
    canManageUsers: role === "owner",
    canViewReports: role === "owner" || role === "manager",
    canManageSettings: role === "owner",
    canAccessWaiter: role === "waiter",
    canAccessDelivery: role === "delivery"
  };

  try {
    const result = await pool.query(
      \`INSERT INTO tenant_users
        (id, tenant_id, name, email, phone, password_hash, role, status, avatar,
         can_manage_pos, can_manage_menu, can_manage_users, can_view_reports, can_manage_settings, can_access_waiter, can_access_delivery)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *\`,
      [\`user-\${Date.now()}\`, tenantId, name, email, phone || "", password || "123456", role || "cashier",
       avatar || (role === "owner" ? "👨‍🍳" : role === "manager" ? "👔" : role === "cashier" ? "🖥️" : "🍽️"),
       perms.canManagePOS, perms.canManageMenu, perms.canManageUsers, perms.canViewReports, perms.canManageSettings,
       perms.canAccessWaiter || false, perms.canAccessDelivery || false]
    );`;

  content = content.replace(postTarget, postReplacement);

  // 2. Replace PUT user endpoint query
  const putTarget = `    const result = await pool.query(
      \`UPDATE tenant_users SET
        name = COALESCE($2, name), role = COALESCE($3, role), status = COALESCE($4, status),
        can_manage_pos = COALESCE($5, can_manage_pos), can_manage_menu = COALESCE($6, can_manage_menu),
        can_manage_users = COALESCE($7, can_manage_users), can_view_reports = COALESCE($8, can_view_reports),
        can_manage_settings = COALESCE($9, can_manage_settings)
       WHERE id = $1 RETURNING *\`,
      [id, f.name, f.role, f.status,
       f.permissions?.canManagePOS, f.permissions?.canManageMenu,
       f.permissions?.canManageUsers, f.permissions?.canViewReports, f.permissions?.canManageSettings]
    );`;

  const putReplacement = `    const result = await pool.query(
      \`UPDATE tenant_users SET
        name = COALESCE($2, name), role = COALESCE($3, role), status = COALESCE($4, status),
        can_manage_pos = COALESCE($5, can_manage_pos), can_manage_menu = COALESCE($6, can_manage_menu),
        can_manage_users = COALESCE($7, can_manage_users), can_view_reports = COALESCE($8, can_view_reports),
        can_manage_settings = COALESCE($9, can_manage_settings),
        can_access_waiter = COALESCE($10, can_access_waiter),
        can_access_delivery = COALESCE($11, can_access_delivery)
       WHERE id = $1 RETURNING *\`,
      [id, f.name, f.role, f.status,
       f.permissions?.canManagePOS, f.permissions?.canManageMenu,
       f.permissions?.canManageUsers, f.permissions?.canViewReports, f.permissions?.canManageSettings,
       f.permissions?.canAccessWaiter, f.permissions?.canAccessDelivery]
    );`;

  content = content.replace(putTarget, putReplacement);

  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully updated server.ts user endpoints with waiter and delivery permissions!");
} else {
  console.log("File not found!");
}
