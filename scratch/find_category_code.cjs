const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for category modal/saving in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("Category") || line.includes("category") || line.includes("catName")) {
    if (line.includes("onSubmit") || line.includes("handleAdd") || line.includes("handleSave") || line.includes("onAdd") || line.includes("Modal")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
