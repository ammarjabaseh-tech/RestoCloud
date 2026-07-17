const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for render inputs/images in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("<img") || line.includes("logo") && line.includes("text-") || line.includes("type=\"file\"") || line.includes("src={")) {
    if (idx > 950 && idx < 1200) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
