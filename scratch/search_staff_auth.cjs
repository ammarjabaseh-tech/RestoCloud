const fs = require("fs");
const path = require("path");

function scan(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if (f.endsWith(".tsx") || f.endsWith(".ts") || f.endsWith(".ts") || f.endsWith("server.ts")) {
      const content = fs.readFileSync(p, "utf8");
      if (content.includes("/login") || content.includes("loginUser") || content.includes("staffLogin") || content.includes("api/login")) {
        console.log("File containing staff login endpoints:", p);
      }
    }
  });
}

scan("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
