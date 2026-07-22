const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(file, "utf8");

const imported = content.includes("Bike");
console.log("Is 'Bike' in POSDashboardView.tsx?", imported);

const lines = content.split("\n");
lines.forEach((line, idx) => {
  if (line.includes("Bike")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
