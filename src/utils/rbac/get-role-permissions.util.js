/**
 * Get Role Permissions Utility
 * 
 * Retrieves base permissions assigned to governance roles
 * from the RBAC permissions configuration.
 */

const { RolePermissions } = require("@configs/rbac-permissions.config");
const { AdminTypes } = require("@configs/enums.config");

/**
 * Get base permissions for a specific admin role
 * 
 * @param {string} adminType - Admin role from AdminTypes enum
 * @returns {Array<string>} Array of permission codes (e.g., ["admins:create", "users:block"])
 * 
 * @example
 * const permissions = getRolePermissions(AdminTypes.ORG_ADMIN);
 * // Returns: ["admins:create", "users:block", "clients:create", ...]
 */
function getRolePermissions(adminType) {
  // Validate admin type exists
  if (!Object.values(AdminTypes).includes(adminType)) {
    throw new Error(`Invalid admin type: ${adminType}`);
  }
  
  // Get permissions for this role (returns empty array if role not found)
  const permissions = RolePermissions[adminType] || [];
  
  // Return a copy to prevent mutation
  return [...permissions];
}

/**
 * Check if a role has a specific permission by default
 * 
 * @param {string} adminType - Admin role from AdminTypes enum
 * @param {string} permission - Permission code (resource:action)
 * @returns {boolean} True if role has the permission
 * 
 * @example
 * const hasPermission = roleHasPermission(AdminTypes.OPERATIONS_ADMIN, "users:block");
 * // Returns: true
 */
function roleHasPermission(adminType, permission) {
  const permissions = getRolePermissions(adminType);
  return permissions.includes(permission);
}

/**
 * Get all available admin types
 * 
 * @returns {Array<string>} Array of admin type codes
 */
function getAllAdminTypes() {
  return Object.values(AdminTypes);
}

module.exports = {
  getRolePermissions,
  roleHasPermission,
  getAllAdminTypes
};
