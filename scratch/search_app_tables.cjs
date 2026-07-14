const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for Table in App.tsx:");
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes("table") && (line.includes("handle") || line.includes("add") || line.includes("delete") || line.includes("update") || line.includes("fetch"))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
