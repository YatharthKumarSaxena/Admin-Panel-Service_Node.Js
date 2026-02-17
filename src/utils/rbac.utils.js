const { RolePermissions } = require("./role-permissions.config");

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


module.exports = {
  getRolePermissions,
  roleHasPermission
};
