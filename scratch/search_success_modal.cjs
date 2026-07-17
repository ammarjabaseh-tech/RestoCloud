const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for orderSuccessNumber references in DigitalMenuView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("orderSuccessNumber")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
