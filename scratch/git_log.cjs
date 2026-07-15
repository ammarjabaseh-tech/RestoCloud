const fs = require("fs");

if (fs.existsSync(".git/logs/HEAD")) {
  const log = fs.readFileSync(".git/logs/HEAD", "utf8");
  const lines = log.trim().split("\n");
  console.log("=== Git Commit History (20) ===");
  lines.slice(-20).forEach(l => console.log(l));
} else {
  console.log(".git/logs/HEAD not found");
}
