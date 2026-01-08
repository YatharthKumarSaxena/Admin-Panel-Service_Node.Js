const { fieldValidationMiddleware } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

const validationMiddlewares = {
  // Device Operations
  validateFetchDeviceDetailsFields: fieldValidationMiddleware(
    "fetchDeviceDetails",
    validationSets.fetchDeviceDetails
  ),
  validateBlockDeviceFields: fieldValidationMiddleware(
    "blockDevice",
    validationSets.blockDevice
  ),
  validateUnblockDeviceFields: fieldValidationMiddleware(
    "unblockDevice",
    validationSets.unblockDevice
  )
};

module.exports = {
  validationMiddlewares
};