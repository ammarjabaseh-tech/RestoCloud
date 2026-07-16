const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for table api routes in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("/tables") || line.includes("app.put") && line.includes("tables")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
