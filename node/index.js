const ejs = require("ejs");
const http = require("node:http");
const url = require("url");
const qs = require("querystring");

const util = require("./util");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "text/html");

  // Parse the URL to extract the pathname
  const pathname = url.parse(req.url).pathname;

  if (req.method === "GET" && pathname === "/") {
    // Handle GET request for the root path
    res.statusCode = 200;
    let html = await ejs.renderFile(__dirname + "/views/home.ejs", {});
    res.end(html);
  } else if (req.method === "POST" && pathname === "/process") {
    // Handle POST request for the "/process" path
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      // Parse the POST data
      const postData = qs.parse(body);

      const name = postData.name;
      const age = parseInt(postData.age, 10);

      const funMessage = util.getAgeMessage(age);
      const goData = await util.getFactFromGoService(age);

      // Send a response
      res.statusCode = 200;
      let html = await ejs.renderFile(__dirname + "/views/data.ejs", {
        name,
        age,
        funMessage,
        yearOfBirth: goData.year_of_birth,
        yearFact: goData.fact,
      });
      res.end(html);
    });
  } else {
    // Handle other routes (e.g., 404 Not Found)
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Node Server running at http://${hostname}:${port}/`);
});
