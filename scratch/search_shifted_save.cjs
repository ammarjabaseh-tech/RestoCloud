const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for phone saving in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("phone,") || line.includes("phone:") || line.includes("updated: Tenant")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    for (let j = idx - 2; j < idx + 10; j++) {
      if (lines[j]) {
        console.log(`   [${j+1}] ${lines[j]}`);
      }
    }
  }
});
