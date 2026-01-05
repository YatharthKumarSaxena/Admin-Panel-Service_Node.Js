const { fieldValidationMiddleware } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

/**
 * Field Validation Middlewares for Admin Operations
 * Validates enum values, regex patterns, and field lengths
 */

const validationMiddlewares = {
  // Admin Management
  validateCreateAdminFields: fieldValidationMiddleware("createAdmin", validationSets.createAdmin),
  validateUpdateAdminDetailsFields: fieldValidationMiddleware("updateAdminDetails", validationSets.updateAdminDetails),
  validateUpdateAdminRoleFields: fieldValidationMiddleware("updateAdminRole", validationSets.updateAdminRole),
  validateFetchAdminDetailsFields: fieldValidationMiddleware("fetchAdminDetails", validationSets.fetchAdminDetails),
  // Admin Status Operations
  validateActivateAdminFields: fieldValidationMiddleware("activateAdmin", validationSets.activateAdmin),
  validateDeactivateAdminFields: fieldValidationMiddleware("deactivateAdmin", validationSets.deactivateAdmin),
  validateChangeSupervisorFields: fieldValidationMiddleware("changeSupervisor", validationSets.changeSupervisor)

}

module.exports = {
  validationMiddlewares
};
