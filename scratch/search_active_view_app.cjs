const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for activeView state in App.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("activeView") || line.includes("setActiveView")) {
    if (idx < 100) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
