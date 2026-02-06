// configs/enums.config.js

const AuthModes = Object.freeze({
    EMAIL: "EMAIL",
    PHONE: "PHONE",
    BOTH: "BOTH",
    EITHER: "EITHER"
});

const UserTypes = Object.freeze({
    CUSTOMER: "CUSTOMER",
    USER: "USER"
});

const DeviceTypes = Object.freeze({
    MOBILE: "MOBILE",
    TABLET: "TABLET",
    LAPTOP: "LAPTOP"
});

const ContactModes = Object.freeze({
    EMAIL: "EMAIL",
    PHONE: "PHONE",
    BOTH: "BOTH"
});

const AdminTypes = Object.freeze({
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  MID_ADMIN: "mid_admin"
});

// Role Hierarchy: Higher numeric value = Higher authority
// An admin can ONLY act on roles with STRICTLY LOWER hierarchy values
const RoleHierarchy = Object.freeze({
  [AdminTypes.SUPER_ADMIN]: 3,
  [AdminTypes.MID_ADMIN]: 2,
  [AdminTypes.ADMIN]: 1
});

const FirstNameFieldSetting = Object.freeze({
  DISABLED: "disabled",
  OPTIONAL: "optional",
  MANDATORY: "mandatory"
});

const AdminErrorTypes = Object.freeze({
  CONFLICT: "CONFLICT",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_DATA: "INVALID_DATA",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  ALREADY_ACTIVE: "ALREADY_ACTIVE",
  ALREADY_INACTIVE: "ALREADY_INACTIVE",
  ALREADY_BLOCKED: "ALREADY_BLOCKED",
  ALREADY_UNBLOCKED: "ALREADY_UNBLOCKED",
  INVALID_ROLE: "INVALID_ROLE",
  INVALID_SUPERVISOR: "INVALID_SUPERVISOR",
  CANNOT_MODIFY_SELF: "CANNOT_MODIFY_SELF"
});

const PerformedBy = Object.freeze({
  ADMIN: "admin",
  SYSTEM: "system",
  MID_ADMIN: "mid_admin",
  SUPER_ADMIN: "super_admin"
});

const Roles = Object.freeze({
  ...AdminTypes,
  ...UserTypes
});

const ServiceNames = Object.freeze({
    AUTH_SERVICE: "auth-service",
    ADMIN_PANEL_SERVICE: "admin-panel-service",
    SOFTWARE_MANAGEMENT_SERVICE: "software-management-service"
});

const Status = Object.freeze({
  SUCCESS: "success",
  FAILURE: "failure",
  PENDING: "pending"
});

const AuditMode = Object.freeze({
  FULL: "FULL",
  CHANGED_ONLY: "CHANGED_ONLY"
})

const requestType = Object.freeze({
  DEACTIVATION: "deactivation",
  ACTIVATION: "activation"
});

const requestStatus = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
});

const viewScope = Object.freeze({
  ALL: "ALL",
  ADMINS_ONLY: "ADMINS_ONLY",
  SELF_ONLY: "SELF_ONLY"
});

const RequestLocation = Object.freeze({
    BODY: "body",
    QUERY: "query",
    PARAMS: "params",
    HEADERS: "headers" // Future safety ke liye
});

module.exports = {
  AdminTypes,
  RoleHierarchy,
  DeviceTypes,
  PerformedBy,
  AuthModes,
  Roles,
  Status,
  AuditMode,
  requestType,
  requestStatus,
  viewScope,
  FirstNameFieldSetting,
  AdminErrorTypes,
  RequestLocation,
  UserTypes,
  ContactModes,
  ServiceNames
};
