const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const router = express.Router();
require("dotenv").config();

const apiv1 = require("./api/v1/v1");

app.use(router);

router.use("/api/v1", apiv1);

try {
  var key = fs.readFileSync(process.env.SSL_KEY);
} catch (error) {
  console.log("Error while reading SSL Key")
  process.exit(0);
}
try {
  var cert = fs.readFileSync(process.env.SSL_CERT);
} catch (error) {
  console.log("Error while reading SSL Cert");
  process.exit(0);
}
let httpsServer = https.createServer(
  {
    key: key,
    cert: cert,
  },
  app
);
httpsServer.on("error", (e) => {
  console.log(e.message);
});

httpsServer.listen(process.env.LISTEN_PORT, process.env.LISTEN_ADDRESS);

httpsServer.on("listening", () => {
  console.log(
    "Server Running on",
    process.env.LISTEN_ADDRESS + ":" + process.env.LISTEN_PORT
  );
});
