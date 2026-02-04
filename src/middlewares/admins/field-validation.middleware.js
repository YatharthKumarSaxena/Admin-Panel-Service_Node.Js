const { validateBody, validateQuery } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

/**
 * Field Validation Middlewares for Admin Operations
 * Validates enum values, regex patterns, and field lengths
 */

const validationMiddlewares = {
  // Admin Management
  validateCreateAdminFields: validateBody("createAdmin", validationSets.createAdmin),
  validateUpdateAdminDetailsFields: validateBody("updateAdminDetails", validationSets.updateAdminDetails),
  validateUpdateAdminRoleFields: validateBody("updateAdminRole", validationSets.updateAdminRole),
  validateFetchAdminDetailsFields: validateQuery("fetchAdminDetails", validationSets.fetchAdminDetails),
  // Admin Status Operations
  validateActivateAdminFields: validateBody("activateAdmin", validationSets.activateAdmin),
  validateDeactivateAdminFields: validateBody("deactivateAdmin", validationSets.deactivateAdmin),
  validateChangeSupervisorFields: validateBody("changeSupervisor", validationSets.changeSupervisor)

}

module.exports = {
  validationMiddlewares
};
