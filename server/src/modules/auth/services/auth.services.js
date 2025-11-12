const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserModel = require("../../admin/users-management/models/user.model");

const LoginService = {
  async findUserByUsername(username) {
    return await UserModel.findOne({ username }).populate([
      {
        path: "role_id",
        select: "id name slug",
        populate: { path: "permissions", select: "id name slug module" },
      },
      { path: "parent_id" },
    ]);
  },

  async checkPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async generateToken(userId) {
    const newToken = crypto.randomBytes(256).toString("hex"); // 128 chars token
    // Remove all previous tokens — optional, depends on your use case
    await UserModel.updateOne({ _id: userId }, { $unset: { tokens: 1 } });

    // Add the new token
    await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          tokens: {
            token: newToken,
            createdAt: new Date(),
          },
        },
      }
    );

    return newToken;
  },

  async getTokenUserDetails(token) {
    return await UserModel.findOne({ "tokens.token": token }).populate([
      {
        path: "role_id",
        select: "id name slug",
        populate: { path: "permissions", select: "id name slug module" },
      },
      { path: "parent_id" },
    ]);
  },

  async deleteToken(userId) {
    return await UserModel.updateOne(
      { _id: userId },
      { $unset: { tokens: 1 } }
    );
  },

  async getSubUserCount(user_id) {
    return await UserModel.countDocuments({ parent_id: user_id });
  },
};

module.exports = LoginService;
