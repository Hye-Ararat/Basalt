const { ObjectId } = require("mongodb");

const client = require("../../../../lib/mongodb");

async function getAllocation(req, res) {
	if (
		typeof req.params.allocation != "string" ||
		Buffer.byteLength(req.params.allocation, "utf8") < 12
	)
		return res.send({ status: "error", data: "Invalid Allocation ID" });
	const server_collection = client
		.db(`${process.env.DATABASE_NAME}`)
		.collection("servers");
	const servers = await server_collection.findOne({
		[`allocations.list`]: {
			$in: [req.params.allocation],
		},
		[`users.${res.locals.user_data.id}`]: { $exists: true },
	});
	if (servers == null)
		return res.json({ status: "error", data: "Allocation does not exist" });
	const collection = client
		.db(`${process.env.DATABASE_NAME}`)
		.collection("allocations");
	const allocation_data = await collection.findOne({
		_id: ObjectId(req.params.allocation),
	});
	allocation_data == null
		? res.json({ status: "error", data: "Allocation does not exist" })
		: res.json({ status: "success", data: allocation_data });
}

module.exports = getAllocation;
