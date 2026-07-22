const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

lines.forEach((line, idx) => {
  if (line.includes("LandingPage") || line.includes("landing_page")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
