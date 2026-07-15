const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for categories table initialization:");
lines.forEach((line, idx) => {
  if (line.includes("categories") && line.includes("CREATE TABLE")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  } else if (line.includes("CREATE TABLE") && lines[idx+1] && lines[idx+1].includes("categories")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    console.log(`Line ${idx + 2}: ${lines[idx+1].trim()}`);
  }
});
