const { validateRequestBodyMiddleware } = require("../common/validate-request-body.middleware-factory.js.js");
const { adminCreationRequiredFields } = require("../../configs/required-fields.config.js");

module.exports = {
    validateCreateAdminRequestBody: validateRequestBodyMiddleware(adminCreationRequiredFields)
}