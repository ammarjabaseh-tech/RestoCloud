const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("RestoCloud") || line.includes("logo") || line.includes("Logo") || line.includes("Store") || line.includes("img") || line.includes("svg")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
