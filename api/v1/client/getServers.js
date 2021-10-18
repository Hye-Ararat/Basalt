const { ObjectId } = require("mongodb");

const client = require("../../../lib/mongodb");

async function getServers(req, res) {
	var user = "616da13fe2f36f19e274a7ca";
	const collection = client
		.db(`${process.env.DATABASE_NAME}`)
		.collection("servers");
	try {
		var server_data = await collection
			.find({
				[`users.${user}`]: { $exists: true },
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
