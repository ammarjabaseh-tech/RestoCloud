const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for image storage or upload logic in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("upload") || line.includes("writeFile") || line.includes("base64") || line.includes("fs.") || line.includes("data:image")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
