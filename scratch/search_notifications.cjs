const fs = require("fs");
const path = require("path");

function scan(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
      const content = fs.readFileSync(p, "utf8");
      if (content.includes("audio") || content.includes("Audio") || content.includes("toast") || content.includes("notification") || content.includes("bell") || content.includes("bell-sfx") || content.includes("sound")) {
        console.log("File with notification/sound logic:", p);
      }
    }
  });
}

scan("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src");
