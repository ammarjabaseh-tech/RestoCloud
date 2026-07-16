const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/types.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for RestaurantTable in types.ts:");
lines.forEach((line, idx) => {
  if (line.includes("RestaurantTable") || (idx > 70 && idx < 95)) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
