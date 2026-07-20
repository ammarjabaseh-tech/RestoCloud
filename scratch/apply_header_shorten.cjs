const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");

  // 1. Container padding
  content = content.replace(
    `<div className="lg:col-span-12 bg-white p-3.5 rounded-3xl border border-slate-200 shadow-sm space-y-3">`,
    `<div className="lg:col-span-12 bg-white p-2.5 px-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">`
  );

  // 2. Logo and titles size
  content = content.replace(
    `<div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg border border-slate-200 overflow-hidden">`,
    `<div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-base border border-slate-200 overflow-hidden">`
  );
  content = content.replace(
    `className="text-sm font-bold text-slate-900 flex items-center gap-2"`,
    `className="text-xs font-bold text-slate-900 flex items-center gap-1.5"`
  );
  content = content.replace(
    `className="text-[10px] text-slate-500"`,
    `className="text-[9px] text-slate-500"`
  );

  // 3. Status switcher button padding
  content = content.replace(
    `className={\`px-3 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer border \${`,
    `className={\`px-2 py-1 rounded-lg text-[9px] font-extrabold flex items-center gap-1 transition-all shadow-3xs cursor-pointer border \${`
  );

  // 4. Switcher tabs
  content = content.replace(
    `<div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto border border-slate-200 no-scrollbar">`,
    `<div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto border border-slate-200 no-scrollbar">`
  );
  content = content.replace(
    `className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer \${`,
    `className={\`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer \${`
  );
  content = content.replace(
    `className={\`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer \${`,
    `className={\`relative flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer \${`
  );

  // 5. Invoice history button
  content = content.replace(
    `className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-200 transition-colors whitespace-nowrap shadow-xs cursor-pointer"`,
    `className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-200 transition-colors whitespace-nowrap shadow-xs cursor-pointer"`
  );

  // 6. Search input padding
  content = content.replace(
    `className="w-full pr-8 pl-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"`,
    `className="w-full pr-8 pl-3 py-1 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"`
  );

  // 7. Categories bar
  content = content.replace(
    `<div className="flex items-center gap-1 overflow-x-auto pb-1 border-t pt-3 border-slate-100 no-scrollbar">`,
    `<div className="flex items-center gap-1 overflow-x-auto pb-0.5 border-t pt-2 border-slate-100 no-scrollbar">`
  );
  content = content.replace(
    `className={\`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 border shadow-3xs cursor-pointer \${`,
    `className={\`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-300 border shadow-3xs cursor-pointer \${`
  );

  // 8. Cart container height & sticky
  content = content.replace(
    `className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-180px)] sticky top-20 overflow-hidden pos-cart-column hidden lg:flex"`,
    `className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-100px)] sticky top-4 overflow-hidden pos-cart-column hidden lg:flex"`
  );

  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully shortened header and made cart taller!");
} else {
  console.log("File not found!");
}
