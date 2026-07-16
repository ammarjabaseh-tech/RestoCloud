const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/Navbar.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for kitchen display in Navbar.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("kitchen") || line.includes("Kitchen")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
