
const http = require("node:http");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
  });

  res.end(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>IAP Learning Sandbox</title>
      </head>
      <body>
        <h1>IAP Learning Sandbox</h1>
        <p>The Cloud Run sample application is working.</p>
        <p>IAP protection will be added in a later stage.</p>
      </body>
    </html>
  `);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
