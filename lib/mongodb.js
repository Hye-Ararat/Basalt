const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_CONNECTION);
client.connect()
module.exports = client;
