const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Searching for QR references in AdminPanelView.tsx:");
lines.forEach((line, idx) => {
  if (line.includes("QR") || line.includes("qr") || line.includes("Qr") || line.includes("Qrcode") || line.includes("QRCode")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
