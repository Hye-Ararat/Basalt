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
		username: "wolfogaming",
		first_name: "Wolfo",
		last_name: "Gaming",
		admin: true,
		email: "klokko06@gmail.com",
		preferences: {},
		password: hashed_password,
		phone_number: null,
	});
	res.json({ status: "success", message: "Created user!" });
}

module.exports = create;
