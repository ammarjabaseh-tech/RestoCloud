const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

let startLine = -1;
let openBrackets = 0;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('posMode === "orders" && (')) {
    startLine = i + 1;
    openBrackets = 1;
    console.log(`Found start on line ${startLine}`);
  } else if (startLine !== -1 && endLine === -1) {
    // Count brackets to find the matching close
    if (line.includes("(")) openBrackets += (line.split("(").length - 1);
    if (line.includes(")")) openBrackets -= (line.split(")").length - 1);
    if (openBrackets <= 0) {
      endLine = i + 1;
      console.log(`Found end on line ${endLine}`);
      break;
    }
  }
}
