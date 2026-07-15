const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for return in DigitalMenuView.tsx:");
let count = 0;
lines.forEach((line, idx) => {
  if (idx > 260 && line.trim().startsWith("return (")) {
    count++;
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
