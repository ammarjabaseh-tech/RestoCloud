const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("flex-1 overflow-y-auto") || line.includes("max-h-")) {
    if (idx > 900 && idx < 1300) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
      for (let i = 1; i <= 5; i++) {
        console.log(`  Line ${idx + 1 + i}: ${lines[idx + i]}`);
      }
    }
  }
});
