const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for grid/flex layout in LandingPageView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("grid-cols") || line.includes("flex-row") || line.includes("md:flex") || line.includes("lg:grid")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
