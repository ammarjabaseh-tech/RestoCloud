const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SaaSOnboardingModal.tsx";
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  console.log("Searching SaaSOnboardingModal.tsx for categories:");
  lines.forEach((line, idx) => {
    if (line.includes("category") || line.includes("categories") || line.includes("cat")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log("SaaSOnboardingModal.tsx does not exist.");
}
