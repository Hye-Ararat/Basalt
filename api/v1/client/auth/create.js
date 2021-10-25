const client = require("../../../../lib/mongodb");
const bcrypt = require("bcrypt");

/**
 * Creates user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function create(req, res) {
	const users_colletion = client
		.db(process.env.DATABASE_NAME)
		.collection("users");
    if (!req.body.username){
		return res.json({ status: "error", data: "Username field is required" });
	}
	if (!req.body.first_name){
		return res.json({ status: "error", data: "First Name field is required" });
	}
	if (!req.body.last_name){
		return res.json({ status: "error", data: "Last Name field is required" });
	}
	if (!req.body.email){
		return res.json({ status: "error", data: "Email field is required" });
	}

	if (!req.body.password)
		return res.json({ status: "error", data: "Password field is required" });
	try {
		let salt = await bcrypt.genSalt(10);
		var hashed_password = await bcrypt.hash(req.body.password, salt);
	} catch (error) {
		return res.json({
			status: "error",
			data: "An internal error occured while creating the user",
		});
	}
	users_colletion.insertOne({
		username: req.body.username,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		admin: req.body.admin ? req.body.admin : false,
		email: req.body.email,
		preferences: {},
		password: hashed_password,
		phone_number: req.body.phone_number ? req.body.phone_number : null,
	});
	res.json({ status: "success", message: "Created user!" });
}

module.exports = create;
