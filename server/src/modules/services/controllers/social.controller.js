const sendResponse = require("../../../utils/response");
const { StatusCodes } = require("http-status-codes");
const { getRequestToken } = require("../../../utils/tokens");
const SocialService = require("../services/social.service");

class SocialController {
  async socialRequest(req, res) {
    try {
      const userDetails = req.user;
      const { envType, request_id, email, phone, ip } = req.body;
      const requestDetails = await getRequestToken("social", envType);

      if (!requestDetails) {
        return sendResponse(res, {
          statusCode: StatusCodes.BAD_REQUEST,
          message: "Social service is not configured properly.",
          data: null,
        });
      }

      // Check if user has subscribed to Social
      if (
        userDetails.role_id.slug !== "super-admin" &&
        (!userDetails.subscribe_services ||
          !userDetails.subscribe_services.includes("social"))
      ) {
        return sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          message: "Social service is not subscribed.",
          data: null,
        });
      }

      // Prepare request data
      const requestData = {
        email,
        phone,
        ip,
        request_id,
      };

      // Call the social service with the request data
      const socialResponse = await SocialService.request(
        envType,
        requestData,
        requestDetails,
        userDetails
      );

      return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Social request processed successfully.",
        data: socialResponse,
      });
    } catch (error) {
      console.error("Error in socialRequest:", error);
      return sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "An error occcurred while processing your social request.",
        data: null,
      });
    }
  }
}

module.exports = new SocialController();
