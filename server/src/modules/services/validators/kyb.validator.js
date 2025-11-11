const Joi = require("joi");

const companySearch = Joi.object({
  envType: Joi.string().valid("sandbox", "production").optional(),
  company_name: Joi.string().required(),
  company_number: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  zip: Joi.string().optional(),
  source: Joi.string().optional(),
  country_code: Joi.string().length(2).optional(),
  request_id: Joi.string().required(),
  request_type: Joi.string().valid("search", "details", "officer").optional(),
});

const companyDetails = Joi.object({
  envType: Joi.string().valid("sandbox", "production").optional(),
  company_name: Joi.string().required(),
  company_number: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().optional(),
  zip: Joi.string().optional(),
  source: Joi.string().optional(),
  country_code: Joi.string().length(2).optional(),
  request_id: Joi.string().required(),
  request_type: Joi.string().valid("search", "details", "officer").optional(),
});

const officerSearch = Joi.object({
  envType: Joi.string().valid("sandbox", "production").optional(),
  officer_name: Joi.string().required(),
  officer_number: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  zip: Joi.string().optional(),
  source: Joi.string().optional(),
  country_code: Joi.string().length(2).optional(),
  request_id: Joi.string().required(),
  request_type: Joi.string().valid("search", "details", "officer").optional(),
});

module.exports = {
  officerSearch,
  companyDetails,
  companySearch,
};
