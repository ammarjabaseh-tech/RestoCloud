const fs = require("fs");
const file1 = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/App.tsx";
const file2 = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantUsersView.tsx";

function check(file) {
  if (fs.existsSync(file)) {
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("kitchen") || line.includes("المطبخ")) {
        console.log(`${file} Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }
}

check(file1);
check(file2);
