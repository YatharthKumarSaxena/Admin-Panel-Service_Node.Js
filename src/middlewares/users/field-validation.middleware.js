const { validateBody, validateQuery } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

/**
 * Field Validation Middlewares for User Operations
 * Validates enum values, regex patterns, and field lengths
 */

const validationMiddlewares = {
  // User Status Operations
  validateBlockUserFields: validateBody("blockUser", validationSets.blockUser),
  validateUnblockUserFields: validateBody("unblockUser", validationSets.unblockUser),
  validateFetchUserBlockDetailsFields: validateQuery("fetchUserBlockDetails", validationSets.fetchUserDetails)
};

module.exports = {
  validationMiddlewares
};
