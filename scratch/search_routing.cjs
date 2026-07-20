const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

lines.forEach((line, idx) => {
  if (line.includes("renderWaiterView") || line.includes("currentUser?.role") || line.includes("return (")) {
    if (idx > 1300 && idx < 1700) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
