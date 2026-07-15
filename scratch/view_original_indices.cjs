const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

let startIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Left Column (4 Cols): Cart & POS Invoice Register")) {
    startIdx = i;
    break;
  }
}

console.log("startIdx:", startIdx);
for (let j = 0; j < 35; j++) {
  const lineIdx = startIdx + 3 + j;
  console.log(`cartBodyLines[${j}] (line ${lineIdx + 1}): ${lines[lineIdx]}`);
}
