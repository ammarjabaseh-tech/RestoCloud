const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("nav") || line.includes("header") || line.includes("logo") || line.includes("Logo") || line.includes("brand") || line.includes("Store")) {
    if (idx > 200 && idx < 350) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
