const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("tables.map") || line.includes("tableId") || line.includes("tableNumber")) {
    if (idx > 1000 && idx < 2000) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
