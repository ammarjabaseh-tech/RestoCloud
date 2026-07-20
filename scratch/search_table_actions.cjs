const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("status") || line.includes("TableStatus") || line.includes("busy") || line.includes("reserved") || line.includes("clean") || line.includes("updateTable")) {
    if (idx > 1650 && idx < 1850) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
