const { fieldValidationMiddleware } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

/**
 * Field Validation Middlewares for User Operations
 * Validates enum values, regex patterns, and field lengths
 */

const validationMiddlewares = {
  // User Status Operations
  validateBlockUserFields: fieldValidationMiddleware("blockUser", validationSets.blockUser),
  validateUnblockUserFields: fieldValidationMiddleware("unblockUser", validationSets.unblockUser)
};

module.exports = {
  validationMiddlewares
};
