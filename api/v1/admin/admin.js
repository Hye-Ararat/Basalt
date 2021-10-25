const express = require("express");
const router = express.Router();

const magma_cubeAPI = require("./magma_cubes/magma_cubeAPI");
const userAPI = require('./users/userAPI')
const serverAPI = require('./servers/serversAPI')
//Magma Cube Routes
router.get("/magma_cubes/:magma_cube", magma_cubeAPI.getMagmaCube);
router.delete("/users/:uid", userAPI.deleteUser)
router.get("/users/:uid", userAPI.getUser)
router.post("/servers", serverAPI.createServer)
module.exports = router;
