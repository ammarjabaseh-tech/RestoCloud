const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("fetchTenantData") || line.includes("tables") && line.includes("fetch")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    for (let i = 1; i <= 15; i++) {
      console.log(`  Line ${idx + 1 + i}: ${lines[idx + i]}`);
    }
  }
});
