const fs = require("fs");
const path = require("path");

function scan(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if (f.toLowerCase().includes("navbar")) {
      console.log("Navbar file found:", p);
    }
  });
}

scan("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src");
