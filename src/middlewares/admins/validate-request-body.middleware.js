const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const { adminCreationRequiredFields } = require("@configs/required-fields.config.js");

module.exports = {
    validateCreateAdminRequestBody: validateRequestBodyMiddleware(adminCreationRequiredFields, "validateCreateAdminRequestBody")
}