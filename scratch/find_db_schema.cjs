const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for CREATE TABLE categories in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("CREATE TABLE") && line.includes("categories")) {
    // Print 10 lines starting from here
    for (let i = 0; i < 15; i++) {
      console.log(`Line ${idx + 1 + i}: ${lines[idx + i].trim()}`);
    }
  }
});
