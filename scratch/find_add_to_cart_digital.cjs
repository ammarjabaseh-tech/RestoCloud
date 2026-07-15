const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for addToCart calls or Cart UI in DigitalMenuView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("addToCart") || line.includes("cart.length") || line.includes("bg-indigo-600 hover:bg-indigo-500 text-white w-full py-3")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
