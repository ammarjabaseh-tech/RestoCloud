const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching all occurrences of image inputs in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("image") || line.includes("صورة") || line.includes("رابط الصورة")) {
    if (line.includes("input") || line.includes("label") || line.includes("onChange")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
