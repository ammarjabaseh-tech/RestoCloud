const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

console.log("🔍 Testing SMTP connection with current .env settings:");
console.log("Host:", process.env.SMTP_HOST);
console.log("Port:", process.env.SMTP_PORT);
console.log("Secure:", process.env.SMTP_SECURE);
console.log("User:", process.env.SMTP_USER);
const pass = process.env.SMTP_PASS || "";
console.log("Pass length:", pass.length);

// Diagnostics for formatting issues in .env
const hasCarriageReturn = pass.includes('\r');
const hasNewLine = pass.includes('\n');
const hasLeadingSpace = pass.startsWith(' ');
const hasTrailingSpace = pass.endsWith(' ');
const hasQuotes = pass.startsWith('"') && pass.endsWith('"');
const hasSingleQuotes = pass.startsWith("'") && pass.endsWith("'");

console.log("\n🔍 Password Formatting Diagnostics:");
console.log(" - Contains carriage return (\\r):", hasCarriageReturn);
console.log(" - Contains newline (\\n):", hasNewLine);
console.log(" - Has leading space:", hasLeadingSpace);
console.log(" - Has trailing space:", hasTrailingSpace);
console.log(" - Has raw double quotes around it in value:", hasQuotes);
console.log(" - Has raw single quotes around it in value:", hasSingleQuotes);

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
