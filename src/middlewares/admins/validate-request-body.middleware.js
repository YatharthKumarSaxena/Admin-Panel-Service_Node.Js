const { checkBodyPresence, checkQueryPresence } = require("../factory/validate-request-body.middleware-factory");
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
  validateCreateAdminRequestBody: checkBodyPresence(
    "validateCreateAdminRequestBody",
    adminCreationRequiredFields
  ),
  
  validateUpdateAdminDetailsRequestBody: checkBodyPresence(
    "validateUpdateAdminDetailsRequestBody",
    updateAdminDetailsRequiredFields
  ),

  // Admin Status Operations
  validateActivateAdminRequestBody: checkBodyPresence(
    "validateActivateAdminRequestBody",
    activateAdminRequiredFields
  ),

  validateDeactivateAdminRequestBody: checkBodyPresence(
    "validateDeactivateAdminRequestBody",
    deactivateAdminRequiredFields
  ),

  // Supervisor Management
  validateChangeSupervisorRequestBody: checkBodyPresence(
    "validateChangeSupervisorRequestBody",
    changeSupervisorRequiredFields
  ),

  validateUpdateAdminRoleRequestBody: checkBodyPresence(
    "validateUpdateAdminRoleRequestBody",
    updateAdminRoleRequiredFields
  ),

  validateFetchAdminDetailsRequestBody: checkQueryPresence(
    "validateFetchAdminDetailsRequestBody",
    fetchAdminDetailsRequiredFields
  )
}

module.exports = {
  validateRequestBodyMiddlewares
};