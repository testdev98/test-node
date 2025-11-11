const sendResponse = require("../../../utils/response");
const { StatusCodes } = require("http-status-codes");
const { getRequestToken } = require("../../../utils/tokens");
const TrustService = require("../services/trust.service");

class TrustController {
  async trustRequest(req, res) {
    try {
      const userDetails = req.user;
      const { envType, request_id, email, phone, ip } = req.body;
      const requestDetails = await getRequestToken("trust", envType);

      if (!requestDetails) {
        return sendResponse(res, {
          statusCode: StatusCodes.BAD_REQUEST,
          message: "Trust service is not configured properly.",
          data: null,
        });
      }

      // Check if user has subscribed to Trust
      if (
        userDetails.role_id.slug !== "super-admin" &&
        (!userDetails.subscribe_services ||
          !userDetails.subscribe_services.includes("trust"))
      ) {
        return sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          message: "Trust service is not subscribed.",
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

      // Call the trust service with the request data
      const trustResponse = await TrustService.request(
        envType,
        requestData,
        requestDetails,
        userDetails
      );

      return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Trust request processed successfully.",
        data: trustResponse,
      });
    } catch (error) {
      console.error("Error in trustRequest:", error);
      return sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "An error occcurred while processing your trust request.",
        data: null,
      });
    }
  }
}

module.exports = new TrustController();
