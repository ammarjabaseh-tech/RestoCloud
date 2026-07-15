const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for categories.map in POSDashboardView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("categories.map")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
