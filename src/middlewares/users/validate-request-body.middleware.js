const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const {
  blockUserRequiredFields,
  unblockUserRequiredFields,
  fetchUserDetailsRequiredFields
} = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
  // User Status Operations
  validateBlockUserRequestBody: validateRequestBodyMiddleware(
    blockUserRequiredFields,
    "validateBlockUserRequestBody"
  ),

  validateUnblockUserRequestBody: validateRequestBodyMiddleware(
    unblockUserRequiredFields,
    "validateUnblockUserRequestBody"
  ),

  validateFetchUserDetailsRequestBody: validateRequestBodyMiddleware(
    fetchUserDetailsRequiredFields,
    "validateFetchUserDetailsRequestBody"
  )
};

module.exports = {
  validateRequestBodyMiddlewares
};