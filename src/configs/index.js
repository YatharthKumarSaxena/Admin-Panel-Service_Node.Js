const { DB_NAME, DB_URL } = require("./db.config");
const { adminCleanup, activityTrackerCleanup } = require("./cron.config");
const { throwAccessDeniedError, throwConflictError, throwDBResourceNotFoundError, throwInternalServerError, throwInvalidResourceError, throwResourceNotFoundError, throwSessionExpiredError, logMiddlewareError, getLogIdentifiers } = require("./error-handler.configs");
const { adminCreationRequiredFields, adminCreationInBulkRequiredFields } = require("./required-fields.config");
const { emailRegex, mongoIdRegex, customIdRegex, UUID_V4_REGEX, fullPhoneNumberRegex } = require("./regex.config");
const { validationRules, validationSets } = require("./validation.config");
const { RBACResources, ResourceCodes } = require("./rbac-resources.config");
const { RBACActions, ActionCodes } = require("./rbac-actions.config");
const { Permissions, RolePermissions, AllPermissions, getRolePermissions, roleHasPermission } = require("./rbac-permissions.config");

module.exports = {
  validationRules,
  validationSets,
  DB_NAME,
  DB_URL,
  adminCleanup,
  activityTrackerCleanup,
  throwAccessDeniedError,
  throwConflictError,
  throwDBResourceNotFoundError,
  throwInternalServerError,
  throwInvalidResourceError,
  throwResourceNotFoundError,
  throwSessionExpiredError,
  logMiddlewareError,
  getLogIdentifiers,
  adminCreationRequiredFields,
  adminCreationInBulkRequiredFields,
  emailRegex,
  mongoIdRegex,
  customIdRegex,
  UUID_V4_REGEX,
  fullPhoneNumberRegex,
  RBACResources,
  ResourceCodes,
  RBACActions,
  ActionCodes,
  Permissions,
  RolePermissions,
  AllPermissions,
  getRolePermissions,
  roleHasPermission
};