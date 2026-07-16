const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for lucide-react imports in POSDashboardView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("lucide-react") || line.includes("import {") && line.includes("} from")) {
    if (idx < 50) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
