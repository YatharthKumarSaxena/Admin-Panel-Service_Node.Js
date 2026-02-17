/**
 * All Available Permissions
 * Format: resource:action
 */
const Permissions = Object.freeze({
  // ========== ADMIN PERMISSIONS ==========
  ADMIN_CREATE: "admins:create",
  ADMIN_READ: "admins:read",
  ADMIN_UPDATE: "admins:update",
  ADMIN_ACTIVATE: "admins:activate",
  ADMIN_DEACTIVATE: "admins:deactivate",
  ADMIN_DELETE: "admins:delete",
  ADMIN_BLOCK: "admins:block",
  ADMIN_UNBLOCK: "admins:unblock",
  ADMIN_SUSPEND: "admins:suspend",
  ADMIN_UNSUSPEND: "admins:unsuspend",
  ADMIN_PASSWORD_RESET: "admins:password_reset",

  // ========== USER PERMISSIONS ==========
  USER_READ: "users:read",
  USER_ACTIVATE: "users:activate",
  USER_DEACTIVATE: "users:deactivate",
  USER_DELETE: "users:delete",
  USER_BLOCK: "users:block",
  USER_UNBLOCK: "users:unblock",
  USER_SUSPEND: "users:suspend",
  USER_UNSUSPEND: "users:unsuspend",
  USER_PASSWORD_RESET: "users:password_reset",

  // ========== CLIENT PERMISSIONS ==========
  CLIENT_CREATE: "clients:create",
  CLIENT_UPDATE: "clients:update",
  CLIENT_READ: "clients:read",
  CLIENT_ACTIVATE: "clients:activate",
  CLIENT_DEACTIVATE: "clients:deactivate",
  CLIENT_DELETE: "clients:delete",
  CLIENT_REVERT: "clients:revert",
  CLIENT_BLOCK: "clients:block",
  CLIENT_UNBLOCK: "clients:unblock",
  CLIENT_SUSPEND: "clients:suspend",
  CLIENT_UNSUSPEND: "clients:unsuspend",
  CLIENT_PASSWORD_RESET: "clients:password_reset",

  // ========== DEVICE PERMISSIONS ==========
  DEVICE_READ: "devices:read",
  DEVICE_BLOCK: "devices:block",
  DEVICE_UNBLOCK: "devices:unblock",
  DEVICE_SUSPEND: "devices:suspend",
  DEVICE_UNSUSPEND: "devices:unsuspend",

  // ========== SESSION GOVERNANCE ==========
  // User Sessions
  USER_MFA_ENFORCE: "users:mfa_enforce",
  USER_MFA_RESET: "users:mfa_reset",
  USER_SESSION_VIEW: "users:session_view",
  USER_SESSION_TERMINATE_SINGLE: "users:session_terminate_single",
  USER_SESSION_TERMINATE_ALL: "users:session_terminate_all",
  USER_SESSION_DEVICE_VIEW: "users:session_device_view",
  TERMINATE_ALL_USER_SESSIONS_ON_DEVICE: "users:terminate_all_sessions_on_device",

  // Admin Sessions
  ADMIN_MFA_ENFORCE: "admins:mfa_enforce",
  ADMIN_MFA_RESET: "admins:mfa_reset",
  ADMIN_SESSION_VIEW: "admins:session_view",
  ADMIN_SESSION_TERMINATE_SINGLE: "admins:session_terminate_single",
  ADMIN_SESSION_TERMINATE_ALL: "admins:session_terminate_all",
  ADMIN_SESSION_DEVICE_VIEW: "admins:session_device_view",
  TERMINATE_ALL_ADMIN_SESSIONS_ON_DEVICE: "admins:terminate_all_sessions_on_device",

  // Client Sessions
  CLIENT_MFA_ENFORCE: "clients:mfa_enforce",
  CLIENT_MFA_RESET: "clients:mfa_reset",
  CLIENT_SESSION_VIEW: "clients:session_view",
  CLIENT_SESSION_DEVICE_VIEW: "clients:session_device_view",
  CLIENT_SESSION_TERMINATE_SINGLE: "clients:session_terminate_single",
  CLIENT_SESSION_TERMINATE_ALL: "clients:session_terminate_all",
  TERMINATE_ALL_CLIENT_SESSIONS_ON_DEVICE: "clients:terminate_all_sessions_on_device",
  
  // ========== PERMISSION MANAGEMENT ==========
  PERMISSION_GRANT: "permissions:grant_permission",
  PERMISSION_REVOKE: "permissions:revoke_permission",
  PERMISSION_VIEW: "permissions:read",

  // ========== ROLE MANAGEMENT ==========
  ROLE_ASSIGN: "roles:assign_role",
  ROLE_VIEW: "roles:read",

  // ========== REQUEST MANAGEMENT ==========
  REQUEST_CREATE: "requests:create",
  REQUEST_VIEW: "requests:read",
  REQUEST_APPROVE: "requests:approve",
  REQUEST_REJECT: "requests:reject",
  REQUEST_CANCEL: "requests:cancel",
  REQUEST_EXECUTE: "requests:execute",
  REQUEST_ABORT_EXECUTION: "requests:abort_execution",
  REQUEST_ESCALATE: "requests:escalate",
  REQUEST_ARCHIVE: "requests:archive",

  // ========== LOG ACCESS ==========
  ACTIVITY_LOGS_VIEW: "activity_logs:read",
  ACTIVITY_LOGS_EXPORT: "activity_logs:export",
  AUTH_LOGS_VIEW: "auth_logs:read",
  AUTH_LOGS_EXPORT: "auth_logs:export",

  // ========== SYSTEM CONFIGURATION ==========
  SYSTEM_CONFIG_READ: "system_config:read",
  SYSTEM_CONFIG_UPDATE: "system_config:update"
});

const AllPermissions = Object.freeze(
  Object.values(Permissions)
);

module.exports = {
  Permissions,
  AllPermissions
};