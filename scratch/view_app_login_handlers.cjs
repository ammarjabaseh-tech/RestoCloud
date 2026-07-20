const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

for (let i = 75; i < 115; i++) {
  console.log(`Line ${i + 1}: ${lines[i]}`);
}
