const { 
  UUID_V4_REGEX, 
  mongoIdRegex, 
  adminIdRegex,
  firstNameRegex
} = require("./regex.config");

const { 
  deviceNameLength,
  reasonFieldLength,
  notesFieldLength,
  adminIdLength,
  mongoIdLength,
  uuidV4Length,
  firstNameLength
} = require("./fields-length.config");

const {
  AdminTypeHelper,
  StatusHelper,
  AdminStatusHelper,
  BlockReasonHelper,
  UnblockReasonHelper,
  ActivationReasonHelper,
  DeactivationReasonHelper,
  AuthLogCheckReasonHelper,
  RequestReviewReasonHelper,
  UserAccountDetailsReasonHelper,
  UserActiveDevicesReasonHelper,
  UpdateAdminDetailsReasonHelper,
  DeviceTypeHelper,
  PerformedByHelper,
  ChangeSupervisorReasonHelper,
  ViewActivityTrackerReasonsHelper,
  BlockDeviceReasonHelper,
  UnblockDeviceReasonHelper,
  AdminCreationReasonHelper,
  AdminUpdateRoleReasonHelper,
  FetchAdminDetailsReasonHelper,
  FetchUserDetailsReasonHelper,
  FetchDeviceDetailsReasonHelper
} = require("@utils/enum-validators.util");

const validationRules = {

  firstName: {
    length: firstNameLength,
    regex: firstNameRegex
  },

  adminCreationReason: {
    enum: AdminCreationReasonHelper
  },

  adminUpdateRoleReason: {
    enum: AdminUpdateRoleReasonHelper
  },
  
  deviceId: {
    length: uuidV4Length,
    regex: UUID_V4_REGEX 
  },

  deviceName: {
    length: deviceNameLength
  },

  deviceType: {
    enum: DeviceTypeHelper
  },
  
  adminId: {
    length: adminIdLength,
    regex: adminIdRegex
  },

  changeSupervisorReason: {
    enum: ChangeSupervisorReasonHelper
  },

  adminType: {
    enum: AdminTypeHelper 
  },

  status: {
    enum: StatusHelper 
  },

  adminStatus: {
    enum: AdminStatusHelper
  },
  
  id: {
    length: mongoIdLength,
    regex: mongoIdRegex
  },

  reason: {
    length: reasonFieldLength
  },

  notes: {
    length: notesFieldLength
  },

  blockReason: {
    enum: BlockReasonHelper
  },

  unblockReason: {
    enum: UnblockReasonHelper
  },

  activationReason: {
    enum: ActivationReasonHelper
  },

  deactivationReason: {
    enum: DeactivationReasonHelper
  },

  authLogCheckReason: {
    enum: AuthLogCheckReasonHelper
  },

  requestReviewReason: {
    enum: RequestReviewReasonHelper
  },

  userAccountDetailsReason: {
    enum: UserAccountDetailsReasonHelper
  },

  userActiveDevicesReason: {
    enum: UserActiveDevicesReasonHelper
  },

  updateAdminDetailsReason: {
    enum: UpdateAdminDetailsReasonHelper
  },

  performedBy: {
    enum: PerformedByHelper
  },

  newSupervisorId: {
    length: adminIdLength,
    regex: adminIdRegex
  },

  reasonDetails: {
    length: reasonFieldLength
  },

  reviewNotes: {
    length: notesFieldLength
  },

  activityTrackerReason: {
    enum: ViewActivityTrackerReasonsHelper
  },

  blockDeviceReason: {
    enum: BlockDeviceReasonHelper
  },
  
  unblockDeviceReason: {
    enum: UnblockDeviceReasonHelper
  },

  fetchAdminDetailsReason: {
    enum: FetchAdminDetailsReasonHelper
  },

  fetchUserDetailsReason: {
    enum: FetchUserDetailsReasonHelper
  },

  fetchDeviceDetailsReason: {
    enum: FetchDeviceDetailsReasonHelper
  }
};

module.exports = {
  validationRules
};
