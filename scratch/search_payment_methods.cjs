const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for payment method code in POSDashboardView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("paymentMethod") || line.includes("cash") && line.includes("card") && line.includes("button")) {
    if (idx > 980 && idx < 1050) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
