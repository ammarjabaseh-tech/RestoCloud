const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/KitchenDisplayView.tsx";
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  console.log("Searching KitchenDisplayView.tsx for category or cat references:");
  lines.forEach((line, idx) => {
    if (line.includes("category") || line.includes("cat")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log("KitchenDisplayView.tsx does not exist.");
}
