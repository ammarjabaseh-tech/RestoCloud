const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/Navbar.tsx";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");

  // Replace all unsafe currentTenant. accesses
  content = content.replace(/currentTenant\.themeColor/g, "currentTenant?.themeColor || 'indigo'");
  content = content.replace(/currentTenant\.subdomain/g, "currentTenant?.subdomain || ''");
  content = content.replace(/currentTenant\.logo/g, "currentTenant?.logo");
  content = content.replace(/currentTenant\.nameAr/g, "currentTenant?.nameAr || ''");
  content = content.replace(/currentTenant\.id/g, "currentTenant?.id");

  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully updated Navbar.tsx with optional chaining!");
} else {
  console.error("File not found!");
}
