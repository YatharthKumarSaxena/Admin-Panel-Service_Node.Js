const { validationMiddlewares } = require("./field-validation.middleware");
const { validateRequestBodyMiddlewares } = require("./validate-request-body.middleware")
const { validateCreateAdminInBulkRequestBody } = require("./validate-xlsx-body.middleware");

const adminMiddlewares = {
  ...validationMiddlewares,
  ...validateRequestBodyMiddlewares,
  validateCreateAdminInBulkRequestBody
};

module.exports = { adminMiddlewares };