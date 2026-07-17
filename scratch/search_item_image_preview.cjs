const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for image previews in AdminPanelView.tsx product modal:");
lines.forEach((line, idx) => {
  if (line.includes("itemImage") && (line.includes("img") || line.includes("src="))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
