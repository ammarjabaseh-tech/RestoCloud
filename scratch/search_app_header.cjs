const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const lines = fs.readFileSync(filePath, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("كاشير POS") || line.includes("شاشة المطبخ") || line.includes("تسجيل الخروج") || line.includes("logo") || line.includes("nav")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
