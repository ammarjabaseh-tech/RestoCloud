const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for deferred translation key:");
lines.forEach((line, idx) => {
  if (line.includes("deferred:") || line.includes("cash:") || line.includes("card:")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
