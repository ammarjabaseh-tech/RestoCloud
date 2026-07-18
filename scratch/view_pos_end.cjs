const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

console.log("Total lines:", lines.length);
for (let i = lines.length - 100; i < lines.length; i++) {
  console.log(`Line ${i + 1}: ${lines[i]}`);
}
