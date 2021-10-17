const axios = require("axios");

const { ObjectId } = require("mongodb");

const client = require("../../../../lib/mongodb");

async function createServer(req, res) {
  let config;
  let error;
  let body = req.body;

  if (!body.name)
    return res.json({ status: "error", data: "Name Field Is Required" });
  if (typeof body.name != "string")
    return res.json({
      status: "error",
      data: "Name field is invalid (must be a string)",
    });
  if (!body.node)
    return res.json({ status: "error", data: "Node Field Is Required" });
  if (typeof body.node != "string")
    return res.json({ status: "error", data: "Node ID is invalid" });
  if (!body.users)
    return res.json({
      status: "error",
      data: "At least 1 user assignment is required",
    });
  if (typeof body.users != "object")
    return res.json({ status: "error", data: "User assignments are invalid." });
  if (!body.limits)
    return res.json({ status: "error", data: "Resource limits are required" });
  if (typeof body.limits != "object")
    return res.json({ status: "error", data: "Resource limits are invalid." });
  if (body.limits && !body.limits.cpu)
    return res.json({ status: "error", data: "CPU limit is required" });
  if (typeof body.limits.cpu != "number")
    return res.json({ status: "error", data: "CPU limit is invalid" });
  if (body.limits && !body.limits.memory)
    return res.json({ status: "error", data: "Memory limit is required" });
  if (typeof body.limits.memory != "number")
    return res.json({ status: "error", data: "Memory limit is invalid" });
  if (body.limits && !body.limits.disk)
    return res.json({ status: "error", data: "Disk limit is required" });
  if (typeof (body.limits.disk != "number"))
    return res.json({ status: "error", data: "Disk limit is invalid" });
  if (!body.magma_cube)
    return res.json({
      status: "error",
      data: "Magma cube configuration is required",
    });
  if (typeof body.magma_cube != "object")
    return res.json({
      status: "error",
      data: "Magma cube configuration is invalid",
    });
  if (body.magma_cube && !body.magma_cube.cube)
    return res.json({ status: "error", data: "Magma cube is required" });
  if (typeof body.magma_cube.cube != "string")
    return res.json({ status: "error", data: "Magma cube is invalid" });
  if (!body.allocations)
    return res.json({
      status: "error",
      data: "Allocation assignments are required",
    });
  if (typeof body.allocations != "object")
    return res.json({
      status: "error",
      data: "Allocation configuration is invalid",
    });
  if (body.allocations && !body.allocations.main)
    return res.json({ status: "error", data: "A main allocation is required" });
  if (typeof (body.allocations.main != "string"))
    return res.json({
      status: "error",
      data: "The main allocation is invalid",
    });
  if (body.allocations && !body.allocations.list)
    return res.json({
      status: "error",
      data: "An array of all the allocations this server has access to is required",
    });
  if (typeof body.allocations.list != "object")
    return res.json({
      status: "error",
      data: "The allocations list is invalid",
    });

  switch (body.type) {
    case "docker":
      if (!body.magma_cube.image_group) return res.json({status: "error", data: "For Docker, an image group is required in the magma cube configuration"});
      if (typeof(body.magma_cube.image_group) != "string") return res.json({status: "error", data: "The image group is invalid"});
      if (!body.magma_cube.image_index) return res.json({status: "error", data: "For Docker, an image index is required in the magma cube configuration"});
      if (typeof(body.magma_cube.image_index) != "number") return res.json({status: "error", data: "The image index is invalid"});
      
      config = {
        name: body.name,
        node: body.node,
        status: {
          installing: true,
        },
        users: body.users,
        limits: {
          cpu: body.limits.cpu,
          memory: body.limits.memory,
          disk: body.limits.disk,
        },
        allocations: {
          list: body.allocations.list,
          main: body.allocations.main,
        },
        magma_cube: {
          cube: body.magma_cube.cube,
          image_group: body.magma_cube.image_group,
          image_index: body.magma_cube.image_index,
        },
        env: body.env,
      };
      break;
    case "N-VPS":
      config = {};
    case "KVM":
      config = {};
    default:
      error = {
        status: "error",
        data: "Invalid Type",
      };
      break;
  }
  if (error) return res.send(error);

  const node_collection = client
    .db(`${process.env.DATABASE_NAME}`)
    .collection("nodes");
  const node_data = await node_collection.findOne({
    _id: ObjectId(config.node),
  });
  const server_collection = client
    .db(`${process.env.DATABASE_NAME}`)
    .collection("servers");
  try {
    server_document = await server_collection.insertOne(config);
  } catch (error) {
    return res.json({status: "error", data: "An error occured while writing to the database"})
  }
  try {
    await axios.post(`https://${node_data.address.hostname}:${node_data.address.port}/api/v1/servers`)
  } catch (error) {
    return res.json({status: "error", data: "An error occured while communicating with Hye Lava to create the server"})
    server_collection.deleteOne({
      _id: server_document.insertedId
    })
  }
  res.json({status: "success", data: "The Server Installation Has Started"})
}

module.exports = createServer;
