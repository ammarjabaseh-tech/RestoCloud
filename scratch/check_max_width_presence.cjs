const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Checking for max-w- in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("max-w-")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
