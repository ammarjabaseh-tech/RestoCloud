const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SaaSAuthView.tsx";
if (fs.existsSync(file)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("role") || line.includes("login") || line.includes("waiter") || line.includes("kitchen")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log("SaaSAuthView.tsx does not exist!");
}
