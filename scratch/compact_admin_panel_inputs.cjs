const fs = require("fs");
const path = require("path");

const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Let's replace padding and rounded corners in inputs
content = content.replace(/px-3\.5 py-2\.5 rounded-xl/g, "px-3 py-1.5 rounded-lg");
content = content.replace(/px-3 py-2\.5 rounded-xl/g, "px-3 py-1.5 rounded-lg");
content = content.replace(/px-3 py-2 rounded-xl/g, "px-3 py-1.5 rounded-lg");
content = content.replace(/px-3\.5 py-2 rounded-xl/g, "px-3 py-1.5 rounded-lg");

// Re-scale heights and widths for the phone country dropdown selector
content = content.replace(/w-\[110px\] h-10/g, "w-[95px] h-[34px]");
content = content.replace(/h-10 px-3\.5/g, "h-[34px] px-3");

// Let's also check if Card padding p-6 can be changed to p-5 to make the cards more compact
content = content.replace(/rounded-3xl p-6 border/g, "rounded-2xl p-5 border");

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully compacted input fields in AdminPanelView.tsx");
