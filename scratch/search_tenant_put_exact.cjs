const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for PUT tenant endpoints:");
lines.forEach((line, idx) => {
  if (line.includes("app.put") && line.includes("/api/tenants/:id")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print 50 lines
    for (let j = idx; j < idx + 50; j++) {
      console.log(`   [${j+1}] ${lines[j]}`);
    }
  }
});
