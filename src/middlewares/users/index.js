const {
  validateBlockUserRequestBody,
  validateUnblockUserRequestBody,
  validateProvideUserAccountDetailsRequestBody,
  validateGetUserActiveDevicesRequestBody,
  validateCheckAuthLogsRequestBody
} = require("./validate-request-body.middleware");

const {
  validateBlockUserFields,
  validateUnblockUserFields,
  validateProvideUserAccountDetailsFields,
  validateGetUserActiveDevicesFields,
  validateCheckAuthLogsFields
} = require("./field-validation.middleware");

const { blockUserIfBlocked } = require("./block-user.middleware");
const { checkIfUserUnblocked } = require("./unblock-user.middleware");

const userMiddlewares = {
  // Request Body Validation (Required Fields)
  validateBlockUserRequestBody,
  validateUnblockUserRequestBody,
  validateProvideUserAccountDetailsRequestBody,
  validateGetUserActiveDevicesRequestBody,
  validateCheckAuthLogsRequestBody,

  // Field Validation (Enum/Regex/Length)
  validateBlockUserFields,
  validateUnblockUserFields,
  validateProvideUserAccountDetailsFields,
  validateGetUserActiveDevicesFields,
  validateCheckAuthLogsFields,

  // User Status Checks
  blockUserIfBlocked,
  checkIfUserUnblocked
};

module.exports = { userMiddlewares };
