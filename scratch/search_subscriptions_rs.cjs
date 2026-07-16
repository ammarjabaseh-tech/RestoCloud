const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SaaSSubscriptionsView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for ر.س in SaaSSubscriptionsView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("ر.س") || line.includes("ريال")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
