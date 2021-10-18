const { MongoClient } = require("mongodb");
if (!process.env.DATABASE_CONNECTION){
    console.log("DATABASE_CONNECTION is not configured");
    process.exit(0);
}
const client = new MongoClient(process.env.DATABASE_CONNECTION);
client.connect()
module.exports = client;
