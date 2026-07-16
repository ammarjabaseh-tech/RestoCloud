const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for POST orders endpoint in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("app.post") && line.includes("orders")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
