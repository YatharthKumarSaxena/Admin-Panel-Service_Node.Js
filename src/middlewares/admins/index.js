const { validateCreateAdminRequestBody } = require("./validate-request-body.middleware");
const { validateCreateAdminInBulkRequestBody } = require("./validate-xlsx-body.middleware");
const { RoleMiddlewares } = require("./verify-admin-type.middleware");

const adminMiddlewares = {
  validateCreateAdminRequestBody,
  validateCreateAdminInBulkRequestBody,
  ...RoleMiddlewares
};

module.exports = { adminMiddlewares };