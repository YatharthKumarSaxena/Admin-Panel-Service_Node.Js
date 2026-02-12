/**
 * Permission Checker Middleware Factory
 * 
 * Creates middleware that validates admin has required permissions.
 * Must be used AFTER loadAdminPermissions middleware.
 * 
 * Factory Pattern: Creates reusable permission-checking middleware.
 */

const { logWithTime } = require("@utils/time-stamps.util");
const { throwAccessDeniedError } = require("@configs/error-handler.configs");

/**
 * Create permission checking middleware
 * 
 * @param {string|Array<string>} requiredPermission - Permission code(s) required
 * @param {string} label - Descriptive label for logging
 * @param {string} mode - "all" (require all permissions) or "any" (require at least one)
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Single permission
 * const canCreateAdmins = checkPermission("admins:create", "Create Admin");
 * 
 * // Multiple permissions (require ALL)
 * const canManageUsers = checkPermission(
 *   ["users:block", "users:unblock"],
 *   "Manage Users",
 *   "all"
 * );
 * 
 * // Multiple permissions (require ANY)
 * const canViewLogs = checkPermission(
 *   ["activity_logs:read", "auth_logs:read"],
 *   "View Logs",
 *   "any"
 * );
 */
function checkPermission(requiredPermission, label = "Permission Check", mode = "all") {
  // Normalize to array
  const requiredPermissions = Array.isArray(requiredPermission) 
    ? requiredPermission 
    : [requiredPermission];
  
  return (req, res, next) => {
    try {
      // Ensure permissions are loaded
      if (!req.adminPermissions) {
        logWithTime(`[checkPermission:${label}] adminPermissions not loaded. Ensure loadAdminPermissions middleware runs first.`);
        return throwAccessDeniedError(
          res,
          "Permission check failed. Admin permissions not loaded."
        );
      }
      
      const { adminId } = req.admin;
      const { adminPermissions } = req;
      
      logWithTime(`[checkPermission:${label}] Checking permissions for ${adminId}`);
      logWithTime(`[checkPermission:${label}] Required: ${requiredPermissions.join(", ")}`);
      
      // Check based on mode
      let hasPermission = false;
      
      if (mode === "all") {
        // Admin must have ALL required permissions
        hasPermission = requiredPermissions.every(p => adminPermissions.includes(p));
      } else if (mode === "any") {
        // Admin must have AT LEAST ONE required permission
        hasPermission = requiredPermissions.some(p => adminPermissions.includes(p));
      } else {
        logWithTime(`[checkPermission:${label}] Invalid mode: ${mode}`);
        return throwAccessDeniedError(res, "Invalid permission check configuration.");
      }
      
      if (!hasPermission) {
        const missingPermissions = requiredPermissions.filter(p => !adminPermissions.includes(p));
        logWithTime(`[checkPermission:${label}] Access denied for ${adminId}. Missing: ${missingPermissions.join(", ")}`);
        
        return throwAccessDeniedError(
          res,
          `Insufficient permissions. Required: ${requiredPermissions.join(" or ")}`
        );
      }
      
      logWithTime(`[checkPermission:${label}] Access granted for ${adminId}`);
      next();
      
    } catch (error) {
      logWithTime(`[checkPermission:${label}] Error: ${error.message}`);
      return throwAccessDeniedError(res, "Permission check failed.");
    }
  };
}

/**
 * Pre-built common permission middleware
 */
const commonPermissions = {
  // Admin management
  canCreateAdmins: checkPermission("admins:create", "Create Admins"),
  canUpdateAdmins: checkPermission("admins:update", "Update Admins"),
  canActivateAdmins: checkPermission("admins:activate", "Activate Admins"),
  canDeactivateAdmins: checkPermission("admins:deactivate", "Deactivate Admins"),
  canDeleteAdmins: checkPermission("admins:delete", "Delete Admins"),
  
  // User management
  canBlockUsers: checkPermission("users:block", "Block Users"),
  canUnblockUsers: checkPermission("users:unblock", "Unblock Users"),
  canDeactivateUsers: checkPermission("users:deactivate", "Deactivate Users"),
  canActivateUsers: checkPermission("users:activate", "Activate Users"),
  
  // Client management
  canCreateClients: checkPermission("clients:create", "Create Clients"),
  canRevertClients: checkPermission("clients:revert", "Revert Clients"),
  
  // Permission management
  canGrantPermissions: checkPermission("permissions:grant_permission", "Grant Permissions"),
  canRevokePermissions: checkPermission("permissions:revoke_permission", "Revoke Permissions"),
  
  // Role management
  canAssignRoles: checkPermission("roles:assign_role", "Assign Roles"),
  
  // Request management
  canApproveRequests: checkPermission("requests:approve", "Approve Requests"),
  canRejectRequests: checkPermission("requests:reject", "Reject Requests"),
  
  // Log access
  canViewActivityLogs: checkPermission("activity_logs:read", "View Activity Logs"),
  canViewAuthLogs: checkPermission("auth_logs:read", "View Auth Logs"),
  canExportLogs: checkPermission(
    ["activity_logs:export", "auth_logs:export"],
    "Export Logs",
    "any"
  ),
  
  // System config
  canUpdateSystemConfig: checkPermission("system_config:update", "Update System Config")
};

module.exports = {
  checkPermission,
  ...commonPermissions
};
