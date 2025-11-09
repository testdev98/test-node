const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/service.controller");
const {
  validationSchema,
} = require("../validators/service.validator");
const validate = require("../../../../middlewares/validate");
const authorize = require("../../../../middlewares/authorize.middleware");

// Routes
router.post("/", [authorize("create-service"), validate(validationSchema)], ServiceController.create); // Create a new service
router.get("/", [authorize("read-service")], ServiceController.getServices);
router.get("/:id", [authorize("read-service")], ServiceController.getServiceById);
router.put("/:id", [authorize("update-service"), validate(validationSchema)], ServiceController.update); // Update an existing service

module.exports = router;