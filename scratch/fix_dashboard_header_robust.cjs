const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// We will find the index of "{/* Top Banner & Tabs */}" and the closing div around line 714
const startIndex = content.indexOf("      {/* Top Banner & Tabs */}");
const searchAfter = content.substring(startIndex + 50);

// The closing div of the header card is just before "      {/* TAB 1: MENU & ITEMS MANAGEMENT */}"
const endAnchor = "      {/* TAB 1: MENU & ITEMS MANAGEMENT */}";
const endIndex = content.indexOf(endAnchor);

if (startIndex !== -1 && endIndex !== -1) {
  console.log("Found both start and end indices!");
  
  const headerReplacement = `      {/* Top Banner & Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
        
        {/* Row 1: Restaurant Logo + Owner Info (on the right) AND QR Code Button (on the left) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-205 text-3xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden shrink-0">
              <RestaurantLogo logo={tenant.logo} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{tenant.nameAr}</h1>
                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200 dark:border-emerald-900 font-sans">
                  {lang === 'ar' ? 'لوحة المالك (Admin)' : lang === 'tr' ? 'Sahip Paneli (Admin)' : 'Owner Panel (Admin)'}
                </span>
                {tenant.status === 'trial' && (
                  <span className="text-[11px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full animate-pulse font-bold">
                    {lang === 'ar' ? \`⏳ تجريبي: متبقي \${getTrialDaysLeft()} يوم\` : lang === 'tr' ? \`⏳ Deneme: \${getTrialDaysLeft()} gün kaldı\` : \`⏳ Trial: \${getTrialDaysLeft()} days left\`}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{adminTranslations[lang].subtitle}</p>
            </div>
          </div>

          {/* QR Code Action Button on the Left */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setQrTargetTable("general");
                setShowQRModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 cursor-pointer shadow-3xs hover:-translate-y-0.5 transform"
            >
              <QrCode className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span>{lang === 'ar' ? '📲 باركود المنيو العام (QR)' : lang === 'tr' ? '📲 Genel Menü Barkodu (QR)' : '📲 General Menu QR Code'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Tab Switcher (Stretches full width of the card) */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl overflow-x-auto border border-slate-150 dark:border-slate-805/50 w-full no-scrollbar">
          <button
            onClick={() => setActiveTab("menu")}
            className={\`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer \${
              activeTab === "menu"
                ? \`\${theme.primaryBg} text-white shadow-sm scale-[1.02]\`
                : "text-slate-650 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900"
            }\`}
          >
            <Utensils className="w-4 h-4" />
            <span>{adminTranslations[lang].tabMenu}</span>
          </button>

          <button
            onClick={() => setActiveTab("branding")}
            className={\`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer \${
              activeTab === "branding"
                ? \`\${theme.primaryBg} text-white shadow-sm scale-[1.02]\`
                : "text-slate-650 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900"
            }\`}
          >
            <Palette className="w-4 h-4" />
            <span>{adminTranslations[lang].tabBranding}</span>
          </button>

          {tenant.subscriptionPlan !== "lite" && (
            <button
              onClick={() => setActiveTab("tables")}
              className={\`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer \${
                activeTab === "tables"
                  ? \`\${theme.primaryBg} text-white shadow-sm scale-[1.02]\`
                  : "text-slate-650 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900"
              }\`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{adminTranslations[lang].tabTables}</span>
            </button>
          )}

          {tenant.subscriptionPlan !== "lite" && (
            <button
              onClick={() => setActiveTab("analytics")}
              className={\`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer \${
                activeTab === "analytics"
                  ? \`\${theme.primaryBg} text-white shadow-sm scale-[1.02]\`
                  : "text-slate-650 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900"
              }\`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{adminTranslations[lang].tabAnalytics}</span>
            </button>
          )}

          {tenant.subscriptionPlan !== "lite" && (
            <button
              onClick={() => setActiveTab("users")}
              className={\`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer \${
                activeTab === "users"
                  ? \`\${theme.primaryBg} text-white shadow-sm scale-[1.02]\`
                  : "text-slate-650 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900"
              }\`}
            >
              <Users className="w-4 h-4" />
              <span>{adminTranslations[lang].tabUsers}</span>
            </button>
          )}

          {tenant.subscriptionPlan !== "lite" && (
            <button
              onClick={() => setActiveTab("printers")}
              className={\`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer \${
                activeTab === "printers"
                  ? \`\${theme.primaryBg} text-white shadow-sm scale-[1.02]\`
                  : "text-slate-650 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900"
              }\`}
            >
              <PrinterIcon className="w-4 h-4" />
              <span>{adminTranslations[lang].tabPrinters}</span>
            </button>
          )}
        </div>
      </div>
\n`;

  content = content.substring(0, startIndex) + headerReplacement + content.substring(endIndex);
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Successfully rebuilt header layout in AdminPanelView.tsx!");
} else {
  console.log("Indices not found.");
}
