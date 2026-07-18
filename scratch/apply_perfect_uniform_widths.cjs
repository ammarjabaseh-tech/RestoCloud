const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Change all max-width values to uniform fixed widths:
// NameAr input (currently w-full max-w-[150px])
content = content.replace(
  'className="w-full max-w-[150px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'className="w-[240px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Slogan input (currently w-full max-w-[150px] or similar)
content = content.replace(
  'className="w-full px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'className="w-[240px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Address input (currently w-full px-2 py-1 rounded-md text-[11px])
content = content.replace(
  'className="w-full px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'className="w-[240px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Phone input container (currently flex gap-1.5 w-full max-w-[150px])
content = content.replace(
  'className="flex gap-1.5 w-full max-w-[150px]"',
  'className="flex gap-1.5 w-[240px]"'
);

// Phone text input max-w-[110px] -> flex-1 (fills the rest of the 240px container, which is 155px!)
content = content.replace(
  'className="flex-1 h-[32px] max-w-[110px] px-3 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"',
  'className="flex-1 h-[32px] px-3 rounded-md border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"'
);

// VAT Rate (currently w-full max-w-[70px])
content = content.replace(
  'className="w-full max-w-[70px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'className="w-[80px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Country & Currency (currently w-full max-w-[150px])
content = content.replace(
  'className="w-full max-w-[150px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'className="w-[240px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// WiFi SSID & WiFi Password (currently w-full max-w-[150px])
content = content.replace(
  'value={wifiName}\n                      onChange={(e) => setWifiName(e.target.value)}\n                      className="w-full max-w-[150px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={wifiName}\n                      onChange={(e) => setWifiName(e.target.value)}\n                      className="w-[200px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);
content = content.replace(
  'value={wifiPass}\n                      onChange={(e) => setWifiPass(e.target.value)}\n                      className="w-full max-w-[150px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={wifiPass}\n                      onChange={(e) => setWifiPass(e.target.value)}\n                      className="w-[200px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Social Media inputs (currently w-full max-w-[150px])
content = content.replace(
  /className="w-full max-w-\[150px\] px-3 py-1\.5 rounded-lg border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-550 focus:outline-none"/g,
  'className="w-[240px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-550 focus:outline-none"'
);

// Logo Input field (currently w-full max-w-[150px])
content = content.replace(
  'className="w-full max-w-[150px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'className="w-[240px] px-2 py-1 rounded-md text-[11px] border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// Logo Upload button
content = content.replace(
  'className="w-full max-w-[200px] cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 shadow-3xs transition-all"',
  'className="w-[240px] cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs py-1.5 px-3 rounded-md flex items-center justify-center gap-2 shadow-3xs transition-all"'
);

// Quick Emojis selector container
content = content.replace(
  'className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800\/40 rounded-2xl border border-slate-200\/80 dark:border-slate-800 max-h-32 overflow-y-auto no-scrollbar w-full max-w-[200px]"',
  'className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800\/40 rounded-2xl border border-slate-200\/80 dark:border-slate-800 max-h-32 overflow-y-auto no-scrollbar w-[240px]"'
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully set perfect, uniform compact widths and corrected alignment!");
