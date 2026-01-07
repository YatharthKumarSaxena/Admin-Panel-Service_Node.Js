// ✅ Enum Helpers using Factory Design Pattern
const { isValidEnumValue, getEnumKeyByValue } = require("./validators-factory.util");
const { logWithTime } = require("./time-stamps.util");

const {
  AdminType,
  AuthModes,
  BlockReasons,
  UnblockReasons,
  ActivationReasons,
  DeactivationReasons,
  AuthLogCheckReasons,
  RequestReviewReasons,
  UserAccountDetailsReasons,
  UserActiveDevicesReasons,
  UpdateAdminDetailsReasons,
  ChangeSupervisorReasons,
  DeviceType,
  PerformedBy,
  Roles,
  ServiceName,
  Status,
  IdentifierKeys,
  AuditMode,
  requestType,
  requestStatus,
  viewScope,
  ViewActivityTrackerReasons,
  BlockDeviceReasons,
  UnblockDeviceReasons,
  AdminCreationReasons,
  AdminUpdateRoleReasons,
  FetchAdminDetailsReasons,
  FetchUserDetailsReasons
} = require("@configs/enums.config");

const { tokenPayloads } = require("@configs/token.config");

/**
 * 🏭 Factory to create enum helper with boolean returns
 * Returns true/false only - caller decides response handling
 * This allows collecting multiple validation errors
 * 
 * @param {Object} enumObj - The frozen enum object
 * @param {String} name - Enum name for logging context
 */

const createEnumHelper = (enumObj, name) => ({
  validate: (value) => {
    const result = isValidEnumValue(enumObj, value);
    logWithTime(`[${name}] validate("${value}") →`, result);
    return result;
  },
  reverseLookup: (value) => {
    const result = getEnumKeyByValue(enumObj, value);
    logWithTime(`[${name}] reverseLookup("${value}") →`, result);
    return result;
  },
  getValidValues: () => {
    return Object.values(enumObj);
  },
  getName: () => name
});

// 🧩 Enum-specific helpers
const BlockReasonHelper = createEnumHelper(BlockReasons, "BlockReasons");
const UnblockReasonHelper = createEnumHelper(UnblockReasons, "UnblockReasons");
const ActivationReasonHelper = createEnumHelper(ActivationReasons, "ActivationReasons");
const DeactivationReasonHelper = createEnumHelper(DeactivationReasons, "DeactivationReasons");
const AuthLogCheckReasonHelper = createEnumHelper(AuthLogCheckReasons, "AuthLogCheckReasons");
const RequestReviewReasonHelper = createEnumHelper(RequestReviewReasons, "RequestReviewReasons");
const UserAccountDetailsReasonHelper = createEnumHelper(UserAccountDetailsReasons, "UserAccountDetailsReasons");
const UserActiveDevicesReasonHelper = createEnumHelper(UserActiveDevicesReasons, "UserActiveDevicesReasons");
const UpdateAdminDetailsReasonHelper = createEnumHelper(UpdateAdminDetailsReasons, "UpdateAdminDetailsReasons");
const ChangeSupervisorReasonHelper = createEnumHelper(ChangeSupervisorReasons, "ChangeSupervisorReasons");
const DeviceTypeHelper = createEnumHelper(DeviceType, "DeviceType");
const TokenPayloadHelper = createEnumHelper(tokenPayloads, "TokenPayloads");
const PerformedByHelper = createEnumHelper(PerformedBy,"PerformedBy")
const AdminTypeHelper = createEnumHelper(AdminType, "AdminType");
const AuthModesHelper = createEnumHelper(AuthModes, "AuthModes");
const RolesHelper = createEnumHelper(Roles, "Roles");
const ServiceNameHelper = createEnumHelper(ServiceName, "ServiceName");
const StatusHelper = createEnumHelper(Status, "Status");
const IdentifierKeysHelper = createEnumHelper(IdentifierKeys, "IdentifierKeys");
const AuditModeHelper = createEnumHelper(AuditMode, "AuditMode");
const RequestTypeHelper = createEnumHelper(requestType, "requestType");
const RequestStatusHelper = createEnumHelper(requestStatus, "requestStatus");
const ViewScopeHelper = createEnumHelper(viewScope, "viewScope");
const ViewActivityTrackerReasonsHelper = createEnumHelper(ViewActivityTrackerReasons, "ViewActivityTrackerReasons");
const BlockDeviceReasonHelper = createEnumHelper(BlockDeviceReasons, "BlockDeviceReasons");
const UnblockDeviceReasonHelper = createEnumHelper(UnblockDeviceReasons, "UnblockDeviceReasons");
const AdminCreationReasonHelper = createEnumHelper(AdminCreationReasons, "AdminCreationReasons");
const AdminUpdateRoleReasonHelper = createEnumHelper(AdminUpdateRoleReasons, "AdminUpdateRoleReasons");
const FetchAdminDetailsReasonHelper = createEnumHelper(FetchAdminDetailsReasons, "FetchAdminDetailsReasons");
const FetchUserDetailsReasonHelper = createEnumHelper(FetchUserDetailsReasons, "FetchUserDetailsReasons");

module.exports = {
  BlockReasonHelper,
  UnblockReasonHelper,
  ActivationReasonHelper,
  DeactivationReasonHelper,
  AuthLogCheckReasonHelper,
  RequestReviewReasonHelper,
  UserAccountDetailsReasonHelper,
  UserActiveDevicesReasonHelper,
  UpdateAdminDetailsReasonHelper,
  ChangeSupervisorReasonHelper,
  PerformedByHelper,
  DeviceTypeHelper,
  TokenPayloadHelper,
  AdminTypeHelper,
  AuthModesHelper,
  RolesHelper,
  ServiceNameHelper,
  StatusHelper,
  IdentifierKeysHelper,
  AuditModeHelper,
  RequestTypeHelper,
  RequestStatusHelper,
  ViewScopeHelper,
  ViewActivityTrackerReasonsHelper,
  BlockDeviceReasonHelper,
  UnblockDeviceReasonHelper,
  AdminCreationReasonHelper,
  AdminUpdateRoleReasonHelper,
  FetchAdminDetailsReasonHelper,
  FetchUserDetailsReasonHelper
};

