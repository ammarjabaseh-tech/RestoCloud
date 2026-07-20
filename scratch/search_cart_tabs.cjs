const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

for (let i = 1000; i < 1045; i++) {
  console.log(`Line ${i + 1}: ${lines[i]}`);
}
