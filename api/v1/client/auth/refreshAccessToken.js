const jwt = require("jsonwebtoken");

async function refreshAccessToken(req, res) {
	const refresh_token = req.body.refresh_token;
	try {
		var token_data = jwt.verify(
			refresh_token,
			process.env.REFRESH_TOKEN_SECRET
		);
	} catch (error) {
		return res.json({ status: "error", data: "Invalid Refresh Token" });
	}
	const collection = client.db(process.env.DATABASE_NAME).collection("users");
	const user_data = await collection.findOne({
		_id: token_data.user,
	});
	if (user_data == null)
		return res.json({ status: "error", data: "Invalid Refresh Token" });
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
	let access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		algorithm: "HS256",
		expiresIn: "15m",
	});
	res.json({
		status: "success",
		data: {
			access_token: access_token,
		},
	});
}

module.exports = refreshAccessToken;
