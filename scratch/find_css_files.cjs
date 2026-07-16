const fs = require("fs");
const path = require("path");

function findFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== "node_modules" && item !== ".git" && item !== "dist") {
        results = results.concat(findFiles(fullPath, ext));
      }
    } else if (item.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

console.log("CSS files:");
console.log(findFiles("c:/Users/ammar/OneDrive/Desktop/RestoCloud", ".css"));
