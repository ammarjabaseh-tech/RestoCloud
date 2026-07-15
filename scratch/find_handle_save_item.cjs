const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for handleSaveItem in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("handleSaveItem")) {
    // Print 30 lines starting from here
    for (let i = 0; i < 35; i++) {
      console.log(`Line ${idx + 1 + i}: ${lines[idx + i].trim()}`);
    }
  }
});
