const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("/api/auth/login") || line.includes("login") || line.includes("comparePassword")) {
    if (idx > 300 && idx < 500) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
