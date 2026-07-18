import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import pool from "./db/database.js";
import nodemailer from "nodemailer";

dotenv.config();

// Mail Transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

async function sendOTPEmail(email: string, otp: string, actionType: "signup" | "login") {
  const cleanEmail = email.trim().toLowerCase();
  const subject = actionType === "signup" 
    ? "رمز التحقق لإنشاء حسابك في ريستو كلاود (RestoCloud) 🔑" 
    : "رمز التحقق لتسجيل الدخول في ريستو كلاود (RestoCloud) 🔑";
  
  const title = actionType === "signup" ? "إنشاء حساب جديد" : "تسجيل الدخول السريع";
  const desc = actionType === "signup" 
    ? "شكراً لتسجيلك في منصة ريستو كلاود (RestoCloud). يرجى استخدام رمز التحقق أدناه لتفعيل حسابك وإكمال التسجيل:"
    : "تم طلب رمز دخول سريع لحسابك في ريستو كلاود (RestoCloud). يرجى استخدام الرمز التالي لتسجيل الدخول إلى لوحتك:";

  const htmlContent = `
    <div dir="rtl" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 40px;">🍽️</span>
        <h1 style="color: #4f46e5; margin: 10px 0 0 0; font-size: 24px; font-weight: 800;">ريستو كلاود (RestoCloud) (RestoCloud)</h1>
      </div>
      <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;">
      <h2 style="color: #2d3748; font-size: 18px; font-weight: 700; margin-bottom: 10px;">${title}</h2>
      <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">${desc}</p>
      <div style="background-color: #f7fafc; border: 1px dashed #cbd5e0; border-radius: 12px; padding: 15px; text-align: center; margin-bottom: 25px;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #4f46e5; font-family: monospace;">${otp}</span>
        <p style="color: #a0aec0; font-size: 11px; margin: 5px 0 0 0;">(الرمز صالح لمدة 10 دقائق فقط)</p>
      </div>
      <p style="color: #718096; font-size: 12px; line-height: 1.5;">إذا لم تقم بطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.</p>
      <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;">
      <div style="text-align: center; color: #a0aec0; font-size: 11px;">
        ريستو كلاود (RestoCloud) — نظام مبيعات وإدارة المطاعم SaaS السحابي المتكامل.
      </div>
    </div>
  `;

  const fromMail = process.env.SMTP_FROM || '"RestoCloud" <noreply@restocloud.app>';

  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn(`⚠️ Warning: SMTP_USER/PASS not configured. Simulated OTP for ${cleanEmail}: [ ${otp} ]`);
      return false;
    }
    await transporter.sendMail({
      from: fromMail,
      to: cleanEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log(`✉️ OTP email sent successfully to ${cleanEmail}`);
    return true;
  } catch (err: any) {
    console.error(`❌ Failed to send OTP email to ${cleanEmail}:`, err.message);
    return false;
  }
}

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
    wifiName: row.wifi_name,
    bannerImage: row.banner_image,
    subscriptionPlan: row.subscription_plan,
    subscriptionAmount: row.subscription_amount ? parseFloat(row.subscription_amount) : undefined,
    subscriptionDate: row.subscription_date,
    isOpen: row.is_open !== false,
    facebookUrl: row.facebook_url || "",
    instagramUrl: row.instagram_url || "",
    tiktokUrl: row.tiktok_url || "",
    locationUrl: row.location_url || "",
    createdAt: row.created_at ? row.created_at.toISOString().split("T")[0] : "",
  };
}

function mapCategory(row: any) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    nameTr: row.name_tr,
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
    nameEn: row.name_en,
    nameTr: row.name_tr,
    descriptionAr: row.description_ar,
    descriptionEn: row.description_en,
    descriptionTr: row.description_tr,
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

