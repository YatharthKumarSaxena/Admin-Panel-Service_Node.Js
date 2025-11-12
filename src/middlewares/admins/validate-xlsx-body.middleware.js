const { validateXLSXMiddleware } = require("../factory/validate-xlsx.middleware-factory");
const { adminCreationInBulkRequiredFields } = require("../../configs/required-fields.config");

module.exports = {
    validateCreateAdminInBulkRequestBody: validateXLSXMiddleware(adminCreationInBulkRequiredFields, "validateCreateAdminInBulkRequestBody")
}