const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantUsersView.tsx";
if (fs.existsSync(file)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("waiter") || line.includes("permissions") || line.includes("canManagePOS")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log("TenantUsersView.tsx does not exist!");
}
