const fs = require("fs");
const path = require("path");

const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// 1. Name input (line 1026 approx)
// Search for nameAr input and replace its className to include max-w-[280px]
content = content.replace(
  'value={nameAr}\n                      onChange={(e) => setNameAr(e.target.value)}\n                      className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={nameAr}\n                      onChange={(e) => setNameAr(e.target.value)}\n                      className="w-full max-w-[280px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// 2. Slogan input
content = content.replace(
  'value={slogan}\n                      onChange={(e) => setSlogan(e.target.value)}\n                      className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={slogan}\n                      onChange={(e) => setSlogan(e.target.value)}\n                      className="w-full max-w-[280px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// 3. Address input
content = content.replace(
  'value={address}\n                      onChange={(e) => setAddress(e.target.value)}\n                      className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={address}\n                      onChange={(e) => setAddress(e.target.value)}\n                      className="w-full max-w-[280px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// 4. Phone input (line 1104)
content = content.replace(
  'className="flex-1 h-[34px] px-3 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"',
  'className="flex-1 h-[34px] max-w-[170px] px-3 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"'
);

// 5. VAT input
content = content.replace(
  'value={taxRate}\n                      onChange={(e) => setTaxRate(e.target.value)}\n                      className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={taxRate}\n                      onChange={(e) => setTaxRate(e.target.value)}\n                      className="w-full max-w-[120px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// 6. Currency selector (line 1151)
content = content.replace(
  'className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'className="w-full max-w-[280px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// 7. WiFi SSID
content = content.replace(
  'value={wifiName}\n                      onChange={(e) => setWifiName(e.target.value)}\n                      className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={wifiName}\n                      onChange={(e) => setWifiName(e.target.value)}\n                      className="w-full max-w-[200px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// 8. WiFi Password
content = content.replace(
  'value={wifiPass}\n                      onChange={(e) => setWifiPass(e.target.value)}\n                      className="w-full px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"',
  'value={wifiPass}\n                      onChange={(e) => setWifiPass(e.target.value)}\n                      className="w-full max-w-[200px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"'
);

// 9. Social links (Facebook, Instagram, TikTok, Location)
content = content.replace(
  /className="w-full px-3 py-1\.5 rounded-lg border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-550 focus:outline-none"/g,
  'className="w-full max-w-[280px] px-3 py-1.5 rounded-lg border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-550 focus:outline-none"'
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully added maximum widths to all inputs in AdminPanelView.tsx");
