const axios = require("axios");
const RequestLogsModel = require("../models/kyx_requests.models");
const { getResponseStatus } = require("../../../utils/status.helpers");
const path = require("path");
const fs = require("fs");

const TrustService = {
  async request(
    envType,
    requestData,
    requestDetails,
    userDetails,
    requestType = "trust"
  ) {
    const logEntry = {
      request_id: requestData.request_id,
      user_id: userDetails._id,
      service: "trust",
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
      let trustResponse;
      if (envType == "sandbox") {
        const filePath = path.join(
          __dirname,
          "../",
          "response",
          "trust",
          "resp1.json"
        );
        trustResponse = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else {
         trustResponse = await axios.post(
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
      console.log(trustResponse.status);
      const { main_status, sub_status } = getResponseStatus(
        trustResponse.status,
        trustResponse.data
      );

      await RequestLogsModel.updateOne(
        { _id: log._id },
        {
          $set: {
            trans_id: trustResponse.data?.transaction_id || "",
            main_status,
            sub_status,
            response_at: new Date(),
            response: trustResponse.data,
          },
        }
      );

      return trustResponse.data;
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

      console.error("Error in TrustService request:", errorData);
      throw error;
    }
  },
};

module.exports = TrustService;
