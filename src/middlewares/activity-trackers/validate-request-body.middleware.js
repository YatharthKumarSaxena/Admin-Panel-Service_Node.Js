const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const { viewAdminActivityTrackerRequiredFields, listActivityTrackerRequiredFields } = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
  validateViewAdminActivityTrackerRequestBody: validateRequestBodyMiddleware(
    viewAdminActivityTrackerRequiredFields,
    "validateViewAdminActivityTrackerRequestBody"
  ),
  validateListActivityTrackerRequestBody: validateRequestBodyMiddleware(
    listActivityTrackerRequiredFields,
    "validateListActivityTrackerRequestBody"
  )
};

module.exports = {
    validateRequestBodyMiddlewares
}