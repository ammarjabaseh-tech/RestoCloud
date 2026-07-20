const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("kitchen_display")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
