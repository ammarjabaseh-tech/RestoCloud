const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for plans in LandingPageView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("299") || line.includes("599") || line.includes("starter") || line.includes("pro") || line.includes("باقة")) {
    if (idx > 200 && idx < 500) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
