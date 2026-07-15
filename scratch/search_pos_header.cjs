const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for header indicators in POSDashboardView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("RestaurantLogo") || line.includes("WiFi") || (idx > 900 && idx < 1050 && line.includes("flex justify-between"))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
