const fs = require("fs");

const navbarFile = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/Navbar.tsx";
const posFile = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";

// --- 1. Modify Navbar.tsx ---
let navContent = fs.readFileSync(navbarFile, "utf8");

// Add LayoutGrid to imports
navContent = navContent.replace(
  "  ChefHat\n} from \"lucide-react\";",
  "  ChefHat,\n  LayoutGrid\n} from \"lucide-react\";"
);

// Restructure POS Dashboard button for waiter role
const oldPOSBtn = `{(!currentUser || currentUser.permissions.canManagePOS) && currentTenant?.subscriptionPlan !== "lite" && (
              <button
                onClick={() => onSelectView("pos_dashboard")}
                className={\`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap \${
                  activeView === "pos_dashboard"
                    ? \`\${theme.primaryBg} text-white font-bold shadow-sm\`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }\`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{navTranslations[lang].pos}</span>
              </button>
            )}`;

const newPOSBtn = `{(!currentUser || currentUser.permissions.canManagePOS) && currentTenant?.subscriptionPlan !== "lite" && (
              <button
                onClick={() => onSelectView("pos_dashboard")}
                className={\`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap \${
                  activeView === "pos_dashboard"
                    ? \`\${theme.primaryBg} text-white font-bold shadow-sm\`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }\`}
              >
                {currentUser?.role === "waiter" ? (
                  <LayoutGrid className="w-3.5 h-3.5" />
                ) : (
                  <CreditCard className="w-3.5 h-3.5" />
                )}
                <span className="hidden lg:inline">
                  {currentUser?.role === "waiter"
                    ? (lang === 'ar' ? 'إدارة الطاولات' : 'Tables Management')
                    : navTranslations[lang].pos
                  }
                </span>
              </button>
            )}`;

navContent = navContent.replace(oldPOSBtn, newPOSBtn);

// Restrict Digital Menu button for waiters
const oldMenuBtn = `            <button
              onClick={() => onSelectView("digital_menu")}
              className={\`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap \${
                activeView === "digital_menu"
                  ? \`\${theme.primaryBg} text-white font-bold shadow-sm\`
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }\`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{navTranslations[lang].menu}</span>
            </button>`;

const newMenuBtn = `            {(!currentUser || currentUser.role !== "waiter") && (
              <button
                onClick={() => onSelectView("digital_menu")}
                className={\`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap \${
                  activeView === "digital_menu"
                    ? \`\${theme.primaryBg} text-white font-bold shadow-sm\`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }\`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{navTranslations[lang].menu}</span>
              </button>
            )}`;

navContent = navContent.replace(oldMenuBtn, newMenuBtn);

// Restrict KDS button for waiters
const oldKDSBtn = `            {currentUser && currentTenant?.subscriptionPlan !== "lite" && (
              <button
                onClick={() => onSelectView("kitchen_display")}
                className={\`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap \${
                  activeView === "kitchen_display"
                    ? \`\${theme.primaryBg} text-white font-bold shadow-sm\`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }\`}
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden lg:inline">{navTranslations[lang].kds}</span>
              </button>
            )}`;

const newKDSBtn = `            {currentUser && currentUser.role !== "waiter" && currentTenant?.subscriptionPlan !== "lite" && (
              <button
                onClick={() => onSelectView("kitchen_display")}
                className={\`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap \${
                  activeView === "kitchen_display"
                    ? \`\${theme.primaryBg} text-white font-bold shadow-sm\`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }\`}
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden lg:inline">{navTranslations[lang].kds}</span>
              </button>
            )}`;

navContent = navContent.replace(oldKDSBtn, newKDSBtn);

fs.writeFileSync(navbarFile, navContent, "utf8");
console.log("Navbar waiter modifications applied successfully!");


// --- 2. Modify POSDashboardView.tsx ---
let posContent = fs.readFileSync(posFile, "utf8");

// Add currentUser state reader
const oldPOSModeDef = `  const [posMode, setPosMode] = useState<"sales" | "orders" | "tables">("sales");`;
const newPOSModeDef = `  const [currentUser] = useState<TenantUser | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [posMode, setPosMode] = useState<"sales" | "orders" | "tables">(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === "waiter") return "tables";
      } catch (e) {}
    }
    return "sales";
  });`;

posContent = posContent.replace(oldPOSModeDef, newPOSModeDef);

// Hide online menu open/close status toggle for waiters
const oldStatusToggle = `            {/* Cashier Quick Restaurant Status Toggle */}
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3 mr-1 font-sans">
              <button
                type="button"
                onClick={toggleRestaurantStatus}
                className={\`px-3 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer border \${
                  tenant.isOpen !== false
                    ? "bg-emerald-50 text-emerald-700 border-emerald-250/70 hover:bg-emerald-100/70"
                    : "bg-rose-50 text-rose-700 border-rose-250/70 hover:bg-rose-100/70"
                }\`}
                title={lang === 'ar' ? 'تغيير حالة استقبال الطلبات للمنيو' : 'Toggle online ordering status'}
              >
                <span className={\`w-2 h-2 rounded-full \${tenant.isOpen !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}\`} />
                <span>
                  {tenant.isOpen !== false
                    ? (lang === 'ar' ? 'المنيو: مفتوح' : lang === 'tr' ? 'Menü: Açık' : 'Menu: Open')
                    : (lang === 'ar' ? 'المنيو: مغلق' : lang === 'tr' ? 'Menü: Kapalı' : 'Menu: Closed')
                  }
                </span>
              </button>
            </div>`;

