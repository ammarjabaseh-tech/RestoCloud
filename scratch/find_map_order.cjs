const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("function mapOrder") || line.includes("const mapOrder")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
      for (let i = 1; i <= 20; i++) {
        console.log(`  Line ${idx + 1 + i}: ${lines[idx + i]}`);
      }
    }
  });
}
