const dotenv = require("dotenv");
dotenv.config();

console.log("Parsed SUPER_ADMIN_EMAIL:", process.env.SUPER_ADMIN_EMAIL);
console.log("Parsed SUPER_ADMIN_PASSWORD:", process.env.SUPER_ADMIN_PASSWORD);
