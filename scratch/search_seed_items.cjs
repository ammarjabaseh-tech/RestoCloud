const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/db/seed.sql";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for menu items inserts in seed.sql:");
lines.forEach((line, idx) => {
  if (line.includes("INSERT INTO menu_items") || line.includes("menu_items (")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print next 20 lines
    for (let j = idx; j < idx + 25; j++) {
      if (lines[j]) {
        console.log(`   [${j+1}] ${lines[j].trim()}`);
      }
    }
  }
});
