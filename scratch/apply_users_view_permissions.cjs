const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantUsersView.tsx";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");

  // 1. Update translations
  const arTarget = `    deliveryLabel: "عامل توصيل / سائق (Delivery)",
    deliveries: "عمال التوصيل",`;
  const arReplacement = `    deliveryLabel: "عامل توصيل / سائق (Delivery)",
    deliveries: "عمال التوصيل",
    permWaiter: "🍽️ شاشة الويتر",
    permWaiterDesc: "صلاحية شاشة الويتر (إدارة طلبات وحالات الطاولات)",
    permDelivery: "🛵 شاشة التوصيل",
    permDeliveryDesc: "صلاحية شاشة التوصيل (استلام الطلبات وتوصيلها وتتبعها)",`;
  content = content.replace(arTarget, arReplacement);

  const enTarget = `    deliveryLabel: "Delivery Driver (Delivery)",
    deliveries: "Delivery Drivers",`;
  const enReplacement = `    deliveryLabel: "Delivery Driver (Delivery)",
    deliveries: "Delivery Drivers",
    permWaiter: "🍽️ Waiter Screen",
    permWaiterDesc: "Access to Waiter Dashboard (ordering & tables)",
    permDelivery: "🛵 Delivery Screen",
    permDeliveryDesc: "Access to Delivery Dashboard (claims & status tracking)",`;
  content = content.replace(enTarget, enReplacement);

  const trTarget = `    deliveryLabel: "Kurye / Sürücü (Delivery)",
    deliveries: "Kuryeler",`;
  const trReplacement = `    deliveryLabel: "Kurye / Sürücü (Delivery)",
    deliveries: "Kuryeler",
    permWaiter: "🍽️ Garson Ekranı",
    permWaiterDesc: "Garson paneline erişim ve masa siparişi yönetimi",
    permDelivery: "🛵 Kurye Ekranı",
    permDeliveryDesc: "Kurye paneline erişim ve sipariş takip yönetimi",`;
  content = content.replace(trTarget, trReplacement);

  // 2. Update default state initialization
  const stateTarget = `  const [permissions, setPermissions] = useState({
    canManagePOS: true,
    canManageMenu: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false
  });`;

  const stateReplacement = `  const [permissions, setPermissions] = useState({
    canManagePOS: true,
    canManageMenu: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false,
    canAccessWaiter: false,
    canAccessDelivery: false
  });`;
  content = content.replace(stateTarget, stateReplacement);

  // 3. Update handleRoleChange function block
  const fnTarget = `  // Handle role change to auto-set default permissions
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "owner") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: true,
        canManageUsers: true,
        canViewReports: true,
        canManageSettings: true
      });
    } else if (newRole === "manager") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: true,
        canManageUsers: false,
        canViewReports: true,
        canManageSettings: false
      });
    } else if (newRole === "cashier") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false
      });
    } else if (newRole === "waiter") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false
      });
    } else if (newRole === "worker") {
      setPermissions({
        canManagePOS: false,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false
      });
    }
  };`;

  const fnReplacement = `  // Handle role change to auto-set default permissions
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "owner") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: true,
        canManageUsers: true,
        canViewReports: true,
        canManageSettings: true,
        canAccessWaiter: true,
        canAccessDelivery: true
      });
    } else if (newRole === "manager") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: true,
        canManageUsers: false,
        canViewReports: true,
        canManageSettings: false,
        canAccessWaiter: true,
        canAccessDelivery: true
      });
    } else if (newRole === "cashier") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false,
        canAccessWaiter: false,
        canAccessDelivery: false
      });
    } else if (newRole === "waiter") {
      setPermissions({
        canManagePOS: false,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false,
        canAccessWaiter: true,
        canAccessDelivery: false
      });
    } else if (newRole === "delivery") {
      setPermissions({
        canManagePOS: false,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false,
        canAccessWaiter: false,
        canAccessDelivery: true
      });
    } else if (newRole === "worker") {
      setPermissions({
        canManagePOS: false,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false,
        canAccessWaiter: false,
        canAccessDelivery: false
      });
    }
  };`;
  content = content.replace(fnTarget, fnReplacement);

  // 4. Render new checkboxes in the modal
  const checkboxesTarget = `                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canManageSettings}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canManageSettings: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{usersTranslations[lang].permSettingsDesc}</span>
                  </label>`;

  const checkboxesReplacement = checkboxesTarget + `\n
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canAccessWaiter || false}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canAccessWaiter: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{usersTranslations[lang].permWaiter || (lang === 'ar' ? '🍽️ شاشة الويتر' : '🍽️ Waiter Screen')}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{usersTranslations[lang].permWaiterDesc || (lang === 'ar' ? 'صلاحية شاشة الويتر (إدارة طلبات وحالات الطاولات)' : 'Access to waiter dashboard')}</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canAccessDelivery || false}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canAccessDelivery: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{usersTranslations[lang].permDelivery || (lang === 'ar' ? '🛵 شاشة التوصيل' : '🛵 Delivery Screen')}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{usersTranslations[lang].permDeliveryDesc || (lang === 'ar' ? 'صلاحية شاشة التوصيل (استلام الطلبات وتوصيلها وتتبعها)' : 'Access to delivery dashboard')}</span>
                    </div>
                  </label>`;

  content = content.replace(checkboxesTarget, checkboxesReplacement);

  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully updated TenantUsersView.tsx with Waiter and Delivery permission controls!");
} else {
  console.log("File not found!");
}
