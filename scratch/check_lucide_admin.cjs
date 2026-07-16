const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Checking Lucide Icons imports in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("lucide-react") || line.includes("import {") && line.includes("} from")) {
    if (idx < 70) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
