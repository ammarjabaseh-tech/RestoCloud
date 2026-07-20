const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes('app.post("/api/tenants/:tenantId/orders"') || line.includes('app.post("/api/tenants/:tenantId/orders')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    for (let i = 1; i <= 35; i++) {
      console.log(`  Line ${idx + 1 + i}: ${lines[idx + i]}`);
    }
  }
});
