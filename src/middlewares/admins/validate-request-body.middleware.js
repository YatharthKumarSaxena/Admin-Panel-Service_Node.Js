const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const {
  adminCreationRequiredFields,
  updateAdminDetailsRequiredFields,
  activateAdminRequiredFields,
  deactivateAdminRequiredFields,
  changeSupervisorRequiredFields,
  updateAdminRoleRequiredFields,
  fetchAdminDetailsRequiredFields
} = require("@configs/required-fields.config.js");

const validateRequestBodyMiddlewares = {
  // Admin Management
  validateCreateAdminRequestBody: validateRequestBodyMiddleware(
    adminCreationRequiredFields,
    "validateCreateAdminRequestBody"
  ),
  
  validateUpdateAdminDetailsRequestBody: validateRequestBodyMiddleware(
    updateAdminDetailsRequiredFields,
    "validateUpdateAdminDetailsRequestBody"
  ),

  // Admin Status Operations
  validateActivateAdminRequestBody: validateRequestBodyMiddleware(
    activateAdminRequiredFields,
    "validateActivateAdminRequestBody"
  ),

  validateDeactivateAdminRequestBody: validateRequestBodyMiddleware(
    deactivateAdminRequiredFields,
    "validateDeactivateAdminRequestBody"
  ),

  // Supervisor Management
  validateChangeSupervisorRequestBody: validateRequestBodyMiddleware(
    changeSupervisorRequiredFields,
    "validateChangeSupervisorRequestBody"
  ),

  validateUpdateAdminRoleRequestBody: validateRequestBodyMiddleware(
    updateAdminRoleRequiredFields,
    "validateUpdateAdminRoleRequestBody"
  ),

  validateFetchAdminDetailsRequestBody: validateRequestBodyMiddleware(
    fetchAdminDetailsRequiredFields,
    "validateFetchAdminDetailsRequestBody"
  )
}

module.exports = {
  validateRequestBodyMiddlewares
};