const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("orders") || line.includes("Order") || line.includes("createOrder") || line.includes("socket") || line.includes("interval") || line.includes("poll")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
