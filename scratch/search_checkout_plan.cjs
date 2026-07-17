const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for selectedPlan in TenantLoginCheckoutView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("selectedPlan") || line.includes("plan") && line.includes("amount")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
