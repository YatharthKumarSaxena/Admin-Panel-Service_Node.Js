const { ActivityTrackerModel } = require("./activity-tracker.model");
const { AdminModel } = require("./admin.model");
const { UserModel } = require("./user.model");
const { DeviceModel } = require("./device.model");
const { SpecialPermissionModel } = require("./special-permission.model");
const { BlockPermissionModel } = require("./block-permission.model");
const { CounterModel } = require("./counter.model");
const { ServiceTrackerModel } = require("./service-tracker.model");

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
const { ClientOnboardingSelfRequestModel } = require("./client-onboarding-request.model");
const { ClientOnboardingAdminRequestModel } = require("./client-onboarding-admin-request.model");

const models = {
  ActivityTrackerModel,
  AdminModel,
  UserModel,
  DeviceModel,
  SpecialPermissionModel,
  BlockPermissionModel,
  CounterModel,
  ServiceTrackerModel,
  
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
  ClientOnboardingSelfRequestModel,
  ClientOnboardingAdminRequestModel,
  
  // Backward compatibility aliases
  ClientOnboardingRequestModel: ClientOnboardingSelfRequestModel
}

module.exports = {
  ...models
};