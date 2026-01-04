const { fieldValidationMiddleware } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

/**
 * Field Validation Middlewares for User Operations
 * Validates enum values, regex patterns, and field lengths
 */

module.exports = {
  // User Status Operations
  validateBlockUserFields: fieldValidationMiddleware("blockUser", validationSets.blockUser),
  validateUnblockUserFields: fieldValidationMiddleware("unblockUser", validationSets.unblockUser),

  // User Details Operations
  validateProvideUserAccountDetailsFields: fieldValidationMiddleware("provideUserAccountDetails", validationSets.provideUserAccountDetails),
  validateGetUserActiveDevicesFields: fieldValidationMiddleware("getUserActiveDevices", validationSets.getUserActiveDevices),

  // Auth Logs Operations
  validateCheckAuthLogsFields: fieldValidationMiddleware("checkAuthLogs", validationSets.checkAuthLogs)
};
