const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/index.html";
if (fs.existsSync(filePath)) {
  console.log("index.html exists. Content:");
  console.log(fs.readFileSync(filePath, "utf8"));
} else {
  console.log("index.html not found at path:", filePath);
}
