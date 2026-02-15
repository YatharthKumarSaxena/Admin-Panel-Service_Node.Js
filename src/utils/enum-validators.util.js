// ✅ Enum Helpers using Factory Design Pattern
const { isValidEnumValue, getEnumKeyByValue } = require("./validators-factory.util");
const { logWithTime } = require("./time-stamps.util");

const {
  AdminTypes,
  AuthModes,
  DeviceTypes,
  PerformedBy,
  Roles,
  ServiceNames,
  Status,
  AuditMode,
  requestType,
  requestStatus,
  viewScope,
  PermissionEffect,
  OverrideType,
  ClientStatus
} = require("@configs/enums.config");

const {
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
  BlockDeviceReasons,
  UnblockDeviceReasons,
  AdminCreationReasons,
  AdminUpdateRoleReasons,
  FetchAdminDetailsReasons,
  FetchUserDetailsReasons,
  FetchDeviceDetailsReasons,
  ViewActivityTrackerReasons,
  SpecialPermissionReasons,
  BlockPermissionReasons,
  ClientCreationReasons,
  ClientRevertReasons,
  RoleChangeReasons
} = require("@configs/reasons.config");

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
const DeviceTypeHelper = createEnumHelper(DeviceTypes, "DeviceTypes");
const TokenPayloadHelper = createEnumHelper(tokenPayloads, "TokenPayloads");
const PerformedByHelper = createEnumHelper(PerformedBy,"PerformedBy");
const AdminTypeHelper = createEnumHelper(AdminTypes, "AdminTypes");
const AuthModesHelper = createEnumHelper(AuthModes, "AuthModes");
const RolesHelper = createEnumHelper(Roles, "Roles");
const ServiceNameHelper = createEnumHelper(ServiceNames, "ServiceNames");
const StatusHelper = createEnumHelper(Status, "Status");
const AuditModeHelper = createEnumHelper(AuditMode, "AuditMode");
const RequestTypeHelper = createEnumHelper(requestType, "requestType");
const RequestStatusHelper = createEnumHelper(requestStatus, "requestStatus");
const ViewScopeHelper = createEnumHelper(viewScope, "viewScope");
const BlockDeviceReasonHelper = createEnumHelper(BlockDeviceReasons, "BlockDeviceReasons");
const UnblockDeviceReasonHelper = createEnumHelper(UnblockDeviceReasons, "UnblockDeviceReasons");
const AdminCreationReasonHelper = createEnumHelper(AdminCreationReasons, "AdminCreationReasons");
const AdminUpdateRoleReasonHelper = createEnumHelper(AdminUpdateRoleReasons, "AdminUpdateRoleReasons");
const FetchAdminDetailsReasonHelper = createEnumHelper(FetchAdminDetailsReasons, "FetchAdminDetailsReasons");
const FetchUserDetailsReasonHelper = createEnumHelper(FetchUserDetailsReasons, "FetchUserDetailsReasons");
const FetchDeviceDetailsReasonHelper = createEnumHelper(FetchDeviceDetailsReasons, "FetchDeviceDetailsReasons");
const ViewActivityTrackerReasonsHelper = createEnumHelper(ViewActivityTrackerReasons, "ViewActivityTrackerReasons");
const SpecialPermissionReasonHelper = createEnumHelper(SpecialPermissionReasons, "SpecialPermissionReasons");
const BlockPermissionReasonHelper = createEnumHelper(BlockPermissionReasons, "BlockPermissionReasons");
const ClientCreationReasonHelper = createEnumHelper(ClientCreationReasons, "ClientCreationReasons");
const ClientRevertReasonHelper = createEnumHelper(ClientRevertReasons, "ClientRevertReasons");
const RoleChangeReasonHelper = createEnumHelper(RoleChangeReasons, "RoleChangeReasons");
const PermissionEffectHelper = createEnumHelper(PermissionEffect, "PermissionEffect");
const OverrideTypeHelper = createEnumHelper(OverrideType, "OverrideType");
const ClientStatusHelper = createEnumHelper(ClientStatus, "ClientStatus");

const AdminStatusHelper = AdminTypeHelper; // Alias for backward compatibility

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
  AdminStatusHelper,
  AuthModesHelper,
  RolesHelper,
  ServiceNameHelper,
  StatusHelper,
  AuditModeHelper,
  RequestTypeHelper,
  RequestStatusHelper,
  ViewScopeHelper,
  BlockDeviceReasonHelper,
  UnblockDeviceReasonHelper,
  AdminCreationReasonHelper,
  AdminUpdateRoleReasonHelper,
  FetchAdminDetailsReasonHelper,
  FetchUserDetailsReasonHelper,
  FetchDeviceDetailsReasonHelper,
  ViewActivityTrackerReasonsHelper,
  SpecialPermissionReasonHelper,
  BlockPermissionReasonHelper,
  ClientCreationReasonHelper,
  ClientRevertReasonHelper,
  RoleChangeReasonHelper,
  PermissionEffectHelper,
  OverrideTypeHelper,
  ClientStatusHelper
};

