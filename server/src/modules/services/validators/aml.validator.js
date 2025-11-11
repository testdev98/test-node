const Joi = require("joi");

const amlPersonSchema = Joi.object({
  envType: Joi.string().valid("sandbox", "production").required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  middle_name: Joi.string().allow("").optional(),
  dob: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/) // Ensures "YYYY-MM-DD" format
    .optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  address: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  zip: Joi.string().optional(),
  country_code: Joi.string().length(2).optional(),
  request_id: Joi.string().required(),
  response_type: Joi.string().valid("json", "pdf").optional(),
  request_type: Joi.string().valid("p", "c").optional(),
  monitoring: Joi.boolean().optional(),
});

const amlOrganizationSchema = Joi.object({
  envType: Joi.string().valid("sandbox", "production").required(),
  company_name: Joi.string().required(),
  address: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  zip: Joi.string().optional(),
  country_code: Joi.string().length(2).optional(),
  request_id: Joi.string().required(),
  response_type: Joi.string().valid("json", "pdf").optional(),
  request_type: Joi.string().valid("p", "c").optional(),
  monitoring: Joi.boolean().optional(),
});

module.exports = {
  amlPersonSchema,
  amlOrganizationSchema,
};
