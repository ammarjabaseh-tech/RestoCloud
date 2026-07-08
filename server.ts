import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import pool from "./db/database.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ============================================================
// Helper: map DB row (snake_case) → frontend type (camelCase)
// ============================================================
function mapTenant(row: any) {
  return {
    id: row.id,
    subdomain: row.subdomain,
    nameAr: row.name_ar,
    logo: row.logo,
    themeColor: row.theme_color,
    currency: row.currency,
    taxRate: parseFloat(row.tax_rate),
    address: row.address,
    phone: row.phone,
    ownerName: row.owner_name,
    ownerEmail: row.owner_email,
    status: row.status,
    slogan: row.slogan,
    wifiPassword: row.wifi_password,
    bannerImage: row.banner_image,
    subscriptionPlan: row.subscription_plan,
    subscriptionAmount: row.subscription_amount ? parseFloat(row.subscription_amount) : undefined,
    subscriptionDate: row.subscription_date,
    createdAt: row.created_at ? row.created_at.toISOString().split("T")[0] : "",
  };
}

function mapCategory(row: any) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    nameAr: row.name_ar,
    icon: row.icon,
    orderIndex: row.order_index,
  };
}

function mapMenuItem(row: any) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    categoryId: row.category_id,
    nameAr: row.name_ar,
    descriptionAr: row.description_ar,
    price: parseFloat(row.price),
    costPrice: parseFloat(row.cost_price),
    calories: row.calories,
    image: row.image,
    isAvailable: row.is_available,
    isBestSeller: row.is_best_seller,
    preparationTimeMin: row.preparation_time_min,
  };
}

function mapTable(row: any) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    tableNumber: row.table_number,
    capacity: row.capacity,
    status: row.status,
    currentOrderId: row.current_order_id,
  };
}

function mapOrder(row: any) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    tenantId: row.tenant_id,
    orderType: row.order_type,
    tableNumber: row.table_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    items: row.items || [],
    subtotal: parseFloat(row.subtotal),
    taxAmount: parseFloat(row.tax_amount),
    discountAmount: parseFloat(row.discount_amount),
    total: parseFloat(row.total),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    cashierName: row.cashier_name,
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
      : "",
    createdAtIso: row.created_at ? new Date(row.created_at).toISOString() : "",
  };
}

function mapUser(row: any) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    status: row.status,
    avatar: row.avatar,
    permissions: {
      canManagePOS: row.can_manage_pos,
      canManageMenu: row.can_manage_menu,
      canManageUsers: row.can_manage_users,
      canViewReports: row.can_view_reports,
      canManageSettings: row.can_manage_settings,
    },
    createdAt: row.created_at ? row.created_at.toISOString().split("T")[0] : "",
  };
}

function mapInvoice(row: any) {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    tenantId: row.tenant_id,
    tenantName: row.tenant_name,
    plan: row.plan,
    amount: parseFloat(row.amount),
    billingPeriod: row.billing_period,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    status: row.status,
  };
}

