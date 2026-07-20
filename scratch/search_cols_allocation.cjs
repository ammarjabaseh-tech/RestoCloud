const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("grid-cols-12") || line.includes("col-span-") || line.includes("lg:col-span-")) {
    if (idx > 1850 && idx < 2050) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
