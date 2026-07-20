const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

for (let i = 2120; i < 2270; i++) {
  console.log(`Line ${i + 1}: ${lines[i]}`);
}
