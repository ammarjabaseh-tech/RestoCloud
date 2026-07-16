const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for tenant columns and updates in server.ts:");
lines.forEach((line, idx) => {
  if (line.includes("facebook") || line.includes("instagram") || line.includes("tiktok") || line.includes("banner_image") || line.includes("bannerImage") || line.includes("is_open") || line.includes("isOpen")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
