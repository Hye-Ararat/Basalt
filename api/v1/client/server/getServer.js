const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.DATABASE_CONNECTION);
async function getServer(req, res) {
  await client.connect();
  const collection = client.db("Ararat").collection("servers");
  collection
    .find({
      _id: ObjectId(req.params.server),
    })
    .toArray()
    .then((data) => {
      res.send(data[0]);
    });
}

module.exports = getServer;
