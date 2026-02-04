const { ensureUserExists, ensureUserNew } = require("../users/fetch-user.middleware");
const { ensureAdminExists, ensureAdminNew } = require("./fetch-admin.middleware");
const { validationMiddlewares } = require("./field-validation.middleware");
const { validateRequestBodyMiddlewares } = require("./validate-request-body.middleware")
const { validateCreateAdminInBulkRequestBody } = require("./validate-xlsx-body.middleware");

const adminMiddlewares = {
  ...validationMiddlewares,
  ...validateRequestBodyMiddlewares,
  validateCreateAdminInBulkRequestBody,
  ensureAdminExists,
  ensureAdminNew,
  ensureUserExists,
  ensureUserNew
};

module.exports = { adminMiddlewares };