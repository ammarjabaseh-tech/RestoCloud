const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");

  // Replace all invalid indigo/emerald colors
  content = content.split("indigo-650").join("indigo-600");
  content = content.split("emerald-650").join("emerald-600");

  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully fixed all invalid color classes!");
} else {
  console.log("File not found!");
}
