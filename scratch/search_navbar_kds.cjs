const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/Navbar.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("kitchen") || line.includes("KDS") || line.includes("kitchen_display") || line.includes("activeView")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