const newStatusToggle = `            {/* Cashier Quick Restaurant Status Toggle */}
            {currentUser?.role !== "waiter" && (
              <div className="flex items-center gap-2 border-r border-slate-200 pr-3 mr-1 font-sans">
                <button
                  type="button"
                  onClick={toggleRestaurantStatus}
                  className={\`px-3 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer border \${
                    tenant.isOpen !== false
                      ? "bg-emerald-50 text-emerald-700 border-emerald-250/70 hover:bg-emerald-100/70"
                      : "bg-rose-50 text-rose-700 border-rose-250/70 hover:bg-rose-100/70"
                  }\`}
                  title={lang === 'ar' ? 'تغيير حالة استقبال الطلبات للمنيو' : 'Toggle online ordering status'}
                >
                  <span className={\`w-2 h-2 rounded-full \${tenant.isOpen !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}\`} />
                  <span>
                    {tenant.isOpen !== false
                      ? (lang === 'ar' ? 'المنيو: مفتوح' : lang === 'tr' ? 'Menü: Açık' : 'Menu: Open')
                      : (lang === 'ar' ? 'المنيو: مغلق' : lang === 'tr' ? 'Menü: Kapalı' : 'Menu: Closed')
                    }
                  </span>
                </button>
              </div>
            )}`;

posContent = posContent.replace(oldStatusToggle, newStatusToggle);

// Hide posMode switcher from waiters
const oldPOSModeSwitcher = `          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto border border-slate-200 no-scrollbar">
              <button
                onClick={() => setPosMode("sales")}
                className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer \${
                  posMode === "sales"
                    ? \`\${theme.primaryBg} text-white shadow-sm font-bold\`
                    : "text-slate-600 hover:bg-white/70"
                }\`}
              >
                {posTranslations[lang].newSale}
              </button>
              <button
                onClick={() => {
                  setPosMode("orders");
                  fetchHistoryOrders();
                }}
                className={\`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer \${
                  posMode === "orders"
                    ? \`\${theme.primaryBg} text-white shadow-sm font-bold\`
                    : "text-slate-600 hover:bg-white/70"
                }\`}
              >
                <span>{posTranslations[lang].ordersList}</span>
                {pendingSelfOrders.length > 0 && (
                  <span className="absolute -top-1.5 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                    {pendingSelfOrders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setPosMode("tables")}
                className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer \${
                  posMode === "tables"
                    ? \`\${theme.primaryBg} text-white shadow-sm font-bold\`
                    : "text-slate-600 hover:bg-white/70"
                }\`}
              >
                <span>{lang === 'ar' ? 'حالة الطاولات' : lang === 'tr' ? 'Masa Durumu' : 'Tables Status'}</span>
              </button>
            </div>`;

const newPOSModeSwitcher = `          {currentUser?.role !== "waiter" && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto border border-slate-200 no-scrollbar">
              <button
                onClick={() => setPosMode("sales")}
                className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer \${
                  posMode === "sales"
                    ? \`\${theme.primaryBg} text-white shadow-sm font-bold\`
                    : "text-slate-600 hover:bg-white/70"
                }\`}
              >
                {posTranslations[lang].newSale}
              </button>
              <button
                onClick={() => {
                  setPosMode("orders");
                  fetchHistoryOrders();
                }}
                className={\`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer \${
                  posMode === "orders"
                    ? \`\${theme.primaryBg} text-white shadow-sm font-bold\`
                    : "text-slate-600 hover:bg-white/70"
                }\`}
              >
                <span>{posTranslations[lang].ordersList}</span>
                {pendingSelfOrders.length > 0 && (
                  <span className="absolute -top-1.5 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                    {pendingSelfOrders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setPosMode("tables")}
                className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer \${
                  posMode === "tables"
                    ? \`\${theme.primaryBg} text-white shadow-sm font-bold\`
                    : "text-slate-600 hover:bg-white/70"
                }\`}
              >
                <span>{lang === 'ar' ? 'حالة الطاولات' : lang === 'tr' ? 'Masa Durumu' : 'Tables Status'}</span>
              </button>
            </div>
          )}`;

posContent = posContent.replace(oldPOSModeSwitcher, newPOSModeSwitcher);

// Hide invoice history button for waiters
const oldInvoiceHistory = `            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  fetchHistoryOrders();
                  setHistoryTab("all");
                  setShowOrderHistoryModal(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-200 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                title={posTranslations[lang].invoiceHistory}
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{posTranslations[lang].invoiceHistory}</span>
                <span className="sm:hidden">{lang === 'ar' ? 'الفواتير' : lang === 'tr' ? 'Faturalar' : 'Invoices'}</span>
              </button>`;

const newInvoiceHistory = `            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentUser?.role !== "waiter" && (
                <button
                  onClick={() => {
                    fetchHistoryOrders();
                    setHistoryTab("all");
                    setShowOrderHistoryModal(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-200 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                  title={posTranslations[lang].invoiceHistory}
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{posTranslations[lang].invoiceHistory}</span>
                  <span className="sm:hidden">{lang === 'ar' ? 'الفواتير' : lang === 'tr' ? 'Faturalar' : 'Invoices'}</span>
                </button>
              )}`;

posContent = posContent.replace(oldInvoiceHistory, newInvoiceHistory);

fs.writeFileSync(posFile, posContent, "utf8");
console.log("POSDashboardView waiter modifications applied successfully!");
