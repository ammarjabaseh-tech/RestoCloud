const fs = require("fs");
const path = require("path");

function scan(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (f === "public" || f === "assets" || f === "images" || f === "img") {
        console.log("Assets directory found:", p);
        console.log("Contents:", fs.readdirSync(p));
      } else {
        scan(p);
      }
    }
  });
}

scan("c:/Users/ammar/OneDrive/Desktop/RestoCloud");
