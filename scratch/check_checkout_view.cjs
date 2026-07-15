const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx";
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, "utf8");
  console.log("TenantLoginCheckoutView.tsx exists, size:", content.length);
  // check some layout tags
  const matches = content.match(/className="[^"]*grid[^"]*"/g) || [];
  console.log("Grid classes found:", matches.slice(0, 5));
} else {
  console.log("TenantLoginCheckoutView.tsx does not exist");
}
