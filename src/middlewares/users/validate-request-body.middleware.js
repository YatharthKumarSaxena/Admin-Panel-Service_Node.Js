const { checkBodyPresence, checkQueryPresence } = require("../factory/validate-request-body.middleware-factory");
const {
  blockUserRequiredFields,
  unblockUserRequiredFields,
  fetchUserBlockDetailsRequiredFields
} = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
  // User Status Operations
  validateBlockUserRequestBody: checkBodyPresence(
    blockUserRequiredFields,
    "validateBlockUserRequestBody"
  ),

  validateUnblockUserRequestBody: checkBodyPresence(
    unblockUserRequiredFields,
    "validateUnblockUserRequestBody"
  ),

  validateFetchUserBlockDetailsRequestBody: checkQueryPresence(
    fetchUserBlockDetailsRequiredFields,
    "validateFetchUserBlockDetailsRequestBody"
  )
};

module.exports = {
  validateRequestBodyMiddlewares
};