/**
 * RBAC PERMISSIONS CONFIGURATION
 * 
 * Single Source of Truth for role-based permissions.
 * Maps each governance role to its base permissions following
 * the Admin Panel Service responsibility matrix.
 * 
 * Permission Format: "resource:action"
 * Example: "admins:create", "users:block", "activity_logs:read"
 * 
 * Resolution Priority: DENY > SPECIAL_ALLOW > ROLE_ALLOW
 */

const { AdminTypes } = require("./enums.config");

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

  // Admin Sessions
  ADMIN_MFA_ENFORCE: "admins:mfa_enforce",
  ADMIN_MFA_RESET: "admins:mfa_reset",
  ADMIN_SESSION_VIEW: "admins:session_view",
  ADMIN_SESSION_TERMINATE_SINGLE: "admins:session_terminate_single",
  ADMIN_SESSION_TERMINATE_ALL: "admins:session_terminate_all",

  // Client Sessions
  CLIENT_MFA_ENFORCE: "clients:mfa_enforce",
  CLIENT_MFA_RESET: "clients:mfa_reset",
  CLIENT_SESSION_VIEW: "clients:session_view",
  CLIENT_SESSION_TERMINATE_SINGLE: "clients:session_terminate_single",
  CLIENT_SESSION_TERMINATE_ALL: "clients:session_terminate_all",

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

/**
 * Role Permission Mappings
 * Each role is assigned its base permissions
 */
