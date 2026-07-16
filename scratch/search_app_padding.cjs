const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for padding classes in App.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("max-w-") || line.includes("mx-auto") || line.includes("p-") || line.includes("px-")) {
    if (idx > 700 && idx < 950) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
