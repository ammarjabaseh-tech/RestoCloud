const fs = require("fs");
const content = fs.readFileSync("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx", "utf8");
const matches = content.match(/t\.[a-zA-Z0-9_]+/g);
console.log("Accessed keys on t:", [...new Set(matches)]);
