const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for tables map in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("tables.map")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
