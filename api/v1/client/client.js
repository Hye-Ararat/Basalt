const express = require("express");
const router = express.Router();

const serverAPI = require("./server/serverAPI");

//Server Routes
router.get("/server/:server", serverAPI.getServer);

module.exports = router;