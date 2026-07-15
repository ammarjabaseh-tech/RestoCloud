const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for CREATE TABLE inside server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("CREATE TABLE")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print subsequent lines until we hit a semicolon
    let curr = idx + 1;
    while (curr < lines.length && !lines[curr - 1].includes(";")) {
      console.log(`  Line ${curr + 1}: ${lines[curr].trim()}`);
      curr++;
    }
  }
});
