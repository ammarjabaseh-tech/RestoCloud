const fs = require("fs");
const path = require("path");

function searchFile(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchFile(fullPath);
    } else if (item.includes("setup") || item.endsWith(".sql")) {
      console.log(`Found setup/sql file: ${fullPath}`);
      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        if (line.includes("subscription_plan") || line.includes("CHECK") || line.includes("constraint")) {
          console.log(`Line ${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

searchFile("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
