const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("setInterval") || line.includes("poll") || (line.includes("useEffect") && line.includes("Orders"))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print next 15 lines
    for (let i = 1; i <= 15; i++) {
      console.log(`  Line ${idx + 1 + i}: ${lines[idx + i]}`);
    }
  }
});
