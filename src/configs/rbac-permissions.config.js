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
  ADMIN_DELETE: "admins:delete",
  ADMIN_ACTIVATE: "admins:activate",
  ADMIN_DEACTIVATE: "admins:deactivate",
  ADMIN_BLOCK: "admins:block",
  ADMIN_UNBLOCK: "admins:unblock",
  
  // ========== USER PERMISSIONS ==========
  USER_CREATE: "users:create",
  USER_READ: "users:read",
  USER_UPDATE: "users:update",
  USER_DELETE: "users:delete",
  USER_ACTIVATE: "users:activate",
  USER_DEACTIVATE: "users:deactivate",
  USER_BLOCK: "users:block",
  USER_UNBLOCK: "users:unblock",
  
  // ========== CLIENT PERMISSIONS ==========
  CLIENT_CREATE: "clients:create",
  CLIENT_READ: "clients:read",
  CLIENT_UPDATE: "clients:update",
  CLIENT_DELETE: "clients:delete",
  CLIENT_REVERT: "clients:revert",
  
  // ========== DEVICE PERMISSIONS ==========
  DEVICE_READ: "devices:read",
  DEVICE_BLOCK: "devices:block",
  DEVICE_UNBLOCK: "devices:unblock",
  
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
  [AdminTypes.SUPER_ADMIN]: [
    // Admin Management (Full)
    Permissions.ADMIN_CREATE,
    Permissions.ADMIN_READ,
    Permissions.ADMIN_UPDATE,
    Permissions.ADMIN_DELETE,
    Permissions.ADMIN_ACTIVATE,
    Permissions.ADMIN_DEACTIVATE,
    Permissions.ADMIN_BLOCK,
    Permissions.ADMIN_UNBLOCK,
    
    // User Management (Full)
    Permissions.USER_READ,
    Permissions.USER_UPDATE,
    Permissions.USER_ACTIVATE,
    Permissions.USER_DEACTIVATE,
    Permissions.USER_BLOCK,
    Permissions.USER_UNBLOCK,
    
    // Client Management (Full)
    Permissions.CLIENT_CREATE,
    Permissions.CLIENT_READ,
    Permissions.CLIENT_UPDATE,
    Permissions.CLIENT_DELETE,
    Permissions.CLIENT_REVERT,
    
    // Device Management (Full)
    Permissions.DEVICE_READ,
    Permissions.DEVICE_BLOCK,
    Permissions.DEVICE_UNBLOCK,
    
    // Permission Management (Full)
    Permissions.PERMISSION_GRANT,
    Permissions.PERMISSION_REVOKE,
    Permissions.PERMISSION_VIEW,
    
    // Role Management (Full)
    Permissions.ROLE_ASSIGN,
    Permissions.ROLE_VIEW,
    
    // Request Management (Full)
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW,
    Permissions.REQUEST_APPROVE,
    Permissions.REQUEST_REJECT,
    
    // Logs (Full Access)
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.ACTIVITY_LOGS_EXPORT,
    Permissions.AUTH_LOGS_VIEW,
    Permissions.AUTH_LOGS_EXPORT,
    
    // System Config (Full)
    Permissions.SYSTEM_CONFIG_READ,
    Permissions.SYSTEM_CONFIG_UPDATE
  ],
  
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
    
    // User Management (Full)
    Permissions.USER_READ,
    Permissions.USER_UPDATE,
    Permissions.USER_ACTIVATE,
    Permissions.USER_DEACTIVATE,
    Permissions.USER_BLOCK,
    Permissions.USER_UNBLOCK,
    
    // Client Management (Full)
    Permissions.CLIENT_CREATE,
    Permissions.CLIENT_READ,
    Permissions.CLIENT_UPDATE,
    Permissions.CLIENT_REVERT,
    
    // Device Management
    Permissions.DEVICE_READ,
    Permissions.DEVICE_BLOCK,
    Permissions.DEVICE_UNBLOCK,
    
    // Request Management
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW,
    Permissions.REQUEST_APPROVE,
    Permissions.REQUEST_REJECT,
    
    // Logs
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.ACTIVITY_LOGS_EXPORT,
    Permissions.AUTH_LOGS_VIEW,
    
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
    Permissions.USER_UPDATE,
    Permissions.USER_DEACTIVATE,
    Permissions.USER_BLOCK,
    Permissions.USER_UNBLOCK,
    
    // Device Management
    Permissions.DEVICE_READ,
    Permissions.DEVICE_BLOCK,
    Permissions.DEVICE_UNBLOCK,
    
    // View Activity
    Permissions.ACTIVITY_LOGS_VIEW,
    
    // Request Management (Create only)
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW
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
    // User Management (Read + Create Requests)
    Permissions.USER_READ,
    
    // Device Management (Read)
    Permissions.DEVICE_READ,
    
    // Request Management
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW,
    
    // Logs (Limited)
    Permissions.ACTIVITY_LOGS_VIEW
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
    
    // Device Viewing
    Permissions.DEVICE_READ,
    
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
