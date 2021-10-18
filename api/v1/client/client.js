const express = require("express");
const router = express.Router();

const getServers = require("./getServers")

const authAPI = require("./auth/authAPI");
const serverAPI = require("./servers/serverAPI");

//User Resource Routes
router.get('/servers', getServers)
//Auth Routes
router.post("/auth/login", authAPI.login);
router.post("/auth/create", authAPI.create);
router.post("/auth/refreshAccessToken", authAPI.refreshAccessToken);

//Server Routes
router.get("/servers/:server", serverAPI.getServer);

module.exports = router;
