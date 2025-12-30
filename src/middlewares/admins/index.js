const { validateCreateAdminRequestBody } = require("./validate-request-body.middleware");
const { validateCreateAdminInBulkRequestBody } = require("./validate-xlsx-body.middleware");
const { RoleMiddlewares } = require("./verify-admin-type.middleware");
const { hierarchyGuard } = require("./role-hierarchy.middleware");

const adminMiddlewares = {
  validateCreateAdminRequestBody,
  validateCreateAdminInBulkRequestBody,
  hierarchyGuard,
  ...RoleMiddlewares
};

module.exports = { adminMiddlewares };