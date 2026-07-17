const fs = require("fs");
const path = require("path");

function searchFile(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchFile(fullPath);
    } else if (item.includes("Navbar.tsx")) {
      console.log(`Found: ${fullPath}`);
      console.log(fs.readFileSync(fullPath, "utf8"));
    }
  }
}

searchFile("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
