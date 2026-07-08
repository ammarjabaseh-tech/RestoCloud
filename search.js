const fs = require("fs");
const path = require("path");

function searchFile(filePath, query) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(query.toLowerCase())) {
      console.log(`${path.basename(filePath)}:${idx + 1}: ${line.trim()}`);
    }
  });
}

const files = [
  "src/components/POSDashboardView.tsx",
  "src/components/DigitalMenuView.tsx",
  "src/components/KitchenDisplayView.tsx",
  "src/App.tsx",
  "server.ts"
];

const query = process.argv[2] || "current_order_id";
console.log(`Searching for "${query}"...`);
files.forEach(f => {
  const p = path.resolve("c:/Users/ammar/OneDrive/Desktop/سفرة-كلاود", f);
  if (fs.existsSync(p)) {
    searchFile(p, query);
  }
});
