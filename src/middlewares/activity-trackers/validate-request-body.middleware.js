const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const { viewAdminActivityTrackerRequiredFields, listActivityTrackerRequiredFields } = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
  validateViewAdminActivityTrackerRequestBody: validateRequestBodyMiddleware(
    viewAdminActivityTrackerRequiredFields,
    "validateViewAdminActivityTrackerRequestBody"
  )
};

module.exports = {
    validateRequestBodyMiddlewares
}