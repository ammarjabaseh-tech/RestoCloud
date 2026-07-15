const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Left Column (4 Cols): Cart & POS Invoice Register")) {
    startIdx = i;
  }
  if (lines[i].includes("Live Orders Management Page (orders mode only)")) {
    endIdx = i;
    break;
  }
}

console.log("Start Line:", startIdx + 1);
console.log("End Line:", endIdx + 1);

const cartLines = lines.slice(startIdx, endIdx);
console.log("First 5 lines of cart block:");
console.log(cartLines.slice(0, 5).join("\n"));
console.log("Last 5 lines of cart block:");
console.log(cartLines.slice(-5).join("\n"));
