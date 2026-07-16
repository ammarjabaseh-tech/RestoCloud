const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for view toggle buttons in POSDashboardView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("الكاشير") && line.includes("قائمة") || line.includes("showOrders") || line.includes("orders-dashboard")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
