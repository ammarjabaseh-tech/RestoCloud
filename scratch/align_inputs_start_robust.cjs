const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Use a robust regex to replace <div> wrappers of setting labels with <div className="flex flex-col items-start">
// This enforces proper start-alignment (right-alignment in RTL) on all inputs.
content = content.replace(
  /<div>\s*<label className="block text-\[10px\]/g,
  '<div className="flex flex-col items-start">\n                    <label className="block text-[10px]'
);

// Let's also verify if there are any other wrappers like that
content = content.replace(
  /<div>\s*<label className="block text-xs/g,
  '<div className="flex flex-col items-start">\n                    <label className="block text-xs'
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully aligned all setting inputs to the start in AdminPanelView.tsx");
