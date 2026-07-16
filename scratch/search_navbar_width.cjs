const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/Navbar.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for width and layout classes in Navbar.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("max-w-") || line.includes("w-") || line.includes("mx-") || line.includes("px-")) {
    if (idx < 220) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
