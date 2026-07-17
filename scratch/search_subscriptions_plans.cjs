const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SaaSSubscriptionsView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for plans in SaaSSubscriptionsView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("starter") || line.includes("pro") || line.includes("plan")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
