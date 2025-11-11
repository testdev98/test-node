const path = require("path");
const fs = require("fs");
const Permission = require("../models/permission.model");

const PermissionSeederData = async () => {
  try {
    const permissionData = fs.readFileSync(
      path.join(__dirname, "permission.json"),
      "utf8"
    );
    const parsedData = JSON.parse(permissionData);

    for (const item of parsedData) {
      const existingRecord = await Permission.findOne({ name: item.name });

      if (!existingRecord) {
        await Permission.create(item);
      } else {
        await Permission.updateOne(
          { _id: existingRecord._id },
          { $set: item } 
        );
      }
    }
  } catch (err) {
    console.error("Error processing data:", err);
  }
};

module.exports = PermissionSeederData;
