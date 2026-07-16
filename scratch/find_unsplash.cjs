const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Checking all unsplash links or URL references in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("unsplash.com") || line.includes("https://images.unsplash.com") || line.includes("placeholder")) {
    if (line.includes("url") || line.includes("image") || line.includes("photo") || line.includes("icon") || line.includes("logo") || line.includes("banner")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
