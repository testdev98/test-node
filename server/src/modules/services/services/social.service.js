const axios = require("axios");
const RequestLogsModel = require("../models/kyx_requests.models");
const { getResponseStatus } = require("../../../utils/status.helpers");
const path = require("path");
const fs = require("fs");

const SocialService = {
  async request(
    envType,
    requestData,
    requestDetails,
    userDetails,
    requestType = "social"
  ) {
    const logEntry = {
      request_id: requestData.request_id,
      user_id: userDetails._id,
      service: "social",
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
      let socialResponse;
      if (envType == "sandbox") {
        const filePath = path.join(
          __dirname,
          "../",
          "response",
          "social",
          "resp1.json"
        );
        socialResponse = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else {
        socialResponse = await axios.post(
          `${requestDetails.url}`,
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
        socialResponse.status,
        socialResponse.data
      );

      await RequestLogsModel.updateOne(
        { _id: log._id },
        {
          $set: {
            trans_id: socialResponse.data?.transaction_id || "",
            main_status,
            sub_status,
            response_at: new Date(),
            response: socialResponse.data,
          },
        }
      );

      return socialResponse.data;
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

      console.error("Error in SocialService request:", errorData);
      throw error;
    }
  },
};

module.exports = SocialService;
