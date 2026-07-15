const fs = require("fs");
const path = require("path");

const componentsDir = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components";
const files = fs.readdirSync(componentsDir);

console.log("Searching for add category triggers/labels:");
files.forEach((file) => {
  if (file.endsWith(".tsx")) {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("إضافة قسم") || line.includes("اضافة قسم") || line.includes("onAddCategory")) {
        console.log(`${file}:${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