const RolePermissions = Object.freeze({

  /**
   * SUPER_ADMIN - Root Authority
   * 
   * Full system control. Can perform all operations including:
   * - Create/delete any admin
   * - Assign/remove any role
   * - Grant/revoke any permission
   * - Override approvals
   * - System configuration
   * - Cannot be blocked by lower roles
   */
  [AdminTypes.SUPER_ADMIN]: Object.values(Permissions),

  /**
   * ORG_ADMIN - Organization Operations Head
   * 
   * Manages organizational operations including:
   * - Create Ops/Support/Internal admins
   * - Manage clients
   * - User lifecycle management
   * - Review operational requests
   * - View activity logs
   * 
   * Cannot:
   * - Create Super Admins
   * - Override system configs
   */
  [AdminTypes.ORG_ADMIN]: [
    // Admin Management (Limited to lower roles)
    Permissions.ADMIN_CREATE,
    Permissions.ADMIN_READ,
    Permissions.ADMIN_UPDATE,
    Permissions.ADMIN_ACTIVATE,
    Permissions.ADMIN_DEACTIVATE,
    Permissions.ADMIN_SUSPEND,
    Permissions.ADMIN_UNSUSPEND,
    Permissions.ADMIN_PASSWORD_RESET,

    // User Management (Full Lifecycle)
    Permissions.USER_READ,
    Permissions.USER_ACTIVATE,
    Permissions.USER_DEACTIVATE,
    Permissions.USER_DELETE,
    Permissions.USER_BLOCK,
    Permissions.USER_UNBLOCK,
    Permissions.USER_SUSPEND,
    Permissions.USER_UNSUSPEND,
    Permissions.USER_PASSWORD_RESET,

    // Client Management (Full Lifecycle)
    Permissions.CLIENT_CREATE,
    Permissions.CLIENT_READ,
    Permissions.CLIENT_UPDATE,
    Permissions.CLIENT_ACTIVATE,
    Permissions.CLIENT_DEACTIVATE,
    Permissions.CLIENT_DELETE,
    Permissions.CLIENT_REVERT,
    Permissions.CLIENT_BLOCK,
    Permissions.CLIENT_UNBLOCK,
    Permissions.CLIENT_SUSPEND,
    Permissions.CLIENT_UNSUSPEND,
    Permissions.CLIENT_PASSWORD_RESET,

    // Device Management
    Permissions.DEVICE_READ,
    Permissions.DEVICE_BLOCK,
    Permissions.DEVICE_UNBLOCK,
    Permissions.DEVICE_SUSPEND,
    Permissions.DEVICE_UNSUSPEND,

    // Session Governance (Full Control)
    Permissions.USER_SESSION_VIEW,
    Permissions.USER_SESSION_TERMINATE_SINGLE,
    Permissions.USER_SESSION_TERMINATE_ALL,
    Permissions.USER_MFA_ENFORCE,
    Permissions.USER_MFA_RESET,
    Permissions.ADMIN_SESSION_VIEW,
    Permissions.ADMIN_SESSION_TERMINATE_SINGLE,
    Permissions.ADMIN_SESSION_TERMINATE_ALL,
    Permissions.ADMIN_MFA_ENFORCE,
    Permissions.ADMIN_MFA_RESET,
    Permissions.CLIENT_SESSION_VIEW,
    Permissions.CLIENT_SESSION_TERMINATE_SINGLE,
    Permissions.CLIENT_SESSION_TERMINATE_ALL,
    Permissions.CLIENT_MFA_ENFORCE,
    Permissions.CLIENT_MFA_RESET,

    // Role & Permission Management
    Permissions.ROLE_ASSIGN,
    Permissions.ROLE_VIEW,
    Permissions.PERMISSION_GRANT,
    Permissions.PERMISSION_REVOKE,
    Permissions.PERMISSION_VIEW,

    // Request Management (Full)
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW,
    Permissions.REQUEST_APPROVE,
    Permissions.REQUEST_REJECT,
    Permissions.REQUEST_CANCEL,
    Permissions.REQUEST_EXECUTE,
    Permissions.REQUEST_ABORT_EXECUTION,
    Permissions.REQUEST_ESCALATE,
    Permissions.REQUEST_ARCHIVE,

    // Logs (Full Access)
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.ACTIVITY_LOGS_EXPORT,
    Permissions.AUTH_LOGS_VIEW,
    Permissions.AUTH_LOGS_EXPORT,

    // System Config (Read Only)
    Permissions.SYSTEM_CONFIG_READ
  ],

  /**
   * OPERATIONS_ADMIN - Day-to-Day Operations
   * 
   * Handles routine user & device operations:
   * - Block/unblock users
   * - Block/unblock devices
   * - Password resets (via user management)
   * - Deactivate suspicious accounts
   * - View user activity
   * - Flag accounts
   * 
   * Cannot:
   * - Create admins
   * - Assign roles
   * - Grant permissions
   */
  
  [AdminTypes.OPERATIONS_ADMIN]: [
    // User Management (Operational)
    Permissions.USER_READ,
    Permissions.USER_DEACTIVATE,
    Permissions.USER_BLOCK,
    Permissions.USER_UNBLOCK,
    Permissions.USER_SUSPEND,
    Permissions.USER_UNSUSPEND,
    Permissions.USER_PASSWORD_RESET,

    // Client Management (Operational)
    Permissions.CLIENT_READ,
    Permissions.CLIENT_BLOCK,
    Permissions.CLIENT_UNBLOCK,
    Permissions.CLIENT_SUSPEND,
    Permissions.CLIENT_UNSUSPEND,
    Permissions.CLIENT_PASSWORD_RESET,

    // Device Management
    Permissions.DEVICE_READ,
    Permissions.DEVICE_BLOCK,
    Permissions.DEVICE_UNBLOCK,
    Permissions.DEVICE_SUSPEND,
    Permissions.DEVICE_UNSUSPEND,

    // Session Governance (User & Client)
    Permissions.USER_SESSION_VIEW,
    Permissions.USER_SESSION_TERMINATE_SINGLE,
    Permissions.USER_SESSION_TERMINATE_ALL,
    Permissions.CLIENT_SESSION_VIEW,
    Permissions.CLIENT_SESSION_TERMINATE_SINGLE,
    Permissions.CLIENT_SESSION_TERMINATE_ALL,

    // Request Management
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW,
    Permissions.REQUEST_CANCEL,

    // Logs (View Only)
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.AUTH_LOGS_VIEW
  ],

  /**
   * SUPPORT_ADMIN - Request Handling Layer
   * 
   * Handles support requests and escalations:
   * - Review deactivation/reactivation requests
   * - Process unblock appeals
   * - Raise escalations
   * - View limited activity logs
   * 
   * Cannot:
   * - Deactivate admins
   * - Grant roles
   * - Assign permissions
   * - Approve requests (can only create/view)
   */
  [AdminTypes.SUPPORT_ADMIN]: [
    // User Management (Read Only)
    Permissions.USER_READ,

    // Client Management (Read Only)
    Permissions.CLIENT_READ,

    // Device Management (Read Only)
    Permissions.DEVICE_READ,

    // Session Governance (View Only)
    Permissions.USER_SESSION_VIEW,
    Permissions.CLIENT_SESSION_VIEW,

    // Request Management
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW,
    Permissions.REQUEST_CANCEL,
    Permissions.REQUEST_ESCALATE,

    // Logs (View Only)
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.AUTH_LOGS_VIEW
  ],

  /**
   * AUDIT_ADMIN - Compliance Monitoring
   * 
   * Read-only governance role for compliance:
   * - View auth logs
   * - View admin activity
   * - Monitor suspicious actions
   * - Export reports
   * 
   * No write permissions - pure monitoring role
   */
  [AdminTypes.AUDIT_ADMIN]: [
    // Admin Viewing
    Permissions.ADMIN_READ,

    // User Viewing
    Permissions.USER_READ,

    // Client Viewing
    Permissions.CLIENT_READ,

    // Device Viewing
    Permissions.DEVICE_READ,

    // Session Governance (View Only)
    Permissions.USER_SESSION_VIEW,
    Permissions.ADMIN_SESSION_VIEW,
    Permissions.CLIENT_SESSION_VIEW,

    // Role & Permission Viewing
    Permissions.ROLE_VIEW,
    Permissions.PERMISSION_VIEW,

    // Request Viewing
    Permissions.REQUEST_VIEW,

    // Logs (Full Read + Export)
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.ACTIVITY_LOGS_EXPORT,
    Permissions.AUTH_LOGS_VIEW,
    Permissions.AUTH_LOGS_EXPORT,

    // System Config (Read Only)
    Permissions.SYSTEM_CONFIG_READ
  ],

  /**
   * INTERNAL_ADMIN - Shell Role
   * 
   * Least-privileged governance classification.
   * Used to identify internal staff for approval routing
   * and governance isolation.
   * 
   * Default permissions: NONE
   * Power only via special permissions or temporary overrides
   */
  [AdminTypes.INTERNAL_ADMIN]: [
    // No baseline permissions
    // All access must be granted via special permissions
  ]
});

/**
 * Get permissions for a specific role
 * 
 * @param {string} role - Admin role from AdminTypes
 * @returns {Array<string>} Array of permission strings
 */
function getRolePermissions(role) {
  return RolePermissions[role] || [];
}

/**
 * Check if a role has a specific permission
 * 
 * @param {string} role - Admin role from AdminTypes
 * @param {string} permission - Permission string (resource:action)
 * @returns {boolean} True if role has the permission
 */
function roleHasPermission(role, permission) {
  const permissions = getRolePermissions(role);
  return permissions.includes(permission);
}

/**
 * Get all permissions across all roles (for validation)
 */
const AllPermissions = Object.freeze(
  Object.values(Permissions)
);

module.exports = {
  Permissions,
  RolePermissions,
  AllPermissions,
  getRolePermissions,
  roleHasPermission
};
