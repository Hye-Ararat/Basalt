const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const rateLimiter = require("express-rate-limit");
const router = express.Router();
const cors = require("cors");
const cluster = require("cluster");

if (cluster.isMaster || cluster.isPrimary) {
	process.title = "basaltd"
	for (let i = 0; i < require("os").cpus().length; i++) {
		cluster.fork();
	}
	cluster.on("exit", (worker, code, signal) => {
		console.log(`Basalt instance on ${worker.process.pid} crashed.`);
		cluster.fork();
	});
} else {
	process.title = "Hye Basalt"
	const rateLimit = rateLimiter({
		windowMs: 60000,
		max: 100,
	});
	
	app.use(rateLimit);
	app.use(cors());
	app.use(express.json());
	require("dotenv").config();
	const apiv1 = require("./api/v1/v1");
	
	app.use(router);
	
	app.get("/", (req, res) => {
		res.send(`Hye Basalt Instance ${process.pid}`);
	});

	router.use("/api/v1", apiv1);
	
	try {
		var key = fs.readFileSync(process.env.SSL_KEY);
	} catch (error) {
		console.log("Error while reading SSL Key");
		process.exit(0);
	}
	try {
		var cert = fs.readFileSync(process.env.SSL_CERT);
	} catch (error) {
		console.log("Error while reading SSL Cert");
		process.exit(0);
	}
	let httpsServer = https.createServer(
		{
			key: key,
			cert: cert,
		},
		app
	);
	httpsServer.on("error", (e) => {
		console.log(e.message);
	});
	
	httpsServer.listen(process.env.LISTEN_PORT, process.env.LISTEN_ADDRESS);
	
	httpsServer.on("listening", () => {
		console.log(
			`Basalt instance ${process.pid} started on`,
			process.env.LISTEN_ADDRESS + ":" + process.env.LISTEN_PORT
		);
	});
}
