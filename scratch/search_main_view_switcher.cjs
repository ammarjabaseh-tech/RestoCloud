const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for view switching buttons in App.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("setActiveView") && (line.includes("pos") || line.includes("kds") || line.includes("admin") || line.includes("button"))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
