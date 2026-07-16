const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for main layout grids/columns in POSDashboardView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("grid") || line.includes("col-span") || line.includes("flex-row") || line.includes("w-1/3") || line.includes("w-2/3") || line.includes("pos-menu-column") || line.includes("pos-cart-column")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
