const fs = require("fs");
const path = require("path");

function scan(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
      const content = fs.readFileSync(p, "utf8");
      if (content.includes("waiter") || content.includes("Waiter")) {
        console.log("File containing 'waiter':", p);
      }
    }
  });
}

scan("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src");
