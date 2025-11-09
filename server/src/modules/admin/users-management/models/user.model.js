const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Company Profile Sub-Schema
const companyProfileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
  },
  { _id: false }
);

// Subscribe Services Sub-Schema
const subscribeServiceSchema = new mongoose.Schema(
  {
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
      required: true,
    },
    service_name: { type: String, trim: true },
    environment: {
      type: String,
      enum: ["sandbox", "production"],
      required: true,
    },
    request_limit: { type: Number, default: -1 },
    price: { type: Number, default: 0 },
  },
  { _id: false }
);

// Main Users Schema
const UsersSchema = new mongoose.Schema(
  {
    first_name: { type: String, default: null, trim: true },
    last_name: { type: String, default: null, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, default: null, trim: true },
    username: { type: String, trim: true, unique: true },
    password: { type: String, required: true, trim: true },

    status: {
      type: Number,
      default: 1,
      enum: [0, 1, 2, 3], // 0 - Inactive, 1 - Active, 2 - Blocked, 3 - Other
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    profile_pic: { type: String, trim: true },
    favicon: { type: String, trim: true },
    logo: { type: String, trim: true },
    company_profile: companyProfileSchema,
    subscribe_services: [subscribeServiceSchema],

    expired_at: {
      type: Date,
      default: null,
    },
    extra_user_limit: {
      type: Number,
      default: 0,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        expired_dt: {
          type: Date,
          default: null,
        },
      },
    ],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre save method is use for data change before save
UsersSchema.pre("save", async function (next) {
  try {
    if (!this.username) {
      const fNamePart = this.first_name
        ? this.first_name.slice(0, 2).toLowerCase()
        : "xx";
      const lNamePart = this.last_name
        ? this.last_name.slice(0, 2).toLowerCase()
        : "xx";

      // Generate username first time
      let randomNum = Math.floor(100 + Math.random() * 900).toString();
      let username = `Usr${fNamePart}${lNamePart}${randomNum}`;

      // Check if username exists
      const existingUser = await this.constructor.findOne({ username });

      // If exists, regenerate once more
      if (existingUser) {
        randomNum = Math.floor(100 + Math.random() * 900).toString();
        username = `Usr${fNamePart}${lNamePart}${randomNum}`;
      }

      this.username = username;
    }

    // Hash password if modified or new
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    next();
  } catch (err) {
    next(err);
  }
});

const Users = mongoose.model("User", UsersSchema);
module.exports = Users;
