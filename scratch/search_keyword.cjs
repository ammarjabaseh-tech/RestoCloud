const fs = require("fs");
const path = require("path");

const keywords = ["multer", "file.name", "fileName", "filename", "upload", "base64", "fs.writeFile"];

function searchFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    keywords.forEach(keyword => {
      if (line.toLowerCase().includes(keyword.toLowerCase())) {
        if (!line.includes("node_modules") && !line.includes("scratch")) {
          console.log(`${path.basename(filePath)} Line ${idx + 1} [keyword: ${keyword}]: ${line.trim()}`);
        }
      }
    });
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
    } else if (item.endsWith(".tsx") || item.endsWith(".ts") || item.endsWith(".cjs") || item.endsWith(".js")) {
      searchFile(fullPath);
    }
  }
}

console.log("Searching for keywords in all files:");
walkDir("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
