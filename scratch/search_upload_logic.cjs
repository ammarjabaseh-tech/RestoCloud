const fs = require("fs");
const path = require("path");

function searchFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("FileReader") || line.includes("readAsDataURL") || line.includes("base64") || line.includes("upload") || line.includes("file-upload")) {
      console.log(`${path.basename(filePath)} Line ${idx + 1}: ${line.trim()}`);
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

console.log("Searching for upload and base64 parsing code:");
walkDir("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
