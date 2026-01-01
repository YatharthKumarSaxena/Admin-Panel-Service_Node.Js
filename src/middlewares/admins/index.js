const { validateCreateAdminRequestBody } = require("./validate-request-body.middleware");
const { validateCreateAdminInBulkRequestBody } = require("./validate-xlsx-body.middleware");
const { RoleMiddlewares } = require("./verify-admin-type.middleware");
const { hierarchyGuard } = require("./role-hierarchy.middleware");
const {
  validateActivateAdminRequestBody,
  validateDeactivateAdminRequestBody,
  validateBlockAdminRequestBody,
  validateUnblockAdminRequestBody
} = require("./validate-admin-status-operations.middleware");

const adminMiddlewares = {
  validateCreateAdminRequestBody,
  validateCreateAdminInBulkRequestBody,
  validateActivateAdminRequestBody,
  validateDeactivateAdminRequestBody,
  validateBlockAdminRequestBody,
  validateUnblockAdminRequestBody,
  hierarchyGuard,
  ...RoleMiddlewares
};

module.exports = { adminMiddlewares };