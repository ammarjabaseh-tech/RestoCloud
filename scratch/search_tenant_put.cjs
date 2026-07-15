const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for UPDATE tenants or PUT tenants in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("UPDATE tenants") || (line.includes("put") && line.includes("tenants"))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
