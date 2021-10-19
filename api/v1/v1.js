const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const client = require("./client/client");
const admin = require("./admin/admin");

router.use("/client", function(req, res, next) {
    if (req.path == "/auth/login") return next();
    if (!req.headers["authorization"]) return res.json({status: "error", data: "No authorization header sent"});
    const authorization = req.headers["authorization"].split(" ")[1];
    if (authorization.substring(0, authorization.indexOf(":"))) {
        //Is API key
    } else {
        try {
            var user_data = jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET)
        } catch (error) {
            return res.json({status: "error", data: "Authorization is incorrect"});
        }
        res.locals.user_data = user_data;
        return next();
    }
}, client);
router.use("/admin", admin);
module.exports = router;
