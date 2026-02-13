/**
 * 🗺️ Request Type to Model Mapper
 * Maps request types to their corresponding discriminator models
 */

const { requestType } = require("@configs/enums.config");
const { RoleChangeRequestModel } = require("@models/role-change-request.model");
const { AdminActivationRequestModel, AdminDeactivationRequestModel } = require("@models/admin-status-request.model");
const { PermissionGrantRequestModel, PermissionRevokeRequestModel } = require("@models/permission-request.model");
const { ClientOnboardingAdminRequestModel } = require("@models/client-onboarding-admin-request.model");
const { ClientOnboardingSelfRequestModel } = require("@models/client-onboarding-request.model");

/**
 * Map request type to discriminator model
 * @param {string} type - Request type from requestType enum
 * @returns {Model|null} - Mongoose discriminator model or null
 */
function getModelForRequestType(type) {
  const typeModelMap = {
    [requestType.ACTIVATION]: AdminActivationRequestModel,
    [requestType.DEACTIVATION]: AdminDeactivationRequestModel,
    [requestType.PERMISSION_GRANT]: PermissionGrantRequestModel,
    [requestType.PERMISSION_REVOKE]: PermissionRevokeRequestModel,
    [requestType.CLIENT_ONBOARDING_ADMIN]: ClientOnboardingAdminRequestModel,
    [requestType.ROLE_CHANGE]: RoleChangeRequestModel,
    [requestType.CLIENT_ONBOARDING]: ClientOnboardingSelfRequestModel
  };

  return typeModelMap[type] || null;
}

/**
 * Determine model and type for document based on config
 * @param {object} doc - Document from legacy collection
 * @param {object} config - Collection configuration
 * @returns {{model: Model, type: string}} - Model and type
 */
function determineModelAndType(doc, config) {
  let model, type;

  if (config.typeField) {
    // Use existing requestType field to determine discriminator
    type = doc[config.typeField];
    model = getModelForRequestType(type);

    if (!model) {
      throw new Error(`No model found for request type: ${type}`);
    }
  } else {
    // Use config-defined model and type
    model = config.model;
    type = config.type;
  }

  return { model, type };
}

module.exports = {
  getModelForRequestType,
  determineModelAndType
};
