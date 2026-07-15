const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";

// First revert to HEAD
require("child_process").execSync("node scratch/git_revert.cjs");

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

const cartBodyLines = lines.slice(startIdx + 3, endIdx - 2);
console.log("=== End of cartBodyLines ===");
for (let j = cartBodyLines.length - 15; j < cartBodyLines.length; j++) {
  console.log(`cartBodyLines[${j}] (line ${startIdx + 3 + j + 1}): ${cartBodyLines[j]}`);
}
