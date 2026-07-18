const fs = require("fs");
const path = require("path");

const srcPath = "C:\\Users\\ammar\\OneDrive\\Desktop\\RestoCloud-SocialMedia\\logo_profile.jpg";
const destDir = "c:\\Users\\ammar\\OneDrive\\Desktop\\RestoCloud\\public";
const destPath = path.join(destDir, "logo.jpg");

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log("Created public/ directory.");
  }
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log("Copied logo_profile.jpg to public/logo.jpg successfully!");
  } else {
    console.error("Source file not found at desktop location.");
  }
} catch (e) {
  console.error("Error copy brand logo:", e);
}
