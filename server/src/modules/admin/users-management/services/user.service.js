const UserModel = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const { updateSubscribeService } = require("../validators/user.validator");

const UserService = {
  async createUser(userData) {
    try {
      // Create a new user instance
      const newUser = new UserModel(userData);

      // Save the user to the database
      return await newUser.save();
    } catch (error) {
      console.error("Error creating user: ", error);
      throw new Error("Error creating user: " + error.message);
    }
  },

  async getAllUsers(query) {
    try {
      // Fetch all user from the database
      return await UserModel.find(query)
        .select("-password -tokens -created_by -updated_by")
        .populate({
          path: "role_id",
        });
    } catch (error) {
      console.error("Error fetching all user: ", error);
      throw new Error("Error fetching all user: " + error.message);
    }
  },

  async getUserById(query, userId) {
    try {
      return await UserModel.findOne({ _id: userId, ...query })
        .select("-password -tokens -created_by -updated_by")
        .populate({
          path: "role_id",
        });
    } catch (error) {
      console.error("Error fetching user by ID: ", error);
      throw new Error("Error fetching user by ID: " + error.message);
    }
  },

  async updateUser(userId, userData) {
    try {
      return await UserModel.findByIdAndUpdate(userId, userData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      console.error("Error update user: ", error);
      throw new Error("Error update user: " + error.message);
    }
  },

  async updateUserService(userId, serviceId, updates) {
    try {
      // Build the $set object dynamically
      const setUpdates = {};
      if (updates.environment !== undefined)
        setUpdates["subscribe_services.$[service].environment"] =
          updates.environment;
      if (updates.price !== undefined)
        setUpdates["subscribe_services.$[service].price"] = updates.price;
      if (updates.request_limit !== undefined)
        setUpdates["subscribe_services.$[service].request_limit"] =
          updates.request_limit;

      if (Object.keys(setUpdates).length === 0) {
        return { success: false, message: "No valid fields to update." };
      }

      return await User.findByIdAndUpdate(
        userId,
        { $set: setUpdates },
        {
          arrayFilters: [
            { "service.service_id": mongoose.Types.ObjectId(serviceId) },
          ],
          new: true, // return updated document
          runValidators: true,
        }
      );
    } catch (error) {
      console.error("Error update user: ", error);
      throw new Error("Error update user subscribe services: " + error.message);
    }
  },

  async deleteUser(userId) {
    try {
      const deleteUser = UserModel.deleteOne({ _id: userId });

      if (deleteUser.deletedCount === 0) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "User not found.",
          data: null,
        };
      }

      return {
        status: StatusCodes.OK,
        message: "User deleted successfully.",
        data: null,
      };
    } catch (error) {
      console.error("Error delete user: ", error);
      throw new Error("Error delete user: " + error.message);
    }
  },
};

module.exports = UserService;
