const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching all payment submission matches in TenantLoginCheckoutView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("isProcessingPayment") || line.includes("setStep") || line.includes("handlePay") || line.includes("Payment") || line.includes("handleRegisterAndPay")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
