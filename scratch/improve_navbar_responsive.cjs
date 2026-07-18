const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/Navbar.tsx";
let content = fs.readFileSync(filePath, "utf8");

// 1. Remove h-13 restriction and allow responsive columns
content = content.replace(
  '<div className="flex items-center justify-between h-13">',
  '<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-3 min-h-[64px]">'
);

// 2. Center the navigation tabs and add lg:inline to labels so text displays only on large desktop screens
// Replace all <span className="hidden sm:inline"> inside navigation buttons to be hidden lg:inline
// POS Tab text:
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].pos}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].pos}</span>'
);
// Admin Tab text:
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].admin}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].admin}</span>'
);
// Menu Tab text:
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].menu}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].menu}</span>'
);
// AI Tab text:
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].ai}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].ai}</span>'
);
// KDS Tab text:
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].kds}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].kds}</span>'
);

// SaaS onboarding texts:
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].saasOnboard}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].saasOnboard}</span>'
);
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].saasPortal}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].saasPortal}</span>'
);
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].saasSubs}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].saasSubs}</span>'
);
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].postgres}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].postgres}</span>'
);

// Logout button text:
content = content.replace(
  '<span className="hidden sm:inline">{navTranslations[lang].logout}</span>',
  '<span className="hidden lg:inline">{navTranslations[lang].logout}</span>'
);

// Language selector text:
content = content.replace(
  '<span className="hidden sm:inline">\n                  {lang === \'ar\' ? \'🇸🇦 العربية\' : lang === \'tr\' ? \'🇹🇷 Türkçe\' : \'🇬🇧 English\'}\n                </span>',
  '<span className="hidden lg:inline">\n                  {lang === \'ar\' ? \'🇸🇦 العربية\' : lang === \'tr\' ? \'🇹🇷 Türkçe\' : \'🇬🇧 English\'}\n                </span>'
);

// 3. Make subdomain link look like a clean round pill badge
const oldSubdomainLink = `className="text-[9px] bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded text-indigo-700 hover:text-indigo-900 font-bold font-mono border border-indigo-200 transition-all shadow-3xs flex items-center gap-0.5"
                    title="فتح المنيو الرقمي للزبائن"
                  >
                    <span className="hidden md:inline">🔗 {currentTenant.subdomain}.resto-cloud.com</span>
                    <span className="hidden sm:inline md:hidden">🔗 {currentTenant.subdomain}</span>
                    <span className="sm:hidden">🔗</span>`;

const newSubdomainLink = `className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-200/50 transition-colors shadow-3xs"
                    title="فتح المنيو الرقمي للزبائن"
                  >
                    <span className="hidden md:inline">{currentTenant.subdomain}.resto-cloud.com</span>
                    <span className="hidden sm:inline md:hidden">{currentTenant.subdomain}</span>
                    <span className="sm:hidden">🔗</span>
                    <span className="hidden sm:inline text-[9px]">🔗</span>`;

// Replace all occurrences of subdomain links (both logged in and guest guest view switcher)
content = content.replace(oldSubdomainLink, newSubdomainLink);
content = content.replace(oldSubdomainLink, newSubdomainLink); // Apply twice to catch both instances

// Center the navigation tabs container on md and lg screens
content = content.replace(
  '<nav className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">',
  '<nav className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar justify-center flex-wrap max-w-full lg:max-w-2xl lg:mx-auto">'
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully improved Navbar responsiveness and layout!");
