const { ObjectId } = require("mongodb");

const client = require("../../../lib/mongodb");

async function getServers(req, res) {
	const collection = client
		.db(`${process.env.DATABASE_NAME}`)
		.collection("servers");
	try {
		var server_data = await collection
			.find({
				[`users.${res.locals.user_data.id}`]: { $exists: true },
			})
			.toArray();
	} catch (error) {
		return res.json({
			status: "error",
			data: "An error occured while getting the server list from the database",
		});
	}
	res.json({ status: "success", data: server_data });
}

module.exports = getServers;
