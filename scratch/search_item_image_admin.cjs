const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for item image input in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("newItemImage") || line.includes("image:") || (line.includes("image") && (line.includes("input") || line.includes("value")))) {
    if (idx > 200) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
