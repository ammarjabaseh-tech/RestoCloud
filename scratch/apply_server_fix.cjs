const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/server.ts";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");
  
  const target = `(b.cashierName === "طلب ذاتي (QR Menu)") ? "pending" : "preparing",`;
  const replacement = `b.orderStatus || ((b.cashierName === "طلب ذاتي (QR Menu)") ? "pending" : "preparing"),`;
  
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, "utf8");
    console.log("Successfully replaced server.ts line!");
  } else {
    console.log("Target string not found in server.ts!");
  }
} else {
  console.log("server.ts does not exist!");
}
