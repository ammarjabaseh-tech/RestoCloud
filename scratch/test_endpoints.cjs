const http = require("http");

function checkUrl(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      console.log(`Path: ${path} | Status: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on("error", (err) => {
      console.error(`Path: ${path} | Error: ${err.message}`);
      resolve(null);
    });
  });
}

async function run() {
  await checkUrl("/");
  await checkUrl("/api/tenants");
  await checkUrl("/api/tenants/tenant-1/users");
}

run();
