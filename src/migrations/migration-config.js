/**
 * 📋 Migration Configuration
 * Legacy collections mapping and configuration
 */

const { requestType } = require("@configs/enums.config");
const { RoleChangeRequestModel } = require("@models/role-change-request.model");
const { ClientOnboardingSelfRequestModel } = require("@models/client-onboarding-request.model");

/**
 * Legacy collections configuration
 * Maps old collection names to target models and types
 */
const LEGACY_COLLECTIONS = {
  role_change_requests: {
    model: RoleChangeRequestModel,
    type: requestType.ROLE_CHANGE
  },
  admin_status_requests: {
    model: null, // Determined by requestType field
    typeField: "requestType" // Uses existing requestType to determine discriminator
  },
  permission_requests: {
    model: null, // Determined by requestType field
    typeField: "requestType"
  },
  client_onboarding_requests: {
    model: ClientOnboardingSelfRequestModel,
    type: requestType.CLIENT_ONBOARDING
  }
};

module.exports = {
  LEGACY_COLLECTIONS
};
