const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for inputs linked to item image or image state:");
lines.forEach((line, idx) => {
  if (line.includes("itemImage") && line.includes("value") || line.includes("image") && line.includes("input") && line.includes("type=\"text\"")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
