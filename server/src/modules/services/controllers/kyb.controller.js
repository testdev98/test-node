const sendResponse = require("../../../utils/response");
const { StatusCodes } = require("http-status-codes");
const { getRequestToken } = require("../../../utils/tokens");
const KYBService = require("../services/kyb.service");

class KYBController {
  async requestInfo(req, res) {
    try {
      const userDetails = req.user;
      const {
        envType,
        company_name,
        company_number,
        source,
        state,
        country_code,
        request_id,
        request_type, // New field to determine the type of request (search, details, officer)
        officer_name,
        officer_number,
      } = req.body;

      // Get request token/config
      const requestDetails = await getRequestToken("kyb", envType);
      if (!requestDetails) {
        return sendResponse(res, {
          statusCode: StatusCodes.BAD_REQUEST,
          message: "KYB service is not configured properly.",
          data: null,
        });
      }

      // Check if user has subscribed to KYB
      if (
        userDetails.role_id.slug !== "super-admin" &&
        (!userDetails.subscribe_services ||
          !userDetails.subscribe_services.includes("kyb"))
      ) {
        return sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          message: "KYB service is not subscribed.",
          data: null,
        });
      }

      // Initialize requestData object
      let requestData = {};

      switch (request_type) {
        case "search":
          requestData = {
            company_name,
            company_number,
            country_code,
            source,
            request_id,
          };
          break;

        case "details":
          requestData = {
            company_name,
            company_number,
            state,
            country_code,
            source,
            request_id,
          };
          break;

        case "officer":
          requestData = {
            officer_name,
            officer_number,
            state,
            country_code,
            source,
            request_id,
          };
          break;

        default:
          return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Invalid request type.",
            data: null,
          });
      }
      // Call the KYB service with the dynamically created requestData
      const kybResponse = await KYBService.requestInfo(
        envType,
        requestData,
        requestDetails,
        userDetails,
        request_type
      );

      // Return success response
      return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "KYB request processed successfully.",
        data: kybResponse,
      });
    } catch (error) {
      console.error("KYB request failed:", error);
      return sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "An error occurred while processing the KYB request.",
      });
    }
  }
}

module.exports = new KYBController();
