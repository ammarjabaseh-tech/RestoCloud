const fs = require("fs");
const path = require("path");

function searchFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    // Matches w-[500px], w-[800px], min-w-[600px], etc.
    const match = line.match(/(w|min-w)-\[(\d+)px\]/);
    if (match) {
      const widthVal = parseInt(match[2], 10);
      if (widthVal > 350) {
        console.log(`${path.basename(filePath)} Line ${idx + 1}: ${line.trim()}`);
      }
    }
  });
}

function walkDir(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== "node_modules" && item !== ".git" && item !== "dist") {
        walkDir(fullPath);
      }
    } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
      searchFile(fullPath);
    }
  }
}

console.log("Searching for wide hardcoded pixel widths in TSX/TS files:");
walkDir("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
