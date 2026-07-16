const fs = require("fs");
const path = require("path");

const componentsDir = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components";
const files = ["SaaSOnboardingModal.tsx", "SaaSAuthView.tsx", "SuperAdminDashboard.tsx"];

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("logo") || line.includes("banner") || line.includes("صورة") || line.includes("شعار") || line.includes("غلاف")) {
        console.log(`[${file} - Line ${idx + 1}]: ${line.trim()}`);
      }
    });
  }
});
