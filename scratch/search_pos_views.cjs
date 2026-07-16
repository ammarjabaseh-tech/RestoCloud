const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for state variables and tabs in POSDashboardView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("const [") && (line.includes("Tab") || line.includes("View") || line.includes("show") || line.includes("selected"))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
