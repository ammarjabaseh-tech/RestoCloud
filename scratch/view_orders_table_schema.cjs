const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/db/setup.ts";
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, "utf8");
  const startIdx = content.indexOf("CREATE TABLE IF NOT EXISTS orders");
  if (startIdx !== -1) {
    console.log(content.substring(startIdx, startIdx + 800));
  } else {
    console.log("Not found orders table definition in db/setup.ts");
  }
} else {
  console.log("db/setup.ts not found");
}
