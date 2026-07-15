const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");

const startIdx = content.indexOf("const renderCart =");
const endIdx = content.indexOf("grid grid-cols-1 lg:grid-cols-12");
const renderCartText = content.substring(startIdx, endIdx);

const lines = renderCartText.split("\n");
let depth = 0;
lines.forEach((line, idx) => {
  const opens = (line.match(/<div\b/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  depth += opens - closes;
  if (opens > 0 || closes > 0) {
    console.log(`Line ${idx + 1} (depth ${depth}): ${line.trim()}`);
  }
});
