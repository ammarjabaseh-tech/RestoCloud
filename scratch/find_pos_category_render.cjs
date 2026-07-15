const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for category names rendering in POSDashboardView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("cat.nameAr") || line.includes("cat.nameEn") || line.includes("cat.nameTr")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
