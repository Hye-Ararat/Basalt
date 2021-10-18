const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { ObjectId } = require("mongodb");

const client = require("../../../../lib/mongodb");

/**
 * Logs the user in
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function login(req, res) {
	const collection = client.db(process.env.DATABASE_NAME).collection("users");
	const user_data = await collection.findOne({
		email: req.body.email,
	});
	if (user_data == null)
		return res.json({ status: "error", data: "Incorrect email/password" });
	const match = await bcrypt.compare(req.body.password, user_data.password);
	if (!match)
		return res.json({ status: "error", data: "Incorrect email/password" });
	let refresh_token = jwt.sign(
		{
			type: "refresh",
			user: ObjectId(user_data._id).toString(),
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			algorithm: "HS256",
			expiresIn: "7d",
		}
	);
	const user = {
		id: user_data._id,
		username: user_data.username,
		first_name: user_data.firstname,
		last_name: user_data.lastname,
		admin: user_data.admin,
		email: user_data.email,
		preferences: user_data.preferences,
		phone_number: user_data.phone_number,
	};
	let access_token = jwt.sign(
		{
			user,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			algorithm: "HS256",
			expiresIn: "15m",
		}
	);
	res.json({
		status: "success",
		data: {
			refresh_token: refresh_token,
			access_token: access_token,
		},
	});
}

module.exports = login;
