const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for category modal fields in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("newCatIcon") || line.includes("setNewCatIcon") || (idx > 1750 && idx < 1850 && line.includes("icon"))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
