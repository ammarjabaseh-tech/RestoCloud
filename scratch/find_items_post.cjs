const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for menu_items POST/PUT in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("/items") && (line.includes("post") || line.includes("post("))) {
    // Print 15 lines from here
    for (let i = 0; i < 20; i++) {
      console.log(`Line ${idx + 1 + i}: ${lines[idx + i].trim()}`);
    }
  }
});
