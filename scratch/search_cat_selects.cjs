const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for categories SELECT queries in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("FROM categories") && line.includes("SELECT")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
