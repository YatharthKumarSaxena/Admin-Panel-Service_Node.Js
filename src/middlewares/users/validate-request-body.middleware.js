const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const {
  blockUserRequiredFields,
  unblockUserRequiredFields,
  provideUserAccountDetailsRequiredFields,
  getUserActiveDevicesRequiredFields,
  checkAuthLogsRequiredFields
} = require("@configs/required-fields.config.js");

module.exports = {
  // User Status Operations
  validateBlockUserRequestBody: validateRequestBodyMiddleware(
    blockUserRequiredFields,
    "validateBlockUserRequestBody"
  ),

  validateUnblockUserRequestBody: validateRequestBodyMiddleware(
    unblockUserRequiredFields,
    "validateUnblockUserRequestBody"
  ),

  // User Details Operations
  validateProvideUserAccountDetailsRequestBody: validateRequestBodyMiddleware(
    provideUserAccountDetailsRequiredFields,
    "validateProvideUserAccountDetailsRequestBody"
  ),

  validateGetUserActiveDevicesRequestBody: validateRequestBodyMiddleware(
    getUserActiveDevicesRequiredFields,
    "validateGetUserActiveDevicesRequestBody"
  ),

  // Auth Logs Operations
  validateCheckAuthLogsRequestBody: validateRequestBodyMiddleware(
    checkAuthLogsRequiredFields,
    "validateCheckAuthLogsRequestBody"
  )
};
