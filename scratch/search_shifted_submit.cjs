const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for shifted submit in DigitalMenuView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("type=\"submit\"")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    for (let j = idx - 2; j < idx + 20; j++) {
      if (lines[j]) {
        console.log(`   [${j+1}] ${lines[j]}`);
      }
    }
  }
});
