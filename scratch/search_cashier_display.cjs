const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

console.log("=== Searching for cashierName / cashier_name / cashName references ===");
walkDir("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src", (filePath) => {
  if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("cashierName") || line.includes("cashier_name") || line.includes("الويتر")) {
        console.log(`${path.basename(filePath)}:${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
