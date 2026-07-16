const fs = require("fs");
const path = require("path");

function findFile(dir, targetName) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== "node_modules" && item !== ".git" && item !== "dist") {
        const found = findFile(fullPath, targetName);
        if (found) return found;
      }
    } else if (item.toLowerCase() === targetName.toLowerCase()) {
      return fullPath;
    }
  }
  return null;
}

console.log("Searching for database.ts or database.js:");
const result = findFile("c:/Users/ammar/OneDrive/Desktop/RestoCloud", "database.ts") || findFile("c:/Users/ammar/OneDrive/Desktop/RestoCloud", "database.js");
console.log("Found path:", result);
