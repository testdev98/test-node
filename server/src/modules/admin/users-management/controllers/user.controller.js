const { StatusCodes } = require("http-status-codes");
const UserService = require("../services/user.service");
const sendResponse = require("../../../../utils/response");
const getAccessControlQuery = require("../../../../utils/accessControl");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validators/user.validator");

class UserController {
  // Create a new user
  async create(req, res) {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        password,
        status,
        role_id,
        company_profile,
        subscribe_services,
        expired_at,
        extra_user_limit,
      } = req.body;

      const userData = {
        first_name,
        last_name,
        email,
        phone,
        password,
        status,
        role_id: role_id || null,
        company_profile: company_profile,
        subscribe_services: subscribe_services || [],
        expired_at,
        extra_user_limit: extra_user_limit ?? null,
        parent_id: req.user?._id || null,
        created_by: req.user?._id || null,
        updated_by: null,
      };

      const newUser = await UserService.createUser(userData);

      return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "User created successfully.",
        data: newUser,
      });
    } catch (error) {
      console.error("Error in create user controller:", error);
      return sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "An error occurred while creating the user.",
        error: error.message,
      });
    }
  }

  // Update a user
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        first_name,
        last_name,
        email,
        phone,
        status,
        role_id,
        company_profile,
        subscribe_services,
        expired_at,
        extra_user_limit,
      } = req.body;

      const userData = {
        first_name,
        last_name,
        email,
        phone,
        status,
        role_id: role_id || null,
        company_profile: company_profile,
        subscribe_services: subscribe_services || [],
        expired_at,
        extra_user_limit: extra_user_limit ?? null,
        updated_by: req.user?._id || null,
      };

      console.log(userData);

      const updatedUser = await UserService.updateUser(id, userData);

      if (!updatedUser) {
        return sendResponse(res, {
          statusCode: StatusCodes.NOT_FOUND,
          message: "User not found.",
          data: null,
        });
      }

      return sendResponse(res, {
        message: "User updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error in updating user:", error);
      return sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "An error occurred while updating the user.",
        error: error.message,
      });
    }
  }
  // Get all users
  async getUsers(req, res) {
    try {
      const query = getAccessControlQuery(req.user, {});
      const users = await UserService.getAllUsers(query);
      if (!users || users.length === 0) {
        return sendResponse(res, {
          statusCode: StatusCodes.NOT_FOUND,
          message: "Users not found.",
          data: null,
        });
      }
      return sendResponse(res, {
        message: "Users fetched successfully.",
        data: users,
      });
    } catch (error) {
      console.error("Error in fetching users:", error);
      return sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "An error occurred while fetching users.",
        error: error.message,
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const query = getAccessControlQuery(req.user, {});
      const user = await UserService.getUserById(query, id);

      if (!user) {
        return sendResponse(res, {
          statusCode: StatusCodes.NOT_FOUND,
          message: "User not found.",
          data: null,
        });
      }

      return sendResponse(res, {
        message: "User fetched successfully.",
        data: user,
      });
    } catch (error) {
      console.error("Error in fetching user by ID:", error);
      return sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "An error occurred while fetching the user by ID.",
        error: error.message,
      });
    }
  }

  async subscribeServicesUpdate(req, res) {
    try {
      const { id } = req.params; // userId
      const { service_id, environment, price, request_limit } = req.body;

      // Build updates object dynamically
      const updates = {};
      if (environment !== undefined) updates.environment = environment;
      if (price !== undefined) updates.price = price;
      if (request_limit !== undefined) updates.request_limit = request_limit;

      // Call the service function
      const result = await UserService.updateUserService(
        id,
        service_id,
        updates
      );
      // Check if the update actually modified a document
      if (!result || result.modifiedCount === 0) {
        return sendResponse(res, {
          statusCode: StatusCodes.NOT_FOUND,
          success: false,
          message: "User or service not found.",
          data: null,
        });
      }

      return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service updated successfully.",
        data: result,
      });
    } catch (error) {
      console.error("Error updating service:", error);
      return sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "An error occurred while updating the service.",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
