const {
  validateCreateAdminRequestBody,
  validateUpdateAdminDetailsRequestBody,
  validateActivateAdminRequestBody,
  validateDeactivateAdminRequestBody,
  validateApproveActivationRequestBody,
  validateRejectActivationRequestBody,
  validateApproveDeactivationRequestBody,
  validateRejectDeactivationRequestBody,
  validateCreateActivationRequestBody,
  validateCreateDeactivationRequestBody,
  validateChangeSupervisorRequestBody,
  validateViewAdminActivityTrackerRequestBody,
  validateListActivityTrackerRequestBody
} = require("./validate-request-body.middleware");

const {
  validateCreateAdminFields,
  validateUpdateAdminDetailsFields,
  validateActivateAdminFields,
  validateDeactivateAdminFields,
  validateApproveActivationRequestFields,
  validateRejectActivationRequestFields,
  validateApproveDeactivationRequestFields,
  validateRejectDeactivationRequestFields,
  validateCreateActivationRequestFields,
  validateCreateDeactivationRequestFields,
  validateChangeSupervisorFields,
  validateViewAdminActivityTrackerFields,
  validateListActivityTrackerFields,
} = require("./field-validation.middleware");

const { validateCreateAdminInBulkRequestBody } = require("./validate-xlsx-body.middleware");
const { RoleMiddlewares } = require("./verify-admin-type.middleware");
const { hierarchyGuard } = require("./role-hierarchy.middleware");

const adminMiddlewares = {
  // Request Body Validation (Required Fields)
  validateCreateAdminRequestBody,
  validateUpdateAdminDetailsRequestBody,
  validateActivateAdminRequestBody,
  validateDeactivateAdminRequestBody,
  validateApproveActivationRequestBody,
  validateRejectActivationRequestBody,
  validateApproveDeactivationRequestBody,
  validateRejectDeactivationRequestBody,
  validateCreateActivationRequestBody,
  validateCreateDeactivationRequestBody,
  validateChangeSupervisorRequestBody,
  validateCreateAdminInBulkRequestBody,
  validateViewAdminActivityTrackerRequestBody,
  validateListActivityTrackerRequestBody,

  // Field Validation (Enum/Regex/Length)
  validateCreateAdminFields,
  validateUpdateAdminDetailsFields,
  validateActivateAdminFields,
  validateDeactivateAdminFields,
  validateApproveActivationRequestFields,
  validateRejectActivationRequestFields,
  validateApproveDeactivationRequestFields,
  validateRejectDeactivationRequestFields,
  validateCreateActivationRequestFields,
  validateCreateDeactivationRequestFields,
  validateChangeSupervisorFields,
  validateViewAdminActivityTrackerFields,
  validateListActivityTrackerFields,

  // Role & Hierarchy
  hierarchyGuard,
  ...RoleMiddlewares
};

module.exports = { adminMiddlewares };