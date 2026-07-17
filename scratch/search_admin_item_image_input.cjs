const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for image fields inside modals in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("image") && (line.includes("input") || line.includes("type") || line.includes("label"))) {
    if (idx > 1200 && idx < 2200) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
