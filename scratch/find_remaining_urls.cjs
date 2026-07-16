const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Checking all remaining inputs with type='url' or image links:");
lines.forEach((line, idx) => {
  if (line.includes("type=\"url\"") || line.includes("type='url'") || line.includes("placeholder=\"https://") || line.includes("Image URL") || line.includes("رابط صورة") || line.includes("رابط الصورة")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
