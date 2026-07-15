const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(filePath, "utf8");

const startIdx = content.indexOf("const renderCart =");
const endIdx = content.indexOf("grid grid-cols-1 lg:grid-cols-12");

const renderCartText = content.substring(startIdx, endIdx);

// Count <div and </div>
const openDivs = (renderCartText.match(/<div\b/g) || []).length;
const closeDivs = (renderCartText.match(/<\/div>/g) || []).length;

console.log("=== renderCart Div Count ===");
console.log("Open <div>:", openDivs);
console.log("Close </div>:", closeDivs);
console.log("Difference:", openDivs - closeDivs);
