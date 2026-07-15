const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");

// Search for language translation usage
const hasTranslations = content.includes("posTranslations[lang]");
const hasEnglishName = content.includes("item.nameEn") || content.includes("cat.nameEn");

console.log("=== Translations Check in Clean POS ===");
console.log("Has posTranslations[lang]:", hasTranslations);
console.log("Has item/cat nameEn:", hasEnglishName);
