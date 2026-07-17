const fs = require("fs");
const path = require("path");

function searchFile(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== "node_modules" && item !== ".git" && item !== "dist") {
        searchFile(fullPath);
      }
    } else if (item.endsWith(".ts") || item.endsWith(".sql") || item.endsWith(".js")) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("CHECK (subscription_plan") || content.includes("CHECK (plan IN")) {
        console.log(`Match in file: ${fullPath}`);
      }
    }
  }
}

searchFile("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
