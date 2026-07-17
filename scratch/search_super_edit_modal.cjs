const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SuperAdminDashboard.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for Edit Tenant fields in SuperAdminDashboard.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("showEditModal") || line.includes("تعديل مطعم") || line.includes("subscriptionPlan") && idx > 800) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
