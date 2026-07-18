const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const lines = fs.readFileSync(filePath, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("الصنف والوصف") || line.includes("الحالة والتوفير") || line.includes("هامش الربح") || line.includes("table-header")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
