const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for Cover Photo Customization:");
lines.forEach((line, idx) => {
  if (line.includes("Cover Photo / Banner Customization") || line.includes("Digital Menu Cover Banner")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
