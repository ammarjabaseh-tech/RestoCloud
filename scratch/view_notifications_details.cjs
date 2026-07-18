const fs = require("fs");

const files = [
  "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/KitchenDisplayView.tsx",
  "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx",
  "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx"
];

files.forEach(file => {
  console.log("=== FILE:", file, "===");
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("audio") || line.includes("Audio") || line.includes("toast") || line.includes("play(") || line.includes("sound") || line.includes("bell")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
});
