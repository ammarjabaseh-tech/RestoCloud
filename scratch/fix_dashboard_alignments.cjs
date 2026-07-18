const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// 1. Redesign Dashboard Header: Logo/Name + QR Code button on top row, Tab Switcher on its own row underneath
const oldHeaderBlock = `      {/* Top Banner & Tabs */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 text-3xl flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
            <RestaurantLogo logo={tenant.logo} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-slate-900">{tenant.nameAr}</h1>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200 font-sans">
                {lang === 'ar' ? 'لوحة المالك (Admin)' : lang === 'tr' ? 'Sahip Paneli (Admin)' : 'Owner Panel (Admin)'}
              </span>
              {tenant.status === 'trial' && (
                <span className="text-[11px] bg-amber-100 dark:bg-amber-950 text-amber-855 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full animate-pulse font-bold">
                  {lang === 'ar' ? \`⏳ تجريبي: متبقي \${getTrialDaysLeft()} يوم\` : lang === 'tr' ? \`⏳ Deneme: \${getTrialDaysLeft()} gün kaldı\` : \`⏳ Trial: \${getTrialDaysLeft()} days left\`}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{adminTranslations[lang].subtitle}</p>
          </div>
        </div>

        {/* QR Code Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setQrTargetTable("general");
              setShowQRModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 cursor-pointer shadow-3xs hover:-translate-y-0.5 transform"
          >
            <QrCode className="w-4 h-4 shrink-0 text-indigo-600 animate-pulse" />
            <span>{lang === 'ar' ? '📲 باركود المنيو العام (QR)' : lang === 'tr' ? '📲 Genel Menü Barkodu (QR)' : '📲 General Menu QR Code'}</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto border border-slate-200 no-scrollbar">`;

const newHeaderBlock = `      {/* Top Banner & Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Row 1: Logo, Name & QR Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-250 text-3xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden shrink-0">
              <RestaurantLogo logo={tenant.logo} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{tenant.nameAr}</h1>
                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200 dark:border-emerald-900 font-sans">
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

          {/* QR Code Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setQrTargetTable("general");
                setShowQRModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/65 dark:border-indigo-800/60 cursor-pointer shadow-3xs hover:-translate-y-0.5 transform"
            >
              <QrCode className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span>{lang === 'ar' ? '📲 باركود المنيو العام (QR)' : lang === 'tr' ? '📲 Genel Menü Barkodu (QR)' : '📲 General Menu QR Code'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Tab Switcher (Full Width underneath) */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl overflow-x-auto border border-slate-200 dark:border-slate-800 no-scrollbar w-full">`;

content = content.replace(oldHeaderBlock, newHeaderBlock);

// 2. Explicitly add text-right to the product table header th elements (to match right-aligned cell data)
content = content.replace(
  '<th className="p-4">{lang === \'ar\' ? \'الصنف والوصف\'',
  '<th className="p-4 text-right">{lang === \'ar\' ? \'الصنف والوصف\''
);
content = content.replace(
  '<th className="p-4">{lang === \'ar\' ? \'القسم\'',
  '<th className="p-4 text-right">{lang === \'ar\' ? \'القسم\''
);
content = content.replace(
  '<th className="p-4">{lang === \'ar\' ? \'السعر والتكلفة\'',
  '<th className="p-4 text-right">{lang === \'ar\' ? \'السعر والتكلفة\''
);
content = content.replace(
  '<th className="p-4">{lang === \'ar\' ? \'مدة التحضير\'',
  '<th className="p-4 text-right">{lang === \'ar\' ? \'مدة التحضير\''
);
content = content.replace(
  '<th className="p-4">{lang === \'ar\' ? \'الحالة والتوفر\'',
  '<th className="p-4 text-right">{lang === \'ar\' ? \'الحالة والتوفر\''
);

// 3. Fix the Category edit/delete button border & spacing (use logical start border)
content = content.replace(
  'className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-800 px-1.5 mr-1"',
  'className="flex items-center gap-0.5 border-s border-slate-200 dark:border-slate-800 ps-1.5 ms-1.5"'
);

// 4. Redesign Add Item Modal to have fixed Header, fixed Footer, and scrollable Form Body
const oldModalBlockStart = `      {/* ADD / EDIT ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6" dir="rtl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingItem ? "تعديل بيانات الطبق / الصنف" : "إضافة طبق أو صنف جديد للمنيو"}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">`;

const newModalBlockStart = `      {/* ADD / EDIT ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden" dir="rtl">
            
            {/* Fixed Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6 shrink-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingItem ? "تعديل بيانات الطبق / الصنف" : "إضافة طبق أو صنف جديد للمنيو"}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="flex-1 flex flex-col min-h-0">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 text-right">`;

content = content.replace(oldModalBlockStart, newModalBlockStart);

// Let's replace the form ending in the modal as well to close the scrollable div and create a fixed footer
const oldModalBlockEnd = `              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={\`px-8 py-2.5 rounded-xl \${theme.primaryBg} \${theme.primaryHover} text-white font-bold text-xs shadow-lg transition-all\`}
                >
                  {editingItem ? "حفظ التعديلات" : "إضافة الطبق الآن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}`

const newModalBlockEnd = `              </div>

              {/* Fixed Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-750 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={\`px-8 py-2.5 rounded-xl \${theme.primaryBg} \${theme.primaryHover} text-white font-bold text-xs shadow-lg transition-all cursor-pointer\`}
                >
                  {editingItem ? "حفظ التعديلات" : "إضافة الطبق الآن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}`

content = content.replace(oldModalBlockEnd, newModalBlockEnd);

// 5. Replace squished input styles inside the modal with premium spacious styling (h-10 text-xs px-3.5 rounded-xl border border-slate-250)
// To do this, let's target inputs inside the modal.
// We can search for the specific inputs within the form in the code and replace them.
// Let's replace the Arabic name input, English name, Turkish name, price, cost price, preparation time, and description textarea styles.
content = content.replace(
  'className="w-full px-2 py-1 rounded-md text-[11px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"',
  'className="w-full h-10 px-3.5 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"'
);
// Let's do this replace for multiple occurrences using AllowMultiple or a loop in JS
content = content.replace(
  /className="w-full px-2 py-1 rounded-md text-\[11px\] border border-slate-300 dark:border-slate-705 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"/g,
  'className="w-full h-10 px-3.5 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"'
);
content = content.replace(
  /className="w-full px-2 py-1 rounded-md text-\[11px\] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"/g,
  'className="w-full h-10 px-3.5 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"'
);
content = content.replace(
  /className="w-full px-2 py-1 rounded-md text-\[11px\] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none"/g,
  'className="w-full h-10 px-3.5 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"'
);
content = content.replace(
  'className="w-full px-2 py-1 rounded-md text-[11px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none font-bold"',
  'className="w-full h-10 px-3.5 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"'
);

// Form textareas
content = content.replace(
  /className="w-full px-2 py-1 rounded-md text-\[11px\] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none leading-relaxed"/g,
  'className="w-full p-3.5 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs text-slate-900 dark:text-white outline-none leading-relaxed focus:ring-2 focus:ring-indigo-500"'
);

// Labels text size mb and font
content = content.replace(
  /label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"/g,
  'label className="block text-[11px] font-black text-slate-650 dark:text-slate-400 mb-1"'
);
content = content.replace(
  /label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1\.5"/g,
  'label className="block text-[11px] font-black text-slate-650 dark:text-slate-405 mb-1.5"'
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully adjusted dashboard alignments, header layout, table header positioning, and Add Item modal wrapper scroll structure!");
