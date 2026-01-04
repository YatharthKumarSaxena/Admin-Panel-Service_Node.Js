const { validateRequestBodyMiddleware } = require("../factory/validate-request-body.middleware-factory");
const {
  adminCreationRequiredFields,
  updateAdminDetailsRequiredFields,
  activateAdminRequiredFields,
  deactivateAdminRequiredFields,
  approveActivationRequestRequiredFields,
  rejectActivationRequestRequiredFields,
  approveDeactivationRequestRequiredFields,
  rejectDeactivationRequestRequiredFields,
  createActivationRequestRequiredFields,
  createDeactivationRequestRequiredFields,
  changeSupervisorRequiredFields,
  viewAdminActivityTrackerRequiredFields,
  listActivityTrackerRequiredFields
} = require("@configs/required-fields.config.js");

module.exports = {
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

  validateApproveActivationRequestBody: validateRequestBodyMiddleware(
    approveActivationRequestRequiredFields,
    "validateApproveActivationRequestBody"
  ),

  validateRejectActivationRequestBody: validateRequestBodyMiddleware(
    rejectActivationRequestRequiredFields,
    "validateRejectActivationRequestBody"
  ),

  validateApproveDeactivationRequestBody: validateRequestBodyMiddleware(
    approveDeactivationRequestRequiredFields,
    "validateApproveDeactivationRequestBody"
  ),

  validateRejectDeactivationRequestBody: validateRequestBodyMiddleware(
    rejectDeactivationRequestRequiredFields,
    "validateRejectDeactivationRequestBody"
  ),

  validateCreateActivationRequestBody: validateRequestBodyMiddleware(
    createActivationRequestRequiredFields,
    "validateCreateActivationRequestBody"
  ),

  validateCreateDeactivationRequestBody: validateRequestBodyMiddleware(
    createDeactivationRequestRequiredFields,
    "validateCreateDeactivationRequestBody"
  ),

  // Supervisor Management
  validateChangeSupervisorRequestBody: validateRequestBodyMiddleware(
    changeSupervisorRequiredFields,
    "validateChangeSupervisorRequestBody"
  ),

  validateViewAdminActivityTrackerRequestBody: validateRequestBodyMiddleware(
    viewAdminActivityTrackerRequiredFields,
    "validateViewAdminActivityTrackerRequestBody"
  ),

  validateListActivityTrackerRequestBody: validateRequestBodyMiddleware(
    listActivityTrackerRequiredFields,
    "validateListActivityTrackerRequestBody"
  ),

  validateUpdateOwnAdminDetailsRequestBody: validateRequestBodyMiddleware(
    updateAdminDetailsRequiredFields,
    "validateUpdateOwnAdminDetailsRequestBody"
  )
};