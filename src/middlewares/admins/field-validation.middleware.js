const { fieldValidationMiddleware } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");
/**
 * Field Validation Middlewares for Admin Operations
 * Validates enum values, regex patterns, and field lengths
 */

module.exports = {
  // Admin Management
  validateCreateAdminFields: fieldValidationMiddleware("createAdmin", validationSets.createAdmin),
  validateUpdateAdminDetailsFields: fieldValidationMiddleware("updateAdminDetails", validationSets.updateAdminDetails),

  // Admin Status Operations
  validateActivateAdminFields: fieldValidationMiddleware("activateAdmin", validationSets.activateAdmin),
  validateDeactivateAdminFields: fieldValidationMiddleware("deactivateAdmin", validationSets.deactivateAdmin),
  validateApproveActivationRequestFields: fieldValidationMiddleware("approveActivationRequest", validationSets.approveActivationRequest),
  validateRejectActivationRequestFields: fieldValidationMiddleware("rejectActivationRequest", validationSets.rejectActivationRequest),
  validateApproveDeactivationRequestFields: fieldValidationMiddleware("approveDeactivationRequest", validationSets.approveDeactivationRequest),
  validateRejectDeactivationRequestFields: fieldValidationMiddleware("rejectDeactivationRequest", validationSets.rejectDeactivationRequest),
  validateCreateActivationRequestFields: fieldValidationMiddleware("createActivationRequest", validationSets.createActivationRequest),
  validateCreateDeactivationRequestFields: fieldValidationMiddleware("createDeactivationRequest", validationSets.createDeactivationRequest),
  validateChangeSupervisorFields: fieldValidationMiddleware("changeSupervisor", validationSets.changeSupervisor),
  validateViewAdminActivityTrackerFields: fieldValidationMiddleware("viewAdminActivityTracker", validationSets.viewAdminActivityTracker),
  validateListActivityTrackerFields: fieldValidationMiddleware("listActivityTracker", validationSets.listActivityTracker)
};
