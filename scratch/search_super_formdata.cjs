const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SuperAdminDashboard.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for formData in SuperAdminDashboard.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("formData") && (line.includes("useState") || line.includes("setFormData"))) {
    if (idx < 250) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
