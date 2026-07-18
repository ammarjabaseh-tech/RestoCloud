const fs = require("fs");
const path = require("path");

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanDir(full);
    } else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
      const content = fs.readFileSync(full, "utf8");
      if (content.includes("Landing") || content.includes("marketing") || content.includes("لاندينج") || content.includes("سفرة كلاود")) {
        console.log("Potential Marketing/Landing file:", full);
      }
    }
  });
}

scanDir("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src");
