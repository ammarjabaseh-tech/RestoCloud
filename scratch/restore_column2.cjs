const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

const target = `            </div>
            
                  <span>{lang === 'ar' ? 'اللون الأساسي للواجهات (Theme Color)' : 'Brand Color Theme'}</span>
                </h3>`;

const replacement = `            </div>
            
            {/* COLUMN 2: Branding Customizations & Previews (5 cols) */}
            <div className="lg:col-span-5 space-y-4 max-w-[380px] w-full">
              
              {/* Card 4: Brand Theme Color Selection */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span>{lang === 'ar' ? 'اللون الأساسي للواجهات (Theme Color)' : 'Brand Color Theme'}</span>
                </h3>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Successfully restored Column 2 containers!");
} else {
  console.log("Target string not found, searching with dynamic whitespaces...");
  // Let's do a regex replacement
  const regex = /<\/div>\s*<\/div>\s*<span>\{lang === 'ar' \? 'اللون الأساسي للواجهات \(Theme Color\)' : 'Brand Color Theme'\}<\/span>\s*<\/h3>/;
  if (regex.test(content)) {
    console.log("Regex matched!");
  } else {
    console.log("Regex did not match either.");
  }
}
