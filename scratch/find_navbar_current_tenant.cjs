const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/Navbar.tsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

lines.forEach((line, idx) => {
  if (line.includes("currentTenant.") && !line.includes("currentTenant?.")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
