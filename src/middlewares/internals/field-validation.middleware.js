const { validateBody, validateQuery } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

/**
 * Field Validation Middlewares for User Operations
 * Validates enum values, regex patterns, and field lengths
 */

const validationMiddlewares = {
  // User Details Operations
  validateProvideUserAccountDetailsFields: validateQuery("provideUserAccountDetails", validationSets.provideUserAccountDetails),
  validateGetUserActiveDevicesFields: validateQuery("getUserActiveDevices", validationSets.getUserActiveDevices),

  // Auth Logs Operations
  validateCheckAuthLogsFields: validateQuery("checkAuthLogs", validationSets.checkAuthLogs)
};

module.exports = {
  validationMiddlewares
}
