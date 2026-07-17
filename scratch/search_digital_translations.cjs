const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for translations in DigitalMenuView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("translations =") || line.includes("translations: ") || line.includes("sendOrder")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
