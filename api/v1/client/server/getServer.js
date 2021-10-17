const {ObjectId } = require("mongodb");

const client = require("../../../../lib/mongodb");

async function getServer(req, res) {
  const collection = client.db(`${process.env.DATABASE_NAME}`).collection("servers");
  collection
    .findOne({
      _id: ObjectId(req.params.server),
    })
    .then((server_data) => {
      res.send(server_data);
    });
}

module.exports = getServer;
