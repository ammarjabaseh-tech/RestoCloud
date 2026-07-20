const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("<POSDashboardView")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print next 10 lines
    for (let i = 1; i <= 20; i++) {
      console.log(`  Line ${idx + 1 + i}: ${lines[idx + i]}`);
    }
  }
});
