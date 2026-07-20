const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

lines.forEach((line, idx) => {
  if (line.includes("handleCheckout") || line.includes("checkout") || line.includes("حفظ والطباعة") || line.includes("الدفع")) {
    if (idx > 1050 && idx < 1280) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
