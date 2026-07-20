const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("login") || line.includes("auth")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
