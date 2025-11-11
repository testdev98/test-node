const express = require("express");
const router = express.Router();
const kybController = require("../controllers/kyb.controller");
const {
  companySearch,
  companyDetails,
  officerSearch,
} = require("../validators/kyb.validator");
const validate = require("../../../middlewares/validate");
const authorize = require("../../../middlewares/authorize.middleware");

router.post(
  "/",
  [
    authorize("create-kyb-copmany-search-request"),
    authorize("create-kyb-copmany-details-request"),
    authorize("create-kyb-officer-search-request"),
    (req, res, next) => {
      const { request_type } = req.body;
      let schema;
      switch (request_type) {
        case "search":
          schema = companySearch;
          break;
        case "details":
          schema = companyDetails;
          break;
        default:
          schema = officerSearch;
      }
      validate(schema)(req, res, next);
    },
  ],
  kybController.requestInfo
);

module.exports = router;
