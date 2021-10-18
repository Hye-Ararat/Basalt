const { ObjectId } = require("mongodb");

const client = require("../../../../lib/mongodb");

async function getServer(req, res) {
  if (
    typeof req.params.magma_cube != "string" ||
    Buffer.byteLength(req.params.magma_cube, "utf8") < 12
  )
    return res.send({ status: "error", data: "Invalid Server ID" });
  const collection = client
    .db(`${process.env.DATABASE_NAME}`)
    .collection("servers");
  const server_data = await collection.findOne({
    _id: ObjectId(req.params.server),
  });
  server_data == null
    ? res.json({ status: "error", data: "Server does not exist" })
    : res.json({ status: "success", data: server_data });
}

module.exports = getServer;
