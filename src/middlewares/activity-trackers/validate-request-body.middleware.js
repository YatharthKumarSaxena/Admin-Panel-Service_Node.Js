const { checkQueryPresence } = require("../factory/validate-request-body.middleware-factory");
const { viewAdminActivityTrackerRequiredFields, listActivityTrackerRequiredFields } = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
  validateViewAdminActivityTrackerRequestBody: checkQueryPresence(
    "validateViewAdminActivityTrackerRequestBody",
    viewAdminActivityTrackerRequiredFields
  )
};

module.exports = {
    validateRequestBodyMiddlewares
}