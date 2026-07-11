const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

console.log("🔍 Testing SMTP connection with current .env settings:");
console.log("Host:", process.env.SMTP_HOST);
console.log("Port:", process.env.SMTP_PORT);
console.log("Secure:", process.env.SMTP_SECURE);
console.log("User:", process.env.SMTP_USER);
console.log("Pass length:", process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log("\n❌ SMTP Verification Failed:");
    console.error(error.message);
    if (error.message.includes('535')) {
      console.log("\n💡 suggestion: The credentials (username or password) are rejected by Zoho. Make sure you generated the App Password for the exact user shown above, and copied all 16 characters.");
    }
  } else {
    console.log("\n✅ SMTP Connection is SUCCESSFUL! The server is ready to send emails.");
  }
  process.exit(0);
});
