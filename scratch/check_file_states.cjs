const fs = require("fs");

const navbarFile = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/Navbar.tsx";
const posFile = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";

if (fs.existsSync(navbarFile)) {
  const content = fs.readFileSync(navbarFile, "utf8");
  console.log("Navbar has waiter code:", content.includes("role === \"waiter\""));
} else {
  console.log("Navbar.tsx does not exist!");
}

if (fs.existsSync(posFile)) {
  const content = fs.readFileSync(posFile, "utf8");
  console.log("POSDashboardView has waiter code:", content.includes("role === \"waiter\""));
} else {
  console.log("POSDashboardView.tsx does not exist!");
}
