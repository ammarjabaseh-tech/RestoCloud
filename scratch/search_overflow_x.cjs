const fs = require("fs");
const path = require("path");

const componentsDir = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components";
const files = fs.readdirSync(componentsDir);

files.forEach((file) => {
  if (file.endsWith(".tsx")) {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("overflow-x-auto") && !line.includes("no-scrollbar")) {
        console.log(`${file}:${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
