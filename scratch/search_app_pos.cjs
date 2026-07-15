const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  console.log("Searching for POSDashboardView usage in App.tsx:");
  lines.forEach((line, idx) => {
    if (line.includes("POSDashboardView") || line.includes("POSDashboard")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log("App.tsx does not exist");
}
