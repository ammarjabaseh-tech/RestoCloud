const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/DigitalMenuView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for submit button in DigitalMenuView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("type=\"submit\"") || line.includes("إرسال الطلب") || line.includes("تأكيد الطلب")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print 10 lines
    for (let j = idx - 2; j < idx + 8; j++) {
      if (lines[j]) {
        console.log(`   [${j+1}] ${lines[j]}`);
      }
    }
  }
});
