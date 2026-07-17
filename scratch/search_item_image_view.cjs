const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for item image input and render in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("handleItemImageUpload") || line.includes("itemImage") || line.includes("image") && line.includes("input") || line.includes("FileReader") && line.includes("image")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
