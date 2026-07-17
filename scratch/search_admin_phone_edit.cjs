const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for phone editing inputs in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("phone") || line.includes("رقم الهاتف")) {
    if (idx > 500) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
