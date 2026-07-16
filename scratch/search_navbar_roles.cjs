const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/Navbar.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for role and permission checks in Navbar.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("role") || line.includes("permission") || line.includes("canManage") || line.includes("canView")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
