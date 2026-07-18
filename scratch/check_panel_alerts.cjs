const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("alert(") || line.includes("toast(")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
