const Joi = require("joi");

const baseSchema = {
  first_name: Joi.string().min(2).max(50),
  last_name: Joi.string().min(2).max(50),
  email: Joi.string().email().max(100),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  password: Joi.string().min(6).max(128).allow(null, ""),
  status: Joi.boolean().default(true),
  environment: Joi.string().allow(null, "").default("sandbox"),
  company_profile_name: Joi.string().min(2).max(100).allow(null, "").optional(),
  company_profile_email: Joi.string()
    .email()
    .max(100)
    .allow(null, "")
    .optional(),

  role_id: Joi.string().hex().length(24).allow(null, "").optional(),
  profile_pic: Joi.any().optional(),
  logo: Joi.any().optional(),
  favicon: Joi.any().optional(),
  company_profile: Joi.object().optional(),
  subscribe_services: Joi.array().allow(null, {}).optional(),
  expired_at: Joi.date().iso(),
  extra_user_limit: Joi.number().integer().min(0),
};

const createUserSchema = Joi.object({
  ...baseSchema,
  first_name: baseSchema.first_name.required(),
  last_name: baseSchema.last_name.required(),
  email: baseSchema.email.required(),
  password: baseSchema.password.required(),
  status: baseSchema.status.required(),
  role_id: baseSchema.role_id.required(),
});

const updateUserSchema = Joi.object(baseSchema);

const updateSubscribeService = Joi.object({
  service_id: Joi.string().hex().length(24).required(),
  environment: Joi.string().valid("sandbox", "production"),
  price: Joi.number().min(0),
  request_limit: Joi.number().integer().min(0),
})
  .or("environment", "price", "request_limit")
  .messages({
    "object.missing":
      "At least one of environment, price, or request_limit must be provided",
  });

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateSubscribeService,
};
