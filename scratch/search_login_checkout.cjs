const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("LoginSuccess") || line.includes("onLogin") || line.includes("onSubmit") || line.includes("login") || line.includes("fetch")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
