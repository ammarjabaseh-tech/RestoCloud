const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("INSERT INTO orders") || line.includes("order_status")) {
    if (idx > 750 && idx < 950) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
