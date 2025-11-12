const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  createUserSchema,
  updateUserSchema,
  updateSubscribeService,
} = require("../validators/user.validator");
const validate = require("../../../../middlewares/validate");
const authorize = require("../../../../middlewares/authorize.middleware");

// Create a new user with image upload
router.post(
  "/",
  [authorize("create-user"), validate(createUserSchema)],
  userController.create
);

// Get all users
router.get("/", [authorize("read-user")], userController.getUsers);

// Get user by ID
router.get("/:id", [authorize("read-user")], userController.getUserById);

router.put(
  "/:id/subscibe-service",
  [validate(updateSubscribeService)],
  userController.subscribeServicesUpdate
);

// Update user
router.put(
  "/:id",
  [authorize("update-user"), validate(updateUserSchema)],
  userController.update
);

module.exports = router;
