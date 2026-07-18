const fs = require("fs");

const files = [
  "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx",
  "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/KitchenDisplayView.tsx"
];

files.forEach(file => {
  console.log("=== FILE:", file, "===");
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("fetch") || line.includes("axios") || line.includes("useEffect") || line.includes("interval") || line.includes("poll") || line.includes("orders")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
});