// ============================================================
// TENANTS
// ============================================================
app.get("/api/tenants", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tenants ORDER BY created_at DESC");
    res.json(result.rows.map(mapTenant));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tenants", async (req, res) => {
  const { nameAr, subdomain, themeColor, logo, phone, address, ownerName, slogan, status, ownerEmail, password, subscriptionPlan, subscriptionAmount, subscriptionDate, currency } = req.body;
  try {
    const check = await pool.query("SELECT 1 FROM tenants WHERE subdomain = $1", [subdomain?.toLowerCase()]);
    if (check.rowCount && check.rowCount > 0) {
      return res.status(400).json({ error: "هذا النطاق الفرعي (Subdomain) مستخدم بالفعل لمطعم آخر" });
    }

    const id = `tenant-${Date.now()}`;
    const cleanSub = subdomain?.toLowerCase().replace(/[^a-z0-9]/g, "") || id;

    const result = await pool.query(
      `INSERT INTO tenants
        (id, subdomain, name_ar, logo, theme_color, currency, tax_rate, address, phone, owner_name,
         owner_email, password_hash, status, slogan, wifi_password, subscription_plan, subscription_amount, subscription_date)
       VALUES ($1,$2,$3,$4,$5,$6,15,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [id, cleanSub, nameAr || "مطعم جديد", logo || "🍽️", themeColor || "emerald", currency || 'ر.س',
       address || "الرياض، المملكة العربية السعودية", phone || "0500000000", ownerName || "صاحب المطعم",
       ownerEmail || "", password || "", status || "pending_approval",
       slogan || "نكهات طازجة وجودة عالية كل يوم", `${cleanSub}_wifi_2026`,
       subscriptionPlan || "starter", subscriptionAmount || 199,
       subscriptionDate || new Date().toISOString().split("T")[0]]
    );

    const newTenant = mapTenant(result.rows[0]);

    // Create default owner user for this tenant
    if (ownerEmail) {
      await pool.query(
        `INSERT INTO tenant_users
          (id, tenant_id, name, email, phone, password_hash, role, status, avatar,
           can_manage_pos, can_manage_menu, can_manage_users, can_view_reports, can_manage_settings)
         VALUES ($1,$2,$3,$4,$5,$6,'owner','active','👨‍🍳',true,true,true,true,true)`,
        [`user-${Date.now()}`, id, ownerName || "صاحب المطعم", ownerEmail.trim().toLowerCase(), phone || "0500000000", password || "123456"]
      );
    }

    // Default categories
    const cats = [
      { icon: "🍲", name: "الأطباق الرئيسية" },
      { icon: "🥗", name: "المقبلات والسلطات" },
      { icon: "🍹", name: "المشروبات والحلويات" },
    ];
    let firstCatId = "";
    for (let i = 0; i < cats.length; i++) {
      const catId = `cat-${Date.now()}-${i}`;
      await pool.query(
        "INSERT INTO categories (id, tenant_id, name_ar, icon, order_index) VALUES ($1,$2,$3,$4,$5)",
        [catId, id, cats[i].name, cats[i].icon, i + 1]
      );
      if (i === 0) firstCatId = catId;
    }

    // Default sample item
    await pool.query(
      `INSERT INTO menu_items (id, tenant_id, category_id, name_ar, description_ar, price, cost_price, image, is_available, is_best_seller)
       VALUES ($1,$2,$3,$4,$5,45,18,'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',true,true)`,
      [`item-${Date.now()}-1`, id, firstCatId, "وجبة خاصة مميزة", "طبق طازج محضّر يومياً بأفضل المكونات الطبيعية"]
    );

    // Default tables
    for (let i = 1; i <= 4; i++) {
      await pool.query(
        "INSERT INTO restaurant_tables (id, tenant_id, table_number, capacity, status) VALUES ($1,$2,$3,$4,'available')",
        [`tbl-${Date.now()}-${i}`, id, i, i === 4 ? 6 : 4]
      );
    }

    res.status(201).json(newTenant);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tenants/:id", async (req, res) => {
  const { id } = req.params;
  const fields = { ...req.body };
  
  // Extract password if provided
  const newPassword = fields.password;
  delete fields.password;

  try {
    // If password is provided, update password_hash in both tables
    if (newPassword) {
      await pool.query("UPDATE tenants SET password_hash = $2 WHERE id = $1", [id, newPassword]);
      await pool.query("UPDATE tenant_users SET password_hash = $2 WHERE tenant_id = $1 AND role = 'owner'", [id, newPassword]);
    }

    // Build dynamic SET clause
    const keys = Object.keys(fields);
    const colMap: Record<string, string> = {
      nameAr: "name_ar", themeColor: "theme_color", ownerName: "owner_name",
      ownerEmail: "owner_email", taxRate: "tax_rate", wifiPassword: "wifi_password",
      bannerImage: "banner_image", subscriptionPlan: "subscription_plan",
      subscriptionAmount: "subscription_amount", subscriptionDate: "subscription_date",
    };
    
    // Filter to keys that are either mapped or represent valid columns
    const validKeys = keys.filter(k => colMap[k] || ["logo", "phone", "address", "status", "slogan", "currency"].includes(k));
    
    let updatedTenant = null;
    if (validKeys.length > 0) {
      const setClauses = validKeys.map((k, i) => `${colMap[k] || k} = $${i + 2}`);
      const values = validKeys.map(k => fields[k]);
      
      const result = await pool.query(
        `UPDATE tenants SET ${setClauses.join(", ")} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      if (!result.rows[0]) return res.status(404).json({ error: "المطعم غير موجود" });
      updatedTenant = mapTenant(result.rows[0]);
    } else {
      const result = await pool.query("SELECT * FROM tenants WHERE id = $1", [id]);
      if (!result.rows[0]) return res.status(404).json({ error: "المطعم غير موجود" });
      updatedTenant = mapTenant(result.rows[0]);
    }

    // Sync ownerEmail and ownerName to tenant_users
    if (fields.ownerEmail) {
      await pool.query("UPDATE tenant_users SET email = $2 WHERE tenant_id = $1 AND role = 'owner'", [id, fields.ownerEmail.trim().toLowerCase()]);
    }
    if (fields.ownerName) {
      await pool.query("UPDATE tenant_users SET name = $2 WHERE tenant_id = $1 AND role = 'owner'", [id, fields.ownerName]);
    }

    res.json(updatedTenant);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tenants/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tenants WHERE id = $1", [req.params.id]);
    res.json({ success: true, message: "تم حذف المطعم بنجاح" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// AUTHENTICATION LOGIN
// ============================================================
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "يرجى إدخال البريد الإلكتروني وكلمة المرور" });
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Check Super Admin
  if (
    (cleanEmail === "admin@sufra.cloud" && password === "admin123") ||
    (cleanEmail === "sa" && password === "sa")
  ) {
    return res.json({
      isSuperAdmin: true,
      message: "تم تسجيل الدخول بنجاح كسوبر أدمن"
    });
  }

  try {
    // 2. Check Tenant Users (Staff)
    const userResult = await pool.query(
      "SELECT * FROM tenant_users WHERE LOWER(email) = $1 AND password_hash = $2",
      [cleanEmail, password]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const dbUser = userResult.rows[0];
    if (dbUser.status !== "active") {
      return res.status(403).json({ error: "حساب المستخدم هذا موقوف أو غير نشط" });
    }

    const user = mapUser(dbUser);

    // Get Tenant info
    const tenantResult = await pool.query("SELECT * FROM tenants WHERE id = $1", [user.tenantId]);
    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ error: "لم يتم العثور على المطعم المرتبط بهذا المستخدم" });
    }

    const tenant = mapTenant(tenantResult.rows[0]);

    if (tenant.status === "suspended") {
      return res.status(403).json({ error: "⚠️ هذا المطعم موقوف مؤقتاً من قبل الإدارة العامة" });
    }

    res.json({
      isSuperAdmin: false,
      user,
      tenant
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// TENANT USERS
// ============================================================
app.get("/api/tenants/:tenantId/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tenant_users WHERE tenant_id = $1 ORDER BY created_at", [req.params.tenantId]);
    res.json(result.rows.map(mapUser));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tenants/:tenantId/users", async (req, res) => {
  const { tenantId } = req.params;
  const { name, email, phone, password, role, permissions, avatar } = req.body;
  if (!name || !email) return res.status(400).json({ error: "يرجى إدخال الاسم والبريد الإلكتروني" });

  const perms = permissions || {
    canManagePOS: true,
    canManageMenu: role === "owner" || role === "manager",
    canManageUsers: role === "owner",
    canViewReports: role === "owner" || role === "manager",
    canManageSettings: role === "owner",
  };

  try {
    const result = await pool.query(
      `INSERT INTO tenant_users
        (id, tenant_id, name, email, phone, password_hash, role, status, avatar,
         can_manage_pos, can_manage_menu, can_manage_users, can_view_reports, can_manage_settings)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8,$9,$10,$11,$12,$13) RETURNING *`,
      [`user-${Date.now()}`, tenantId, name, email, phone || "", password || "123456", role || "cashier",
       avatar || (role === "owner" ? "👨‍🍳" : role === "manager" ? "👔" : role === "cashier" ? "🖥️" : "🍽️"),
       perms.canManagePOS, perms.canManageMenu, perms.canManageUsers, perms.canViewReports, perms.canManageSettings]
    );
    res.status(201).json(mapUser(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const f = req.body;
  try {
    const result = await pool.query(
      `UPDATE tenant_users SET
        name = COALESCE($2, name), role = COALESCE($3, role), status = COALESCE($4, status),
        can_manage_pos = COALESCE($5, can_manage_pos), can_manage_menu = COALESCE($6, can_manage_menu),
        can_manage_users = COALESCE($7, can_manage_users), can_view_reports = COALESCE($8, can_view_reports),
        can_manage_settings = COALESCE($9, can_manage_settings)
       WHERE id = $1 RETURNING *`,
      [id, f.name, f.role, f.status,
       f.permissions?.canManagePOS, f.permissions?.canManageMenu,
       f.permissions?.canManageUsers, f.permissions?.canViewReports, f.permissions?.canManageSettings]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "المستخدم غير موجود" });
    res.json(mapUser(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tenant_users WHERE id = $1", [req.params.id]);
    res.json({ success: true, message: "تم حذف المستخدم بنجاح" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// INVOICES
// ============================================================
app.get("/api/invoices", async (req, res) => {
  try {
    const { tenantId } = req.query;
    const result = tenantId
      ? await pool.query("SELECT * FROM invoices WHERE tenant_id = $1 ORDER BY created_at DESC", [tenantId])
      : await pool.query("SELECT * FROM invoices ORDER BY created_at DESC");
    res.json(result.rows.map(mapInvoice));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/invoices", async (req, res) => {
  const { tenantId, tenantName, plan, amount, billingPeriod, dueDate } = req.body;
  const id = `inv-${Date.now()}`;
  const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    const result = await pool.query(
      `INSERT INTO invoices (id, invoice_number, tenant_id, tenant_name, plan, amount, billing_period, issue_date, due_date, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_DATE,$8,'pending') RETURNING *`,
      [id, invoiceNumber, tenantId, tenantName, plan || "starter", amount || 199, billingPeriod || "شهري",
       dueDate || new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0]]
    );
    res.status(201).json(mapInvoice(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/invoices/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE invoices SET status = COALESCE($2, status) WHERE id = $1 RETURNING *",
      [id, status]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "الفاتورة غير موجودة" });
    res.json(mapInvoice(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// CATEGORIES
// ============================================================
app.get("/api/tenants/:tenantId/categories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE tenant_id = $1 ORDER BY order_index",
      [req.params.tenantId]
    );
    res.json(result.rows.map(mapCategory));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tenants/:tenantId/categories", async (req, res) => {
  const { tenantId } = req.params;
  const { nameAr, icon } = req.body;
  try {
    const countResult = await pool.query("SELECT COUNT(*) FROM categories WHERE tenant_id = $1", [tenantId]);
    const orderIndex = parseInt(countResult.rows[0].count) + 1;
    const result = await pool.query(
      "INSERT INTO categories (id, tenant_id, name_ar, icon, order_index) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [`cat-${Date.now()}`, tenantId, nameAr, icon || "🍴", orderIndex]
    );
    res.status(201).json(mapCategory(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// MENU ITEMS
// ============================================================
app.get("/api/tenants/:tenantId/items", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM menu_items WHERE tenant_id = $1 ORDER BY created_at",
      [req.params.tenantId]
    );
    res.json(result.rows.map(mapMenuItem));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tenants/:tenantId/items", async (req, res) => {
  const { tenantId } = req.params;
  const b = req.body;
  const id = `item-${Date.now()}`;
  try {
    const result = await pool.query(
      `INSERT INTO menu_items
        (id, tenant_id, category_id, name_ar, description_ar, price, cost_price,
         calories, image, is_available, is_best_seller, preparation_time_min)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [id, tenantId, b.categoryId, b.nameAr, b.descriptionAr || "",
       Number(b.price) || 0, Number(b.costPrice) || Math.round((Number(b.price) || 0) * 0.4),
       Number(b.calories) || null,
       b.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
       b.isAvailable !== false, b.isBestSeller === true, Number(b.preparationTimeMin) || 15]
    );
    res.status(201).json(mapMenuItem(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tenants/:tenantId/items/:id", async (req, res) => {
  const { id } = req.params;
  const b = req.body;
  try {
    const result = await pool.query(
      `UPDATE menu_items SET
        name_ar = COALESCE($2, name_ar), description_ar = COALESCE($3, description_ar),
        price = COALESCE($4, price), cost_price = COALESCE($5, cost_price),
        calories = COALESCE($6, calories), image = COALESCE($7, image),
        is_available = COALESCE($8, is_available), is_best_seller = COALESCE($9, is_best_seller),
        preparation_time_min = COALESCE($10, preparation_time_min), category_id = COALESCE($11, category_id)
       WHERE id = $1 RETURNING *`,
      [id, b.nameAr, b.descriptionAr, b.price, b.costPrice, b.calories, b.image,
       b.isAvailable, b.isBestSeller, b.preparationTimeMin, b.categoryId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "الصنف غير موجود" });
    res.json(mapMenuItem(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tenants/:tenantId/items/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM menu_items WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// TABLES
// ============================================================
app.get("/api/tenants/:tenantId/tables", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM restaurant_tables WHERE tenant_id = $1 ORDER BY table_number",
      [req.params.tenantId]
    );
    res.json(result.rows.map(mapTable));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tenants/:tenantId/tables/:id", async (req, res) => {
  const { id } = req.params;
  const b = req.body;
  try {
    const result = await pool.query(
      `UPDATE restaurant_tables SET
        status = COALESCE($2, status), current_order_id = $3, capacity = COALESCE($4, capacity)
       WHERE id = $1 RETURNING *`,
      [id, b.status, b.currentOrderId ?? null, b.capacity]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "الطاولة غير موجودة" });
    res.json(mapTable(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ORDERS
// ============================================================
app.get("/api/tenants/:tenantId/orders", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, COALESCE(
         json_agg(oi ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]'
       ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.tenant_id = $1
       GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.params.tenantId]
    );
    res.json(result.rows.map(row => ({
      ...mapOrder(row),
      items: (row.items || []).map((oi: any) => ({
        id: oi.id,
        itemId: oi.item_id,
        nameAr: oi.name_ar,
        price: parseFloat(oi.price),
        quantity: oi.quantity,
        notes: oi.notes,
      })),
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tenants/:tenantId/orders", async (req, res) => {
  const { tenantId } = req.params;
  const b = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get tenant for prefix
    const tenantResult = await client.query("SELECT subdomain FROM tenants WHERE id = $1", [tenantId]);
    const prefix = tenantResult.rows[0]?.subdomain?.substring(0, 2).toUpperCase() || "OR";
    const orderNumber = `#${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${tenantId}-${Date.now()}`;

    await client.query(
      `INSERT INTO orders
        (id, order_number, tenant_id, order_type, table_number, customer_name, customer_phone,
         customer_address, subtotal, tax_amount, discount_amount, total,
         payment_method, payment_status, order_status, cashier_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [orderId, orderNumber, tenantId, b.orderType || "dine_in",
       b.tableNumber ? Number(b.tableNumber) : null,
       b.customerName || (b.orderType === "dine_in" ? `طاولة رقم ${b.tableNumber}` : "زبون سفري"),
       b.customerPhone || null, b.customerAddress || null,
       b.subtotal || 0, b.taxAmount || 0, b.discountAmount || 0, b.total || 0,
       b.paymentMethod || "cash", b.paymentStatus || "paid",
       (b.cashierName === "طلب ذاتي (QR Menu)") ? "pending" : "preparing",
       b.cashierName || "الكاشير العام"]
    );

    // Insert order items
    const items = b.items || [];
    for (const item of items) {
      const oiId = `oi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await client.query(
        "INSERT INTO order_items (id, order_id, item_id, name_ar, price, quantity, notes) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        [oiId, orderId, item.itemId, item.nameAr, item.price, item.quantity, item.notes || null]
      );
    }

    // If dine_in, mark table as occupied
    if (b.orderType === "dine_in" && b.tableNumber) {
      await client.query(
        "UPDATE restaurant_tables SET status = 'occupied', current_order_id = $1 WHERE tenant_id = $2 AND table_number = $3",
        [orderId, tenantId, Number(b.tableNumber)]
      );
    }

    await client.query("COMMIT");

    // Return the full order
    const result = await pool.query(
      `SELECT o.*, COALESCE(
         json_agg(oi ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]'
       ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1 GROUP BY o.id`,
      [orderId]
    );
    const row = result.rows[0];
    res.status(201).json({
      ...mapOrder(row),
      items: (row.items || []).map((oi: any) => ({
        id: oi.id, itemId: oi.item_id, nameAr: oi.name_ar,
        price: parseFloat(oi.price), quantity: oi.quantity, notes: oi.notes,
      })),
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put("/api/tenants/:tenantId/orders/:id", async (req, res) => {
  const { tenantId, id } = req.params;
  const b = req.body;
  try {
    const prev = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (!prev.rows[0]) return res.status(404).json({ error: "الطلب غير موجود" });

    const result = await pool.query(
      `UPDATE orders SET
        order_status = COALESCE($2, order_status),
        payment_status = COALESCE($3, payment_status),
        payment_method = COALESCE($4, payment_method)
       WHERE id = $1 RETURNING *`,
      [id, b.orderStatus, b.paymentStatus, b.paymentMethod]
    );

    const updatedOrder = result.rows[0];

    // Free table when order delivered/cancelled
    if (updatedOrder.order_type === "dine_in" && updatedOrder.table_number &&
        (updatedOrder.order_status === "delivered" || updatedOrder.order_status === "cancelled") &&
        prev.rows[0].order_status !== "delivered" && prev.rows[0].order_status !== "cancelled") {
      await pool.query(
        "UPDATE restaurant_tables SET status = 'needs_cleaning', current_order_id = NULL WHERE tenant_id = $1 AND table_number = $2",
        [tenantId, updatedOrder.table_number]
      );
    }

    const fullResult = await pool.query(
      `SELECT o.*, COALESCE(
         json_agg(oi ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]'
       ) AS items
       FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1 GROUP BY o.id`,
      [id]
    );
    const row = fullResult.rows[0];
    res.json({
      ...mapOrder(row),
      items: (row.items || []).map((oi: any) => ({
        id: oi.id, itemId: oi.item_id, nameAr: oi.name_ar,
        price: parseFloat(oi.price), quantity: oi.quantity, notes: oi.notes,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// AI ENDPOINTS (unchanged - just reference DB for live data)
// ============================================================
app.post("/api/ai/generate-description", async (req, res) => {
  try {
    const { dishName, categoryName, restaurantStyle } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ descriptionAr: `طبق ${dishName} المحضّر بأفخر المكونات الطازجة والتوابل الخاصة، يقدم ساخناً ليرضي ذائقتكم في كل قمة.` });
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `أنت خبير تسويق في مطاعم فاخرة. اكتب وصفاً عربياً شهياً وجذاباً وقصيراً (جملتان أو ثلاث بحد أقصى 25 كلمة) للطبق التالي:
اسم الطبق: "${dishName}"
التصنيف: "${categoryName || 'طبق رئيسي'}"
طابع المطعم: "${restaurantStyle || 'مطعم عصري ومميز'}"
أعطني الوصف مباشرة بدون مقدمات أو علامات تنصيص.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    res.json({ descriptionAr: (response.text || "").trim() });
  } catch (error: any) {
    res.json({ descriptionAr: `طبق ${req.body.dishName || 'مميز'} المحضّر بعناية فائقة ونكهة غنية ترضي ذائقتكم.` });
  }
});

app.post("/api/ai/analyze-menu", async (req, res) => {
  try {
    const { tenantId } = req.body;
    const tenantResult = await pool.query("SELECT * FROM tenants WHERE id = $1", [tenantId]);
    const itemsResult = await pool.query("SELECT * FROM menu_items WHERE tenant_id = $1", [tenantId]);
    const ordersResult = await pool.query("SELECT * FROM orders WHERE tenant_id = $1", [tenantId]);

    if (!tenantResult.rows[0]) return res.status(404).json({ error: "المطعم غير موجود" });

    const tenant = mapTenant(tenantResult.rows[0]);
    const tenantItems = itemsResult.rows.map(mapMenuItem);
    const tenantOrders = ordersResult.rows.map(mapOrder);

    const totalRevenue = tenantOrders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = tenantOrders.length;
    const avgOrderValue = orderCount > 0 ? (totalRevenue / orderCount).toFixed(1) : "0";

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        insights: [
          `متوسط قيمة الفاتورة الحالي في مطعم (${tenant.nameAr}) هو ${avgOrderValue} ${tenant.currency}، وهو معدل جيد مقارنة بالمطاعم المشابهة.`,
          `الأصناف الأكثر مبيعاً تساهم بنسبة 65% من إجمالي الإيرادات.`,
          `هامش الربح التقريبي للأطباق يتراوح بين 55% و 65%، وهو ضمن النطاق الصحي.`
        ],
        suggestions: [
          { title: "إطلاق وجبة كومبو التوفير", description: "دمج الطبق الأكثر مبيعاً مع مشروب ومقبلات بخصم 10%.", estimatedProfitBoost: "+18% نمو في المبيعات اليومية" },
          { title: "تنشيط مبيعات وقت الظهيرة", description: "خصم خاص للطلبات بين 1:00 ظهراً و4:00 عصراً.", estimatedProfitBoost: "+25% زيادة في إشغال الطاولات" },
          { title: "تسويق الأصناف ذات هامش الربح المرتفع", description: "تصنيف المشروبات والحلويات كـ توصيات الشيف.", estimatedProfitBoost: "+12% زيادة في صافي الأرباح" }
        ],
        pricingAdvice: `احرص على الحفاظ على هامش ربح لا يقل عن 60% في جميع الأصناف.`
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const itemsSummary = tenantItems.map(i => `${i.nameAr}: السعر ${i.price}، التكلفة ${i.costPrice}، الأكثر مبيعاً: ${i.isBestSeller ? 'نعم' : 'لا'}`).join('\n');
    const prompt = `أنت مستشار استراتيجي متخصص في مطاعم SaaS. حلل بيانات مطعم "${tenant.nameAr}":
إجمالي الإيرادات: ${totalRevenue} ${tenant.currency} (${orderCount} طلب، متوسط الفاتورة: ${avgOrderValue}).
قائمة الطعام:\n${itemsSummary}\n
أجب بـ JSON عربي يشمل: "insights" (3 استنتاجات)، "suggestions" (3 اقتراحات بـ title/description/estimatedProfitBoost)، "pricingAdvice" (نصيحة تسعير واحدة).`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, estimatedProfitBoost: { type: Type.STRING } }, required: ["title", "description", "estimatedProfitBoost"] } },
            pricingAdvice: { type: Type.STRING }
          }, required: ["insights", "suggestions", "pricingAdvice"]
        }
      }
    });
    let rawText = (response.text || "{}").replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const fb = rawText.indexOf("{"); const lb = rawText.lastIndexOf("}");
    if (fb !== -1 && lb !== -1) rawText = rawText.substring(fb, lb + 1);
    res.json(JSON.parse(rawText));
  } catch (error: any) {
    res.json({ insights: ["تعذر التحليل حالياً."], suggestions: [], pricingAdvice: "تحقق من بيانات المطعم." });
  }
});

// PostgreSQL Export (still useful - now generates script from DB)
app.get("/api/export/postgresql", async (req, res) => {
  try {
    const tenantsRes = await pool.query("SELECT * FROM tenants");
    const sql = `-- Sufra Cloud PostgreSQL Export - ${new Date().toISOString()}\n\n` +
      tenantsRes.rows.map((t: any) =>
        `INSERT INTO tenants (id, subdomain, name_ar) VALUES ('${t.id}', '${t.subdomain}', '${t.name_ar}') ON CONFLICT (id) DO NOTHING;`
      ).join('\n');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(sql);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// VITE DEV / PRODUCTION
// ============================================================
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Sufra Cloud Multi-Tenant POS Server running on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Production Server running on port ${PORT}`);
  });
}
