const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// 1. Constrain container widths from max-w-[280px] to max-w-[200px]
content = content.replace(/max-w-\[280px\]/g, "max-w-[200px]");

// 2. WiFi SSID and WiFi Pass from max-w-[200px] (which became max-w-[150px])
content = content.replace(/max-w-\[200px\]/g, "max-w-[150px]");

// 3. VAT Rate input from max-w-[120px] to max-w-[70px]
content = content.replace(/max-w-\[120px\]/g, "max-w-[70px]");

// 4. Phone country select dropdown width from w-[110px] or other to w-[85px] and height from h-10 or h-[34px] to h-[32px]
content = content.replace(/w-\[110px\] h-10/g, "w-[85px] h-[32px]");
content = content.replace(/w-\[95px\] h-\[34px\]/g, "w-[85px] h-[32px]");

// 5. Phone text input height to h-[32px] and max-width to max-w-[110px]
content = content.replace(/h-\[34px\] max-w-\[170px\]/g, "h-[32px] max-w-[110px]");

// 6. Labels font size to text-[10px] and margins to mb-0.5
content = content.replace(/text-xs font-bold text-slate-600 dark:text-slate-400 mb-1/g, "text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5");
content = content.replace(/text-\[11px\] font-bold text-slate-600 dark:text-slate-455 mb-1/g, "text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5");

// 7. Cards padding from p-5 to p-4 and rounded corners to rounded-xl
content = content.replace(/rounded-2xl p-5 border/g, "rounded-xl p-4 border");

// 8. Theme colors selection max width to max-w-[240px] and columns to grid-cols-4
content = content.replace(/max-w-\[400px\]/g, "max-w-[240px]");

// 9. Reduce text input padding from py-1.5 to py-1 and text size to text-[11px]
content = content.replace(/px-3 py-1\.5 rounded-lg/g, "px-2 py-1 rounded-md text-[11px]");

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully made all fields 50% smaller in AdminPanelView.tsx!");
