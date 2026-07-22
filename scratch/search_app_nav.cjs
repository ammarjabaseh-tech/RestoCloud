const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

lines.forEach((line, idx) => {
  if (line.includes("digital_menu") || line.includes("kitchen") || line.includes("admin_panel") || line.includes("pos_dashboard") || line.includes("nav") || line.includes("Header")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
