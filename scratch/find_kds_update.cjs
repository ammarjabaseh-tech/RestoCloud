const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/KitchenDisplayView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("status") || line.includes("orderStatus") || line.includes("PUT") || line.includes("update") || line.includes("ready") || line.includes("Ready")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
