const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

console.log("--- Block 1 (Line 770-785) ---");
for (let i = 769; i < 785; i++) {
  console.log(`Line ${i+1}: ${lines[i]}`);
}

console.log("--- Block 2 (Line 825-845) ---");
for (let i = 824; i < 845; i++) {
  console.log(`Line ${i+1}: ${lines[i]}`);
}

console.log("--- Block 3 (Line 895-915) ---");
for (let i = 894; i < 915; i++) {
  console.log(`Line ${i+1}: ${lines[i]}`);
}
