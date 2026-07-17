const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for logo input field rendering in TenantLoginCheckoutView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("logo") && (line.includes("input") || line.includes("value=") || line.includes("placeholder"))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
