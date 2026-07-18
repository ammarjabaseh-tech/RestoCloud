const fs = require("fs");
const path = require("path");

function searchFile(dir, file) {
  const full = path.join(dir, file);
  if (!fs.existsSync(full)) return;
  const content = fs.readFileSync(full, "utf8");
  if (content.includes("interface Tenant") || content.includes("type Tenant =")) {
    console.log("Found Tenant definition in:", full);
  }
}

// Search in src/types/ or src/
const srcDir = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src";
if (fs.existsSync(srcDir)) {
  fs.readdirSync(srcDir).forEach(f => {
    if (f.endsWith(".ts") || f.endsWith(".tsx")) searchFile(srcDir, f);
  });
  const typesDir = path.join(srcDir, "types");
  if (fs.existsSync(typesDir)) {
    fs.readdirSync(typesDir).forEach(f => {
      if (f.endsWith(".ts") || f.endsWith(".tsx")) searchFile(typesDir, f);
    });
  }
}
