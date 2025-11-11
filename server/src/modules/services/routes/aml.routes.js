const express = require("express");
const router = express.Router();
const amlController = require("../controllers/aml.controller");
const {
  amlPersonSchema,
  amlOrganizationSchema,
} = require("../validators/aml.validator");
const validate = require("../../../middlewares/validate");
const authorize = require("../../../middlewares/authorize.middleware");

router.post(
  "/",
  [
    authorize("create-aml-person-info-request"),
    authorize("create-aml-organization-info-request"),
    (req, res, next) => {
      const { request_type } = req.body;
      const schema =
        request_type === "p" ? amlPersonSchema : amlOrganizationSchema;
      validate(schema)(req, res, next);
    },
  ],
  amlController.requestInfo
);

module.exports = router;
