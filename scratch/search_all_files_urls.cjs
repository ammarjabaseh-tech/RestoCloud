const fs = require("fs");
const path = require("path");

const componentsDir = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components";
const files = fs.readdirSync(componentsDir);

files.forEach(file => {
  if (file.endsWith(".tsx") || file.endsWith(".ts")) {
    const content = fs.readFileSync(path.join(componentsDir, file), "utf8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("type=\"url\"") || line.includes("type='url'") || line.includes("placeholder=\"https://") || line.includes("unsplash.com")) {
        console.log(`[${file} - Line ${idx + 1}]: ${line.trim()}`);
      }
    });
  }
});
