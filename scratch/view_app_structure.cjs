const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const lines = fs.readFileSync(filePath, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("ActivePortalView") || line.includes("activePortalView") || line.includes("handleLogout") || line.includes("navbar") || line.includes("Header") || line.includes("Header") || line.includes("nav")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
