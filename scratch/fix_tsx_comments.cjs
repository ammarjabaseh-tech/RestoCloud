const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

content = content.replace(/<!-- Card 1 -->/g, "{/* Card 1 */}");
content = content.replace(/<!-- Card 2 -->/g, "{/* Card 2 */}");
content = content.replace(/<!-- Card 3 -->/g, "{/* Card 3 */}");

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully fixed HTML comments to TSX comments in AdminPanelView.tsx");
