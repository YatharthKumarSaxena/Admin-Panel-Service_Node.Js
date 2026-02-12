const { ActivityTrackerModel } = require("./activity-tracker.model");
const { AdminModel } = require("./admin.model");
const { UserModel } = require("./user.model");
const { DeviceModel } = require("./device.model");
const { SpecialPermissionModel } = require("./special-permission.model");
const { BlockPermissionModel } = require("./block-permission.model");

// 🔄 New: Base Request Model (for polymorphic queries)
const { BaseRequestModel } = require("./base-request.model");

// 🎭 Request Discriminators (all share admin_requests collection)
const { RoleChangeRequestModel } = require("./role-change-request.model");
const { 
  AdminActivationRequestModel, 
  AdminDeactivationRequestModel,
  AdminStatusRequestModel // Backward compatibility alias
} = require("./admin-status-request.model");
const { 
  PermissionGrantRequestModel,
  PermissionRevokeRequestModel,
  PermissionRequestModel // Backward compatibility alias
} = require("./permission-request.model");
const { ClientOnboardingRequestModel } = require("./client-onboarding-request.model");

const models = {
  ActivityTrackerModel,
  AdminModel,
  UserModel,
  DeviceModel,
  SpecialPermissionModel,
  BlockPermissionModel,
  
  // Base model for polymorphic queries
  BaseRequestModel,
  
  // Discriminator models
  RoleChangeRequestModel,
  AdminActivationRequestModel,
  AdminDeactivationRequestModel,
  AdminStatusRequestModel, // Backward compatibility
  PermissionGrantRequestModel,
  PermissionRevokeRequestModel,
  PermissionRequestModel, // Backward compatibility
  ClientOnboardingRequestModel
}

module.exports = {
  ...models
};