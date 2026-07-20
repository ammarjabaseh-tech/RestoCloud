const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

lines.forEach((line, idx) => {
  if (line.includes("tenantUsers") || line.includes("users") || line.includes("staff")) {
    if (line.includes("const ") || line.includes("let ") || line.includes("useState")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
