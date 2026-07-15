const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for tabs or activeTab in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("activeTab") || line.includes("setActiveTab")) {
    if (line.includes("const") || line.includes("button") || line.includes("onClick")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
