const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for fetch(/api/tenants) in TenantLoginCheckoutView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("fetch") && line.includes("tenants")) {
    // Print 15 lines from here
    for (let i = 0; i < 15; i++) {
      console.log(`Line ${idx + 1 + i}: ${lines[idx + i].trim()}`);
    }
  }
});
