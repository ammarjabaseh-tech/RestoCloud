const fs = require("fs");
const path = require("path");

function scan(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
      const content = fs.readFileSync(p, "utf8");
      if (content.includes("onOrderCreated") || content.includes("addOrder") || content.includes("orders") || content.includes("KitchenDisplayView")) {
        console.log("File containing order creation/sync:", p);
      }
    }
  });
}

scan("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src");
