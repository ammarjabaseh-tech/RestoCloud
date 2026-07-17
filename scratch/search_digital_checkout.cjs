const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for order/checkout hooks in DigitalMenuView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("checkout") || line.includes("Order") || line.includes("submit") || line.includes("طلب")) {
    if (idx > 250 && idx < 750) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
