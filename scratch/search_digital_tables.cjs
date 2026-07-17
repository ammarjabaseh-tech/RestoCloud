const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for table/order type selection in DigitalMenuView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("dine_in") || line.includes("orderType === \"dine_in\"") || line.includes("selectedTable") || line.includes("طاولة")) {
    if (idx > 500 && idx < 950) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
