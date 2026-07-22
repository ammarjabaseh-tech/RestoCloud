const http = require("http");

const postData = JSON.stringify({
  email: "delivery@shami-food.com",
  password: "delivery123"
});

const req = http.request("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData)
  }
}, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Response:", JSON.stringify(JSON.parse(data), null, 2));
  });
});

req.on("error", (err) => console.error("Error:", err.message));
req.write(postData);
req.end();
