const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for payment submission and verification in TenantLoginCheckoutView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("isProcessingPayment") || line.includes("handleSubmit") || line.includes("fetch") && line.includes("tenants") || line.includes("checkout")) {
    if (idx > 400 && idx < 500) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
