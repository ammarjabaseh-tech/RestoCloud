const fs = require("fs");
const dir = "C:/Users/ammar/.gemini/antigravity/brain/89a0c34b-0d0d-412c-bea9-9552900b4a0a/.system_generated/logs";
if (fs.existsSync(dir)) {
  console.log("Files under logs:", fs.readdirSync(dir));
} else {
  console.log("Logs directory does not exist:", dir);
}
