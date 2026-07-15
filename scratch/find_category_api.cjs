const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for category POST/PUT in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("/categories") && (line.includes("post") || line.includes("post(") || line.includes("put") || line.includes("put("))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
