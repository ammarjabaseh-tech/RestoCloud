const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SaaSOnboardingModal.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for email inputs in SaaSOnboardingModal.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("email") || line.includes("Email") || line.includes("البريد") || line.includes("الإيميل")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
