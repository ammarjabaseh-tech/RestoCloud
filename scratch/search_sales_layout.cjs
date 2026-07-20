const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes('posMode === "sales"') || line.includes("posMode === 'sales'")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print next 20 lines
    for (let i = 1; i <= 25; i++) {
      console.log(`  Line ${idx + 1 + i}: ${lines[idx + i]}`);
    }
  }
});
