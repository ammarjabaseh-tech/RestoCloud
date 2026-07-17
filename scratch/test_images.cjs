const https = require("https");

const urls = {
  "Espresso": "https://images.unsplash.com/photo-1510972527409-cef7e2b7652b?q=80&w=400",
  "Cappuccino": "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400",
  "Ice Matcha": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=400",
  "Cold Brew": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=400",
  "Fresh Mojito": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400",
  "Orange Juice": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400",
  "Milkshake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=400",
  "Soda": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400",
  "Smash Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400",
  "Crispy Chicken": "https://images.unsplash.com/photo-1627662236973-4f8259fa2441?q=80&w=400",
  "Margherita": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400",
  "Pepperoni": "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400",
  "Tacos": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=400",
  "Shawarma": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=400",
  "French Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400",
  "Mixed Grills": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400",
  "Beef Steak": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400",
  "Pasta Alfredo": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=400",
  "Sushi": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400",
  "Saudi Kabsa": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=400",
  "Fried Shrimp": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400",
  "Green Salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400",
  "Caesar Salad": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400",
  "Kibbeh": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400",
  "San Sebastian": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=400",
  "Chocolate Cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400",
  "Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400",
  "Waffle": "https://images.unsplash.com/photo-1562376502-6f769499c886?q=80&w=400",
  "Grape Leaves": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=400",
  "Hummus": "https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=600&auto=format&fit=crop&q=80",
  "Ribs": "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=600&auto=format&fit=crop&q=80",
  "Onion Rings": "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?w=600&auto=format&fit=crop&q=80",
  "Strawberry Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
  "Pizza Quattro": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
  "Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
  "Flat White": "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop&q=80",
  "Almond Croissant": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
};

function testUrl(name, url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: "HEAD" }, (res) => {
      resolve({ name, url, status: res.statusCode });
    });
    req.on("error", (err) => {
      resolve({ name, url, status: 0, error: err.message });
    });
    req.end();
  });
}

async function run() {
  console.log("Testing image URLs...");
  const results = [];
  for (const [name, url] of Object.entries(urls)) {
    const res = await testUrl(name, url);
    results.push(res);
  }
  console.log("\nResults:");
  results.forEach(r => {
    if (r.status !== 200) {
      console.log(`❌ ${r.name} failed with status: ${r.status}. URL: ${r.url}`);
    } else {
      console.log(`✅ ${r.name} is OK.`);
    }
  });
}

run();
