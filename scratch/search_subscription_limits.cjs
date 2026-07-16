const fs = require("fs");
const path = require("path");

function searchFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("subscriptionPlan") || line.includes("plan === 'starter'") || line.includes("plan === 'pro'") || line.includes("Starter") && line.includes("limit")) {
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

console.log("Searching for subscription plan limits and conditions:");
walkDir("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
