const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for pricing math in TenantLoginCheckoutView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("currentPlanObj") || line.includes("vatAmount") || line.includes("totalWithVat") || line.includes("1.15") || line.includes("0.15")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
