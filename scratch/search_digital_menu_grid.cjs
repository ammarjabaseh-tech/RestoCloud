const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for grid layouts in DigitalMenuView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("grid-cols-") || line.includes("max-w-") || line.includes("mx-auto")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
