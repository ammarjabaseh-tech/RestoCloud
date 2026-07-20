const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantUsersView.tsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

for (let i = 0; i < 200; i++) {
  console.log(`Line ${i + 1}: ${lines[i]}`);
}
