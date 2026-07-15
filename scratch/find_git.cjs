const fs = require("fs");
const path = require("path");

const paths = [
  "C:\\Program Files\\Git\\bin\\git.exe",
  "C:\\Program Files\\Git\\cmd\\git.exe",
  "C:\\Program Files (x86)\\Git\\bin\\git.exe",
  "C:\\Program Files (x86)\\Git\\cmd\\git.exe",
  path.join(process.env.LOCALAPPDATA || "", "Programs\\Git\\bin\\git.exe"),
  path.join(process.env.LOCALAPPDATA || "", "Programs\\Git\\cmd\\git.exe"),
  path.join(process.env.USERPROFILE || "", "scoop\\apps\\git\\current\\bin\\git.exe")
];

paths.forEach(p => {
  if (fs.existsSync(p)) {
    console.log("Found git at:", p);
  }
});
