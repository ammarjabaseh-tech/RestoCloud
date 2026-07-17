const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SaaSOnboardingModal.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for logo input/label in SaaSOnboardingModal.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("handleLogoUpload") || line.includes("logo") && line.includes("span")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
