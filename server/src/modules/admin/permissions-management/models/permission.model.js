const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      Lowercase: true,
    },
    module: {
      type: String,
      required: true,
      trim: true,
    },
    sub_module: {
      type: String,
      required: false,
      trim: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    desctiption: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
