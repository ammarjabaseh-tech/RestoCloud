const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/KitchenDisplayView.tsx";
if (fs.existsSync(file)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("status") || line.includes("orderStatus") || line.includes("pending") || line.includes("preparing")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log("KitchenDisplayView.tsx does not exist!");
}
