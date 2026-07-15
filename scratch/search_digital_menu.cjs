const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for main structure in DigitalMenuView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("export const DigitalMenu") || line.includes("export default function") || (idx > 100 && idx < 200 && line.includes("return ("))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
