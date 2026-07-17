const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for [phone state in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("const [phone") || line.includes("useState(tenant.phone")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
