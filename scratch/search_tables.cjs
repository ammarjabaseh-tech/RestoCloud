const fs = require("fs");
const path = require("path");

const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for table / tables in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes("table") || line.includes("طاول")) {
    if (line.includes("btn") || line.includes("button") || line.includes("on") || line.includes("show") || line.includes("add") || line.includes("new")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
