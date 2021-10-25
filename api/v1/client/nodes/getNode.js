const { ObjectId } = require("mongodb");

const client = require("../../../../lib/mongodb");

async function getNode(req, res) {
	if (
		typeof req.params.node != "string" ||
		Buffer.byteLength(req.params.node, "utf8") < 12
	)
		return res.send({ status: "error", data: "Invalid Node ID" });
	const server_collection = client
		.db(`${process.env.DATABASE_NAME}`)
		.collection("servers");
	const server = await server_collection.findOne({
		node: req.params.node,
		[`users.${req.locals.user_data.id}`]: { $exists: true },
	});
	if (server == null)
		return res.send({ status: "error", data: "Node not found" });
	const collection = client
		.db(`${process.env.DATABASE_NAME}`)
		.collection("nodes");
	const node_data = await collection.findOne({
		_id: ObjectId(req.params.node),
	});
	node_data == null
		? res.json({ status: "error", data: "Node does not exist" })
		: res.json({ status: "success", data: node_data });
}

module.exports = getNode;
