const express = require("express");
const router = express.Router();

const getServers = require("./getServers")

const authAPI = require("./auth/authAPI");
const serverAPI = require("./servers/serverAPI");
const nodeAPI = require("./nodes/nodeAPI");

//User Resource Routes
router.get('/servers', getServers)
//Auth Routes
router.post("/auth/login", authAPI.login);
router.post("/auth/create", authAPI.create);
router.post("/auth/refreshAccessToken", authAPI.refreshAccessToken);

//Server Routes
router.get("/servers/:server", serverAPI.getServer);

//Node Routes
router.get("/nodes/:node", nodeAPI.getNode);

module.exports = router;
