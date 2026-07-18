const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for tenants route / queries in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("UPDATE tenants") || line.includes("put(\"/api/tenants") || line.includes("patch(\"/api/tenants")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    for (let j = idx - 2; j < idx + 20; j++) {
      if (lines[j]) {
        console.log(`   [${j+1}] ${lines[j]}`);
      }
    }
  }
});
