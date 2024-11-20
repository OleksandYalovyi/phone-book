/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("node:http");
const JSONStore = require("json-store");

const db = JSONStore(
  "/Users/user/Documents/Pets/phone-book/src/app/server/file.json"
);
const port = 80;

const server = http.createServer((req, res) => {
  const method = req.method;
  const path = req.url;

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  if (method === "GET" && path === "/contacts") {
    res.write(JSON.stringify(db.get("contacts")));
  }

  if (method === "POST" && path === "/contacts") {
    const records = db.get("contacts");

    req.setEncoding("utf-8");

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      db.set("contacts", [...records, JSON.parse(body)]);
    });
  }

  res.end();
});

server.listen(port);
