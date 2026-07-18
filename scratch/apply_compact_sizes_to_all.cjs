const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Constrain phone input container to max-w-[280px]
content = content.replace(
  '<div className="flex gap-1.5" dir="ltr">',
  '<div className="flex gap-1.5 w-full max-w-[280px]" dir="ltr">'
);

// Constrain VAT Rate input to max-w-[120px] (let's do it precisely)
content = content.replace(
  'type="number"\n                      value={taxRate}\n                      onChange={(e) => setTaxRate(e.target.value)}\n                      className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'type="number"\n                      value={taxRate}\n                      onChange={(e) => setTaxRate(e.target.value)}\n                      className="w-full max-w-[120px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Constrain Currency selection to max-w-[280px]
content = content.replace(
  'className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'className="w-full max-w-[280px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Constrain WiFi SSID input to max-w-[280px]
content = content.replace(
  'value={wifiName}\n                      onChange={(e) => setWifiName(e.target.value)}\n                      className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={wifiName}\n                      onChange={(e) => setWifiName(e.target.value)}\n                      className="w-full max-w-[280px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Constrain WiFi Password input to max-w-[280px]
content = content.replace(
  'value={wifiPass}\n                      onChange={(e) => setWifiPass(e.target.value)}\n                      className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={wifiPass}\n                      onChange={(e) => setWifiPass(e.target.value)}\n                      className="w-full max-w-[280px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Constrain Logo symbols input to max-w-[280px]
content = content.replace(
  'className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'className="w-full max-w-[280px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Constrain Logo upload label button to max-w-[280px]
content = content.replace(
  'className="w-full cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-3xs transition-all"',
  'className="w-full max-w-[280px] cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 shadow-3xs transition-all"'
);

// Constrain Logo Emoji selector grid to max-w-[280px]
content = content.replace(
  'className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-h-32 overflow-y-auto no-scrollbar"',
  'className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-h-32 overflow-y-auto no-scrollbar w-full max-w-[280px]"'
);

// Compact Theme Colors card grid to 4 columns on desktop, 3 columns on mobile
content = content.replace(
  '<div className="grid grid-cols-2 gap-2">',
  '<div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 w-full max-w-[400px]">'
);

// Compact the button size inside Theme Color select grid
content = content.replace(
  'className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${',
  'className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all cursor-pointer text-[11px] ${'
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully constrained all inputs to perfect maximum widths and compacted left-hand cards!");
