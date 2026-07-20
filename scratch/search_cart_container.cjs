const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("renderCart") || line.includes("lg:col-span-8") || line.includes("lg:col-span-4") || line.includes("lg:col-span-3")) {
    if (idx > 2000 && idx < 2250) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
