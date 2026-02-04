const { validateBody, validateQuery } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

const validationMiddlewares = {
  // Device Operations
  validateFetchDeviceDetailsFields: validateQuery(
    "fetchDeviceDetails",
    validationSets.fetchDeviceDetails
  ),
  validateBlockDeviceFields: validateBody(
    "blockDevice",
    validationSets.blockDevice
  ),
  validateUnblockDeviceFields: validateBody(
    "unblockDevice",
    validationSets.unblockDevice
  )
};

module.exports = {
  validationMiddlewares
};