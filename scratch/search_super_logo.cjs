const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SuperAdminDashboard.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for logo in SuperAdminDashboard.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("logo") || line.includes("Logo")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
