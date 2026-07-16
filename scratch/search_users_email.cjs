const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantUsersView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for email inputs in TenantUsersView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("email") || line.includes("Email")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