function mapPrinter(row: any, categories?: string[]) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    name: row.name,
    connectionType: row.connection_type,
    ipAddress: row.ip_address,
    port: row.port,
    paperSize: row.paper_size,
    printerRole: row.printer_role,
    isActive: row.is_active,
    assignedCategories: categories || [],
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
async function checkAndUpdateSubscriptions() {
  try {
    // 1. Suspend trials that have expired (> 14 days since created_at)
    await pool.query(
      `UPDATE tenants 
       SET status = 'suspended' 
       WHERE status = 'trial' AND created_at < NOW() - INTERVAL '14 days'`
    );

    // 2. Suspend active subscriptions that have expired (> 30 days since subscription_date)
    await pool.query(
      `UPDATE tenants 
       SET status = 'suspended' 
       WHERE status = 'active' AND subscription_date < CURRENT_DATE - INTERVAL '30 days'`
    );
  } catch (err: any) {
    console.error("[Auto-Billing Error]:", err.message);
  }
}

app.get("/api/tenants", async (req, res) => {
  try {
    await checkAndUpdateSubscriptions();
    const result = await pool.query("SELECT * FROM tenants ORDER BY created_at DESC");
    res.json(result.rows.map(mapTenant));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tenants", async (req, res) => {
  const { nameAr, subdomain, themeColor, logo, phone, address, ownerName, slogan, status, ownerEmail, password, subscriptionPlan, subscriptionAmount, subscriptionDate, currency, otpCode, bypassOTP } = req.body;
  try {
    const cleanEmail = ownerEmail?.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "البريد الإلكتروني لمالك المطعم غير صحيح أو غير متوفر" });
    }

    // Verify OTP unless explicitly bypassed (e.g., direct admin creation or portal payment checkout)
    if (!bypassOTP) {
      if (!otpCode) {
        return res.status(400).json({ error: "يرجى إدخال رمز التحقق (OTP) لإكمال عملية التسجيل" });
      }

      const otpCheck = await pool.query(
        `SELECT * FROM tenant_otps 
         WHERE LOWER(email) = $1 AND otp_code = $2 AND action_type = 'signup' AND expires_at > NOW()`,
        [cleanEmail, otpCode]
      );

      if (otpCheck.rowCount === 0) {
        return res.status(400).json({ error: "رمز التحقق من البريد الإلكتروني غير صحيح أو منتهي الصلاحية" });
      }

      // Delete verified OTP
      await pool.query("DELETE FROM tenant_otps WHERE id = $1", [otpCheck.rows[0].id]);
    }

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
       ownerEmail || "", password || "", status || "trial",
       slogan || "نكهات طازجة وجودة عالية كل يوم", `${cleanSub}_wifi_2026`,
       subscriptionPlan || "starter", subscriptionAmount || 299,
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
      { icon: "🍲", nameAr: "الأطباق الرئيسية", nameEn: "Main Dishes", nameTr: "Ana Yemekler" },
      { icon: "🥗", nameAr: "المقبلات والسلطات", nameEn: "Appetizers & Salads", nameTr: "Mezeler & Salatalar" },
      { icon: "🍹", nameAr: "المشروبات والحلويات", nameEn: "Beverages & Desserts", nameTr: "İçecekler & Tatlılar" },
    ];
    let firstCatId = "";
    for (let i = 0; i < cats.length; i++) {
      const catId = `cat-${Date.now()}-${i}`;
      await pool.query(
        "INSERT INTO categories (id, tenant_id, name_ar, name_en, name_tr, icon, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        [catId, id, cats[i].nameAr, cats[i].nameEn, cats[i].nameTr, cats[i].icon, i + 1]
      );
      if (i === 0) firstCatId = catId;
    }

    // Default sample item
    await pool.query(
      `INSERT INTO menu_items (id, tenant_id, category_id, name_ar, name_en, name_tr, description_ar, description_en, description_tr, price, cost_price, image, is_available, is_best_seller)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,45,18,'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',true,true)`,
      [`item-${Date.now()}-1`, id, firstCatId, "وجبة خاصة مميزة", "Special Signature Meal", "Özel Karışık Menü", "طبق طازج محضّر يومياً بأفضل المكونات الطبيعية", "Freshly prepared daily with the finest natural ingredients", "En taze doğal malzemelerle günlük olarak hazırlanmış özel lezzet"]
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
      wifiName: "wifi_name",
      bannerImage: "banner_image", subscriptionPlan: "subscription_plan",
      subscriptionAmount: "subscription_amount", subscriptionDate: "subscription_date",
      isOpen: "is_open",
      facebookUrl: "facebook_url",
      instagramUrl: "instagram_url",
      tiktokUrl: "tiktok_url",
      locationUrl: "location_url",
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
// EMAIL OTP AUTHENTICATION
// ============================================================
app.post("/api/auth/send-otp", async (req, res) => {
  const { email, actionType } = req.body;
  if (!email || !actionType) {
    return res.status(400).json({ error: "يرجى إدخال البريد الإلكتروني ونوع العملية" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: "البريد الإلكتروني المدخل غير صحيح" });
  }

  try {
    if (actionType === "signup") {
      const check = await pool.query(
        "SELECT 1 FROM tenant_users WHERE LOWER(email) = $1 UNION SELECT 1 FROM tenants WHERE LOWER(owner_email) = $2",
        [cleanEmail, cleanEmail]
      );
      if (check.rowCount && check.rowCount > 0) {
        return res.status(400).json({ error: "البريد الإلكتروني هذا مسجل بالفعل في النظام" });
      }
    } else if (actionType === "login") {
      const check = await pool.query(
        "SELECT 1 FROM tenant_users WHERE LOWER(email) = $1",
        [cleanEmail]
      );
      if (check.rowCount === 0) {
        return res.status(400).json({ error: "البريد الإلكتروني هذا غير مسجل في النظام" });
      }
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      "DELETE FROM tenant_otps WHERE LOWER(email) = $1 AND action_type = $2",
      [cleanEmail, actionType]
    );

    await pool.query(
      "INSERT INTO tenant_otps (email, otp_code, action_type, expires_at) VALUES ($1, $2, $3, $4)",
      [cleanEmail, otpCode, actionType, expiresAt]
    );

    const emailSent = await sendOTPEmail(cleanEmail, otpCode, actionType);

    res.json({
      success: true,
      simulated: !emailSent,
      message: emailSent 
        ? "تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح" 
        : `[محاكاة] تم توليد رمز التحقق: ${otpCode} (يرجى ضبط إعدادات SMTP على السيرفر لتفعيل الإرسال الفعلي)`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login-otp", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "يرجى إدخال البريد الإلكتروني ورمز التحقق" });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    await checkAndUpdateSubscriptions();
    const otpResult = await pool.query(
      `SELECT * FROM tenant_otps 
       WHERE LOWER(email) = $1 AND otp_code = $2 AND action_type = 'login' AND expires_at > NOW()`,
      [cleanEmail, code]
    );

    if (otpResult.rowCount === 0) {
      return res.status(400).json({ error: "رمز التحقق غير صحيح أو منتهي الصلاحية" });
    }

    await pool.query("DELETE FROM tenant_otps WHERE id = $1", [otpResult.rows[0].id]);

    const userResult = await pool.query(
      "SELECT * FROM tenant_users WHERE LOWER(email) = $1",
      [cleanEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "البريد الإلكتروني غير مرتبط بأي موظف مسجل" });
    }

    const dbUser = userResult.rows[0];
    if (dbUser.status !== "active") {
      return res.status(403).json({ error: "حساب المستخدم هذا موقوف أو غير نشط" });
    }

    const user = mapUser(dbUser);
    const tenantResult = await pool.query("SELECT * FROM tenants WHERE id = $1", [user.tenantId]);
    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ error: "لم يتم العثور على المطعم المرتبط بهذا المستخدم" });
    }

    const tenant = mapTenant(tenantResult.rows[0]);
    if (tenant.status === "suspended") {
      return res.status(403).json({ error: "⚠️ هذا المطعم موقوف مؤقتاً من قبل الإدارة العامة" });
    }
    if (tenant.status === "pending_approval") {
      return res.status(403).json({ error: "⚠️ حساب مطعمك قيد المراجعة وبانتظار موافقة الإدارة العامة" });
    }
    if (tenant.status === "pending_payment") {
      return res.status(403).json({ error: "⚠️ يرجى سداد فاتورة الاشتراك لتفعيل حسابك" });
    }

    res.json({
      isSuperAdmin: false,
      user,
      tenant,
      message: "تم تسجيل الدخول بنجاح"
    });
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
  const saEmail = (process.env.SUPER_ADMIN_EMAIL || "admin@restocloud.app").trim().toLowerCase();
  const saPass = process.env.SUPER_ADMIN_PASSWORD || "admin123";

  if (
    (cleanEmail === saEmail && password === saPass) ||
    (cleanEmail === "sa" && password === "sa" && saEmail === "admin@restocloud.app" && saPass === "admin123")
  ) {
    return res.json({
      isSuperAdmin: true,
      message: "تم تسجيل الدخول بنجاح كسوبر أدمن"
    });
  }

  try {
    await checkAndUpdateSubscriptions();
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
    if (tenant.status === "pending_approval") {
      return res.status(403).json({ error: "⚠️ حساب مطعمك قيد المراجعة وبانتظار موافقة الإدارة العامة" });
    }
    if (tenant.status === "pending_payment") {
      return res.status(403).json({ error: "⚠️ يرجى سداد فاتورة الاشتراك لتفعيل حسابك" });
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
      [id, invoiceNumber, tenantId, tenantName, plan || "starter", amount || 299, billingPeriod || "سنوي",
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

    // If marked as paid, activate the corresponding tenant and set the active subscription plan
    if (status === "paid") {
      const inv = result.rows[0];
      await pool.query(
        `UPDATE tenants SET 
          status = 'active', 
          subscription_plan = $2, 
          subscription_amount = $3, 
          subscription_date = CURRENT_DATE 
         WHERE id = $1`,
        [inv.tenant_id, inv.plan, inv.amount]
      );
    }

    res.json(mapInvoice(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// PRINTERS MANAGEMENT & SILENT PRINTING
// ============================================================
function sendEscPosToNetworkPrinter(ip: string, port: number, data: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = new (require('net').Socket)();
    socket.setTimeout(4000); // 4 seconds timeout

    socket.connect(port, ip, () => {
      socket.write(data);
      socket.end();
      resolve();
    });

    socket.on('error', (err: any) => {
      socket.destroy();
      reject(err);
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('اتصال الشبكة بالطابعة انتهت مهلته (قد تكون الطابعة غير متصلة)'));
    });
  });
}

// 1. Get printers list
app.get("/api/tenants/:tenantId/printers", async (req, res) => {
  try {
    const { tenantId } = req.params;
    const result = await pool.query(
      `SELECT p.*, COALESCE(
         json_agg(pc.category_id) FILTER (WHERE pc.category_id IS NOT NULL), '[]'
       ) AS assigned_categories
       FROM printers p
       LEFT JOIN printer_categories pc ON pc.printer_id = p.id
       WHERE p.tenant_id = $1
       GROUP BY p.id ORDER BY p.created_at`,
      [tenantId]
    );
    res.json(result.rows.map(row => mapPrinter(row, row.assigned_categories)));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add printer
app.post("/api/tenants/:tenantId/printers", async (req, res) => {
  const { tenantId } = req.params;
  const { name, connectionType, ipAddress, port, paperSize, printerRole, isActive, assignedCategories } = req.body;
  
  if (!name || !connectionType) {
    return res.status(400).json({ error: "اسم الطابعة ونوع الاتصال مطلوبان" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    const printerId = `prt-${Date.now()}`;
    const result = await client.query(
      `INSERT INTO printers (id, tenant_id, name, connection_type, ip_address, port, paper_size, printer_role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [printerId, tenantId, name, connectionType, ipAddress || null, port ? Number(port) : 9100, paperSize || '80mm', printerRole || 'receipt', isActive !== false]
    );

    const categories = assignedCategories || [];
    for (const catId of categories) {
      await client.query(
        "INSERT INTO printer_categories (printer_id, category_id) VALUES ($1, $2)",
        [printerId, catId]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(mapPrinter(result.rows[0], categories));
  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// 3. Edit printer
app.put("/api/tenants/:tenantId/printers/:id", async (req, res) => {
  const { tenantId, id } = req.params;
  const { name, connectionType, ipAddress, port, paperSize, printerRole, isActive, assignedCategories } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE printers SET
        name = COALESCE($2, name),
        connection_type = COALESCE($3, connection_type),
        ip_address = $4,
        port = COALESCE($5, port),
        paper_size = COALESCE($6, paper_size),
        printer_role = COALESCE($7, printer_role),
        is_active = COALESCE($8, is_active)
       WHERE id = $1 AND tenant_id = $9 RETURNING *`,
      [id, name, connectionType, ipAddress || null, port ? Number(port) : 9100, paperSize || '80mm', printerRole || 'receipt', isActive, tenantId]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "الطابعة غير موجودة" });
    }

    if (assignedCategories) {
      await client.query("DELETE FROM printer_categories WHERE printer_id = $1", [id]);
      for (const catId of assignedCategories) {
        await client.query(
          "INSERT INTO printer_categories (printer_id, category_id) VALUES ($1, $2)",
          [id, catId]
        );
      }
    }

    await client.query("COMMIT");
    res.json(mapPrinter(result.rows[0], assignedCategories));
  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// 4. Delete printer
app.delete("/api/tenants/:tenantId/printers/:id", async (req, res) => {
  try {
    const { tenantId, id } = req.params;
    const result = await pool.query(
      "DELETE FROM printers WHERE id = $1 AND tenant_id = $2 RETURNING *",
      [id, tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "الطابعة غير موجودة" });
    }
    res.json({ success: true, message: "تم حذف الطابعة بنجاح" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Test print to network printer
app.post("/api/tenants/:tenantId/printers/:id/print-test", async (req, res) => {
  try {
    const { tenantId, id } = req.params;
    const printerResult = await pool.query("SELECT * FROM printers WHERE id = $1 AND tenant_id = $2", [id, tenantId]);
    
    if (printerResult.rows.length === 0) {
      return res.status(404).json({ error: "الطابعة غير موجودة" });
    }
    
    const p = printerResult.rows[0];
    if (p.connection_type !== 'network' || !p.ip_address) {
      return res.status(400).json({ error: "هذه الطابعة ليست طابعة شبكة (Network IP)" });
    }

    // ESC/POS test commands
    const init = Buffer.from([0x1B, 0x40]);
    const center = Buffer.from([0x1B, 0x61, 0x01]);
    const bigFont = Buffer.from([0x1D, 0x21, 0x11]);
    const normalFont = Buffer.from([0x1D, 0x21, 0x00]);
    const feedAndCut = Buffer.from([0x1B, 0x64, 0x04, 0x1D, 0x56, 0x42, 0x00]);

    const title = "RestoCloud\n";
    const line = "------------------------\n";
    const body = "Test Print Success!\n" +
                 `Printer: ${p.name}\n` +
                 `IP: ${p.ip_address}\n` +
                 `Role: ${p.printer_role.toUpperCase()}\n` +
                 `Paper Size: ${p.paper_size}\n` +
                 "------------------------\n\n";

    const printBuffer = Buffer.concat([
      init,
      center,
      bigFont,
      Buffer.from(title),
      normalFont,
      Buffer.from(line + body),
      feedAndCut
    ]);

    await sendEscPosToNetworkPrinter(p.ip_address, p.port || 9100, printBuffer);
    res.json({ success: true, message: "تم إرسال بون الاختبار للطابعة بنجاح!" });
  } catch (err: any) {
    res.status(500).json({ error: `فشل الطباعة: ${err.message}` });
  }
});

// 6. Print order KOT/Receipt silently over network (API Fallback)
app.post("/api/tenants/:tenantId/orders/:orderId/print", async (req, res) => {
  try {
    const { tenantId, orderId } = req.params;
    const { printerId } = req.body;

    const printerRes = await pool.query("SELECT * FROM printers WHERE id = $1 AND tenant_id = $2", [printerId, tenantId]);
    if (printerRes.rows.length === 0) return res.status(404).json({ error: "الطابعة غير موجودة" });
    const p = printerRes.rows[0];

    if (p.connection_type !== 'network' || !p.ip_address) {
      return res.json({ success: false, webPrintFallback: true, message: "الرجاء استخدام الطباعة الافتراضية للمتصفح لهذه الطابعة" });
    }

    const orderRes = await pool.query(
      `SELECT o.*, COALESCE(json_agg(oi) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
       FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1 AND o.tenant_id = $2 GROUP BY o.id`,
      [orderId, tenantId]
    );
    if (orderRes.rows.length === 0) return res.status(404).json({ error: "الطلب غير موجود" });
    const o = orderRes.rows[0];

    // Build raw ESC/POS payload
    const init = Buffer.from([0x1B, 0x40]);
    const center = Buffer.from([0x1B, 0x61, 0x01]);
    const left = Buffer.from([0x1B, 0x61, 0x00]);
    const bigFont = Buffer.from([0x1D, 0x21, 0x11]);
    const normalFont = Buffer.from([0x1D, 0x21, 0x00]);
    const feedAndCut = Buffer.from([0x1B, 0x64, 0x04, 0x1D, 0x56, 0x42, 0x00]);

    let text = "";
    text += `RestoCloud Order\n`;
    text += `Order: ${o.order_number}\n`;
    text += `Type: ${o.order_type === 'dine_in' ? 'DINE IN' : 'TAKEAWAY'}\n`;
    if (o.table_number) text += `Table: ${o.table_number}\n`;
    text += `Date: ${new Date(o.created_at).toLocaleString()}\n`;
    text += `--------------------------------\n`;

    const items = o.items || [];
    for (const item of items) {
      text += `${item.name_ar} x ${item.quantity}\n`;
      if (item.notes) text += ` * Note: ${item.notes}\n`;
    }
    text += `--------------------------------\n`;
    text += `Total: ${o.total} SAR\n\n`;

    const payload = Buffer.concat([
      init,
      center,
      bigFont,
      Buffer.from("RECEIPT\n"),
      normalFont,
      left,
      Buffer.from(text),
      feedAndCut
    ]);

    await sendEscPosToNetworkPrinter(p.ip_address, p.port || 9100, payload);
    res.json({ success: true, message: "تم إرسال الفاتورة للطابعة بنجاح!" });
  } catch (err: any) {
    res.status(500).json({ error: `فشل الطباعة الشبكية: ${err.message}` });
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
  const { nameAr, nameEn, nameTr, icon } = req.body;
  try {
    const countResult = await pool.query("SELECT COUNT(*) FROM categories WHERE tenant_id = $1", [tenantId]);
    const orderIndex = parseInt(countResult.rows[0].count) + 1;
    const result = await pool.query(
      "INSERT INTO categories (id, tenant_id, name_ar, name_en, name_tr, icon, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [`cat-${Date.now()}`, tenantId, nameAr, nameEn || null, nameTr || null, icon || "🍴", orderIndex]
    );
    res.status(201).json(mapCategory(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tenants/:tenantId/categories/reorder", async (req, res) => {
  const { tenantId } = req.params;
  const { orderedIds } = req.body;
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await pool.query(
        "UPDATE categories SET order_index = $1 WHERE id = $2 AND tenant_id = $3",
        [i + 1, orderedIds[i], tenantId]
      );
    }
    const result = await pool.query(
      "SELECT * FROM categories WHERE tenant_id = $1 ORDER BY order_index",
      [tenantId]
    );
    res.json(result.rows.map(mapCategory));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tenants/:tenantId/categories/:id", async (req, res) => {
  const { tenantId, id } = req.params;
  const { nameAr, nameEn, nameTr, icon } = req.body;
  try {
    const result = await pool.query(
      `UPDATE categories SET 
        name_ar = COALESCE($1, name_ar), 
        name_en = $2, 
        name_tr = $3, 
        icon = COALESCE($4, icon) 
       WHERE id = $5 AND tenant_id = $6 RETURNING *`,
      [nameAr, nameEn || null, nameTr || null, icon, id, tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "القسم غير موجود" });
    }
    res.json(mapCategory(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tenants/:tenantId/categories/:id", async (req, res) => {
  const { tenantId, id } = req.params;
  try {
    const checkItems = await pool.query("SELECT COUNT(*) FROM menu_items WHERE category_id = $1 AND tenant_id = $2", [id, tenantId]);
    const count = parseInt(checkItems.rows[0].count);
    if (count > 0) {
      return res.status(400).json({ error: "لا يمكن حذف هذا القسم لأنه يحتوي على أصناف. يرجى نقل الأصناف أو حذفها أولاً." });
    }

    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 AND tenant_id = $2 RETURNING *",
      [id, tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "القسم غير موجود" });
    }
    res.json({ success: true, message: "تم حذف القسم بنجاح" });
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
        (id, tenant_id, category_id, name_ar, name_en, name_tr, description_ar, description_en, description_tr, price, cost_price,
         calories, image, is_available, is_best_seller, preparation_time_min)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [id, tenantId, b.categoryId, b.nameAr, b.nameEn || null, b.nameTr || null, b.descriptionAr || "", b.descriptionEn || null, b.descriptionTr || null,
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
  
  const fields: string[] = [];
  const values: any[] = [id];
  let placeholderIndex = 2;
  
  const map: Record<string, string> = {
    nameAr: "name_ar",
    nameEn: "name_en",
    nameTr: "name_tr",
    descriptionAr: "description_ar",
    descriptionEn: "description_en",
    descriptionTr: "description_tr",
    price: "price",
    costPrice: "cost_price",
    calories: "calories",
    image: "image",
    isAvailable: "is_available",
    isBestSeller: "is_best_seller",
    preparationTimeMin: "preparation_time_min",
    categoryId: "category_id"
  };
  
  for (const [key, dbCol] of Object.entries(map)) {
    if (b[key] !== undefined) {
      fields.push(`${dbCol} = $${placeholderIndex}`);
      let val = b[key];
      if (["price", "costPrice", "calories", "preparationTimeMin"].includes(key) && val !== null) {
        val = Number(val);
      }
      values.push(val);
      placeholderIndex++;
    }
  }
  
  if (fields.length === 0) {
    return res.status(400).json({ error: "لا يوجد حقول للتعديل" });
  }
  
  try {
    const query = `UPDATE menu_items SET ${fields.join(", ")} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, values);
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
});app.post("/api/tenants/:tenantId/tables", async (req, res) => {
  const { tenantId } = req.params;
  const { tableNumber, capacity = 4, status = "available" } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO restaurant_tables (tenant_id, table_number, capacity, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [tenantId, tableNumber, capacity, status]
    );
    res.json(mapTable(result.rows[0]));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tenants/:tenantId/tables/:id", async (req, res) => {
  const { tenantId, id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM restaurant_tables WHERE id = $1 AND tenant_id = $2 RETURNING *",
      [id, tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "الطاولة غير موجودة" });
    }
    res.json({ success: true, message: "تم حذف الطاولة بنجاح" });
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

    // If dine_in, mark table status (occupied for cashier, reserved for QR orders)
    if (b.orderType === "dine_in" && b.tableNumber) {
      const isQR = b.cashierName === "طلب ذاتي (QR Menu)";
      const tableStatus = isQR ? 'reserved' : 'occupied';
      await client.query(
        "UPDATE restaurant_tables SET status = $1, current_order_id = $2 WHERE tenant_id = $3 AND table_number = $4",
        [tableStatus, orderId, tenantId, Number(b.tableNumber)]
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
  const { tenantId, lang = 'ar' } = req.body;
  try {
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
      if (lang === 'en') {
        return res.json({
          insights: [
            `The current average ticket value at (${tenant.nameAr}) is ${avgOrderValue} ${tenant.currency}, which is a healthy average compared to similar restaurants.`,
            `The best-selling items contribute 65% of the total revenue.`,
            `The approximate profit margin for dishes ranges between 55% and 65%, which is within the healthy range.`
          ],
          suggestions: [
            { title: "Launch Saver Combo", description: "Combine the best-selling dish with a drink and appetizer at a 10% discount.", estimatedProfitBoost: "+18% growth in daily sales" },
            { title: "Boost Afternoon Sales", description: "Special discount for orders placed between 1:00 PM and 4:00 PM.", estimatedProfitBoost: "+25% increase in table occupancy" },
            { title: "Promote High Margin Items", description: "Designate beverages and desserts as Chef recommendations.", estimatedProfitBoost: "+12% increase in net profits" }
          ],
          pricingAdvice: `Make sure to maintain a profit margin of at least 60% across all menu items.`
        });
      } else if (lang === 'tr') {
        return res.json({
          insights: [
            `(${tenant.nameAr}) restoranının şu anki ortalama sipariş tutarı ${avgOrderValue} ${tenant.currency}, bu da benzer restoranlara göre sağlıklı bir ortalamadır.`,
            `En çok satan ürünler toplam gelirin %65'ini oluşturmaktadır.`,
            `Yemeklerin yaklaşık kâr marjı %55 ile %65 arasında değişmekte olup sağlıklı aralıktadır.`
          ],
          suggestions: [
            { title: "Ekonomik Kombo Menü Başlat", description: "En çok satan yemeği bir içecek ve meze ile %10 indirimle birleştirin.", estimatedProfitBoost: "Günlük satışlarda +%18 büyüme" },
            { title: "Öğleden Sonra Satışlarını Artır", description: "13:00 - 16:00 saatleri arasındaki siparişlere özel indirim.", estimatedProfitBoost: "Masa doluluğunda +%25 artış" },
            { title: "Yüksek Marjlı Ürünleri Tanıt", description: "İçecekleri ve tatlıları Şefin Tavsiyeleri olarak belirleyin.", estimatedProfitBoost: "Net kârda +%12 artış" }
          ],
          pricingAdvice: `Tüm menü öğelerinde en az %60 kâr marjı koruduğunuzdan emin olun.`
        });
      } else {
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
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const targetLangName = lang === 'en' ? 'English' : lang === 'tr' ? 'Turkish' : 'Arabic';
    const itemsSummary = tenantItems.map(i => {
      const name = lang === 'ar' ? i.nameAr : (lang === 'tr' && i.nameTr ? i.nameTr : (i.nameEn || i.nameAr));
      return `${name}: price ${i.price}, cost ${i.costPrice}, bestseller: ${i.isBestSeller ? 'yes' : 'no'}`;
    }).join('\n');

    const prompt = `You are a strategic SaaS restaurant consultant. Analyze "${tenant.nameAr}" restaurant data:
Total revenue: ${totalRevenue} ${tenant.currency} (${orderCount} orders, average ticket: ${avgOrderValue}).
Menu items:\n${itemsSummary}\n
Respond in ${targetLangName} language JSON schema containing: "insights" (3 insights), "suggestions" (3 growth combo suggestions with title/description/estimatedProfitBoost), "pricingAdvice" (1 pricing advice text).`;
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
    if (lang === 'en') {
      res.json({ insights: ["Analysis currently unavailable."], suggestions: [], pricingAdvice: "Check restaurant data." });
    } else if (lang === 'tr') {
      res.json({ insights: ["Analiz şu anda kullanılamıyor."], suggestions: [], pricingAdvice: "Restoran verilerini kontrol edin." });
    } else {
      res.json({ insights: ["تعذر التحليل حالياً."], suggestions: [], pricingAdvice: "تحقق من بيانات المطعم." });
    }
  }
});

// PostgreSQL Export (still useful - now generates script from DB)
app.get("/api/export/postgresql", async (req, res) => {
  try {
    const tenantsRes = await pool.query("SELECT * FROM tenants");
    const sql = `-- RestoCloud PostgreSQL Export - ${new Date().toISOString()}\n\n` +
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
      console.log(`🚀 RestoCloud Multi-Tenant POS Server running on http://localhost:${PORT}`);
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
