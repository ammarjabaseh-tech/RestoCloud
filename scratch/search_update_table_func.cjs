const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for handleUpdateTable definition in App.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("const handleUpdateTable") || line.includes("function handleUpdateTable")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
