const fs = require("fs");
const path = require("path");

function searchFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes('type="file"') || line.includes("type='file'")) {
      console.log(`${path.basename(filePath)} Line ${idx + 1}: ${line.trim()}`);
      // Show surrounding 5 lines
      for (let j = Math.max(0, idx - 3); j <= Math.min(lines.length - 1, idx + 5); j++) {
        console.log(`   [${j+1}] ${lines[j]}`);
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

console.log("Searching for all file inputs:");
walkDir("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
