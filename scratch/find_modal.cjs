const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const lines = fs.readFileSync(filePath, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("إضافة طبق") || line.includes("showAdd") || line.includes("modal") || line.includes("add-dish")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
