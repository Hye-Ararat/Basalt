const express = require("express");
const router = express.Router();

const authAPI = require("./auth/authAPI");
const serverAPI = require("./servers/serverAPI");

//Auth Routes
router.post("/auth/login", authAPI.login);
router.post("/auth/create", authAPI.create);

//Server Routes
router.get("/servers/:server", serverAPI.getServer);

module.exports = router;
