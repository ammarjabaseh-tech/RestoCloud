const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("toast") || line.includes("message") || line.includes("alert") || line.includes("Toast") || line.includes("Notification")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
