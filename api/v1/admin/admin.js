const express = require("express");
const router = express.Router();

const magma_cubeAPI = require("./magma_cubes/magma_cubeAPI");

//Magma Cube Routes
router.get("/magma_cubes/:magma_cube", magma_cubeAPI.getMagmaCube);

module.exports = router;
