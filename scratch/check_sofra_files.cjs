const fs = require("fs");
const path = require("path");

const sofraDir = "c:/Users/ammar/OneDrive/Desktop/سفرة-كلاود";
console.log("Does Sofra dir exist:", fs.existsSync(sofraDir));

if (fs.existsSync(sofraDir)) {
  const navbarFile = path.join(sofraDir, "src/components/Navbar.tsx");
  const posFile = path.join(sofraDir, "src/components/POSDashboardView.tsx");
  
  if (fs.existsSync(navbarFile)) {
    const content = fs.readFileSync(navbarFile, "utf8");
    console.log("Sofra Navbar has waiter code:", content.includes("role === \"waiter\""));
  } else {
    console.log("Sofra Navbar.tsx does not exist!");
  }

  if (fs.existsSync(posFile)) {
    const content = fs.readFileSync(posFile, "utf8");
    console.log("Sofra POSDashboardView has waiter code:", content.includes("role === \"waiter\""));
  } else {
    console.log("Sofra POSDashboardView.tsx does not exist!");
  }
}
