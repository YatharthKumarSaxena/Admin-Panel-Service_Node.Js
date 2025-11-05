const { validateXLSXFile } = require("../../utils/validate-xlsx.util");
const { adminCreationInBulkRequiredFields } = require("../../configs/required-fields.config");

module.exports = {
    validateCreateAdminInBulkRequestBody: validateXLSXFile(adminCreationInBulkRequiredFields, "validateCreateAdminInBulkRequestBody")
}