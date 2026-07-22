const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

lines.forEach((line, idx) => {
  if (line.includes("handleLogout") || line.includes("localStorage.setItem") || line.includes("localStorage.removeItem")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
