const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for branding handlers or state declarations:");
lines.forEach((line, idx) => {
  if (line.includes("handleSaveBranding") || line.includes("const [logo,") || line.includes("const [bannerImage,")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
