const axios = require("axios");
const RequestLogsModel = require("../models/kyx_requests.models");
const { getResponseStatus } = require("../../../utils/status.helpers");
const path = require("path");
const fs = require("fs");

const KYBService = {
  async requestInfo(
    envType,
    requestData,
    requestDetails,
    userDetails,
    requestType
  ) {
    const endpoints = {
      search: "search",
      officer: "officer/search",
      default: "details",
    };
    const endpoint = endpoints[requestType] || endpoints.default;

    const logEntry = {
      request_id: requestData.request_id,
      user_id: userDetails._id,
      service: "kyb",
      env_type: envType,
      request_at: new Date(),
      response_at: null,
      request_type: requestType,
      request: requestData,
      response: null,
      created_by: userDetails._id,
    };

    const log = await RequestLogsModel.create(logEntry);

    try {
      let kybResponse;

      if (envType == "sandbox") {
        const filePath = path.join(
          __dirname,
          "../",
          "response",
          "kyb",
          requestType,
          "resp1.json"
        );
        kybResponse = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else {
        kybResponse = await axios.post(
          `${requestDetails.url + endpoint}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${requestDetails.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { main_status, sub_status } = getResponseStatus(
        kybResponse.status,
        kybResponse.data
      );

      await RequestLogsModel.updateOne(
        { _id: log._id },
        {
          $set: {
            trans_id: kybResponse.data?.transaction_id || "",
            main_status,
            sub_status,
            response_at: new Date(),
            response: kybResponse.data,
          },
        }
      );

      return kybResponse.data;
    } catch (error) {
      const errorData = error.response?.data || { message: error.message };

      await RequestLogsModel.updateOne(
        { _id: log._id },
        {
          $set: {
            main_status: "failed",
            sub_status: "Failed",
            response_at: new Date(),
            response: errorData,
          },
        }
      );

      console.error("Error in KYBService.requestInfo:", errorData);
      throw error;
    }
  },
};

module.exports = KYBService;
