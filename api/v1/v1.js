const express = require("express");
const router = express.Router();

const client = require("./client/client");
const admin = require("./admin/admin");

router.use("/client", client);
router.use("/admin", admin);

module.exports = router;