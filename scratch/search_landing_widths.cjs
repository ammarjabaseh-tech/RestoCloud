const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for w- classes in LandingPageView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("w-") || line.includes("max-w-") || line.includes("col-span")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
