const express = require("express");
const router = express.Router();

const serverAPI = require("./servers/serverAPI");

//Server Routes
router.get("/servers/:server", serverAPI.getServer);

module.exports = router;
