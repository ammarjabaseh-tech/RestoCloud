const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("login") || line.includes("Login") || line.includes("password") || line.includes("/api/")) {
    if (idx > 460 && idx < 530) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
