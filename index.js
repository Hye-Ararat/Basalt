const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const router = express.Router();
require("dotenv").config();

const apiv1 = require("./api/v1/v1");

app.use(router);

router.use("/api/v1", apiv1);

var httpsServer = https.createServer(
  {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
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
