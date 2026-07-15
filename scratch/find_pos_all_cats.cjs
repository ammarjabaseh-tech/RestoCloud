const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for category or cat references in POSDashboardView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("category") || line.includes("cat")) {
    if (line.includes("name") || line.includes("Name") || line.includes("title") || line.includes("Title")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
