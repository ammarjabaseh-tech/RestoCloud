const http = require("http");

http.get("http://localhost:3000", (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("HTML Preview:", data.substring(0, 500));
  });
}).on("error", (err) => {
  console.error("HTTP GET Error:", err.message);
});
