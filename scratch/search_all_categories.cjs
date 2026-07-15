const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for CREATE TABLE or categories table in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("CREATE TABLE") || line.includes("categories (") || line.includes("categories(")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
