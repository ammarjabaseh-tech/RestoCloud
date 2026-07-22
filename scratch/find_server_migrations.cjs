const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";

if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("pool.query") || line.includes("migrat") || line.includes("ALTER TABLE")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
}
