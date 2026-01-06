const { fieldValidationMiddleware } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

/**
 * Field Validation Middlewares for User Operations
 * Validates enum values, regex patterns, and field lengths
 */

const validationMiddlewares = {
  // User Status Operations
  validateBlockDeviceFields: fieldValidationMiddleware("blockDevice", validationSets.blockDevice),
  validateUnblockDeviceFields: fieldValidationMiddleware("unblockDevice", validationSets.unblockDevice),
  // User Details Operations
  validateProvideUserAccountDetailsFields: fieldValidationMiddleware("provideUserAccountDetails", validationSets.provideUserAccountDetails),
  validateGetUserActiveDevicesFields: fieldValidationMiddleware("getUserActiveDevices", validationSets.getUserActiveDevices),

  // Auth Logs Operations
  validateCheckAuthLogsFields: fieldValidationMiddleware("checkAuthLogs", validationSets.checkAuthLogs)
};

module.exports = {
  validationMiddlewares
}
