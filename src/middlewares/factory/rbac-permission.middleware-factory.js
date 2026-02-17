/**
 * RBAC Permission Middleware Factory
 * 
 * Creates middleware that validates admin role permissions using RBAC utils.
 * Checks if an admin's role has the required permission(s).
 * 
 * Factory Pattern: Creates reusable role-based permission checking middleware.
 */

const { roleHasPermission, getRolePermissions } = require("@utils/rbac.utils");
const {
  throwAccessDeniedError,
  throwInternalServerError,
  logMiddlewareError
} = require("@/responses/common/error-handler.response");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * Create RBAC permission checking middleware
 * 
 * @param {string|Array<string>} requiredPermission - Permission(s) required (format: "resource:action")
 * @param {string} label - Descriptive label for logging
 * @param {string} mode - "all" (require all permissions) or "any" (require at least one)
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Single permission check
 * const canCreateAdmins = createRbacPermissionMiddleware(
 *   "admins:create", 
 *   "Create Admin"
 * );
 * 
 * // Multiple permissions (require ALL)
 * const canManageUsers = createRbacPermissionMiddleware(
 *   ["users:block", "users:unblock"],
 *   "Manage Users",
 *   "all"
 * );
 * 
 * // Multiple permissions (require ANY)
 * const canViewLogs = createRbacPermissionMiddleware(
 *   ["activity_logs:read", "auth_logs:read"],
 *   "View Logs",
 *   "any"
 * );
 */

function createRbacPermissionMiddleware(
  requiredPermission,
  label = "RBAC Permission Check",
  mode = "all"
) {
  // Normalize to array
  const requiredPermissions = Array.isArray(requiredPermission)
    ? requiredPermission
    : [requiredPermission];

  return function (req, res, next) {
    try {
      // Ensure admin is authenticated
      if (!req.admin || !req.admin.adminType) {
        logMiddlewareError(label, "Admin not authenticated or adminType missing", req);
        return throwAccessDeniedError(res, "Authentication required");
      }

      const { adminId, adminType } = req.admin;
      
      logWithTime(`[${label}] Checking RBAC permissions for Admin: ${adminId}, Role: ${adminType}`);
      logWithTime(`[${label}] Required permissions: ${requiredPermissions.join(", ")}`);

      // Get all permissions for this role
      const rolePermissions = getRolePermissions(adminType);
      
      if (!rolePermissions || rolePermissions.length === 0) {
        logMiddlewareError(
          label,
          `No permissions found for role: ${adminType}`,
          req
        );
        return throwAccessDeniedError(
          res,
          `Role "${adminType}" has no assigned permissions`
        );
      }

      logWithTime(`[${label}] Role permissions: ${rolePermissions.join(", ")}`);

      // Check permissions based on mode
      let hasPermission = false;
      let missingPermissions = [];

      if (mode === "all") {
        // Admin's role must have ALL required permissions
        missingPermissions = requiredPermissions.filter(
          permission => !roleHasPermission(adminType, permission)
        );
        hasPermission = missingPermissions.length === 0;
      } else if (mode === "any") {
        // Admin's role must have AT LEAST ONE required permission
        hasPermission = requiredPermissions.some(
          permission => roleHasPermission(adminType, permission)
        );
        if (!hasPermission) {
          missingPermissions = requiredPermissions;
        }
      } else {
        logMiddlewareError(label, `Invalid mode specified: ${mode}`, req);
        return throwAccessDeniedError(
          res,
          "Invalid permission check configuration"
        );
      }

      // Deny access if permissions not met
      if (!hasPermission) {
        logMiddlewareError(
          label,
          `Access denied for Admin: ${adminId}, Role: ${adminType}. Missing permissions: ${missingPermissions.join(", ")}`,
          req
        );
        return throwAccessDeniedError(
          res,
          `Insufficient permissions. Required: ${mode === "all" ? "ALL" : "ANY"} of [${requiredPermissions.join(", ")}]`
        );
      }

      // Grant access
      logWithTime(`✅ [${label}] Access granted for Admin: ${adminId}, Role: ${adminType}`);
      return next();

    } catch (error) {
      logMiddlewareError(
        label,
        `Error during permission check: ${error.message}`,
        req
      );
      return throwInternalServerError(res, error);
    }
  };
}

module.exports = {
  createRbacPermissionMiddleware
};
