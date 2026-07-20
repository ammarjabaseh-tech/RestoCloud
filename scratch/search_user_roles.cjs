const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantUsersView.tsx";
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("role") || line.includes("waiter") || line.includes("cashier") || line.includes("admin")) {
      if (idx < 150) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    }
  });
} else {
  console.log("TenantUsersView.tsx not found");
}
