const fs = require("fs");
const path = require("path");

const brainDir = "C:\\Users\\ammar\\.gemini\\antigravity\\brain\\89a0c34b-0d0d-412c-bea9-9552900b4a0a";
const desktopDir = "C:\\Users\\ammar\\OneDrive\\Desktop\\RestoCloud-SocialMedia";

try {
  if (!fs.existsSync(desktopDir)) {
    fs.mkdirSync(desktopDir, { recursive: true });
  }

  // File map
  const files = {
    "restocloud_profile_logo_1784374544662.jpg": "logo_profile.jpg",
    "restocloud_cover_banner_1784374556322.jpg": "cover_banner.jpg",
    "restocloud_marketing_post_1784374568605.jpg": "marketing_post.jpg"
  };

  Object.entries(files).forEach(([srcName, destName]) => {
    const srcPath = path.join(brainDir, srcName);
    const destPath = path.join(desktopDir, destName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcName} to ${destPath}`);
    } else {
      console.log(`Source file not found: ${srcPath}`);
    }
  });

  console.log("Success! Folder created on Desktop.");
} catch (e) {
  console.error("Failed to copy assets:", e);
}
