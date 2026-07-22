const fs = require("fs");

console.log("Checking installed packages...");
const pkg = require("c:/Users/ammar/OneDrive/Desktop/RestoCloud/package.json");
console.log("Dependencies:", Object.keys(pkg.dependencies || {}));
console.log("DevDependencies:", Object.keys(pkg.devDependencies || {}));
