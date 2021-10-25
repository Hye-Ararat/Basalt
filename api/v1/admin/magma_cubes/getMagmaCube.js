const { ObjectId } = require("mongodb");

const client = require("../../../../lib/mongodb");

//shouldnt there be authentication on this route?
async function getMagmaCube(req, res) {
  if (
    typeof req.params.magma_cube != "string" ||
    Buffer.byteLength(req.params.magma_cube, "utf8") < 12
  )
    return res.send({ status: "error", data: "Invalid Magma Cube" });
  const collection = client
    .db(`${process.env.DATABASE_NAME}`)
    .collection("magma_cubes");
  const magma_cube_data = await collection.findOne({
    _id: ObjectId(req.params.magma_cube),
  });
  magma_cube_data == null
    ? res.json({ status: "error", data: "Magma Cube does not exist" })
    : res.json({ status: "success", data: magma_cube_data });
}

module.exports = getMagmaCube;
