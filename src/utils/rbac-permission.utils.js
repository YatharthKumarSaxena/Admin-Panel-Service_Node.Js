const { RolePermissions } = require('@configs/role-permissions.config');

/**
 * Helper function to get all permissions for a role in flat format (resource:action)
 * For backward compatibility with existing code
 * 
 * @param {string} roleType - Admin role type
 * @returns {string[]} Array of permissions in "resource:action" format
 */

const getRolePermissionsFlat = (roleType) => {
  const rolePerms = RolePermissions[roleType];
  if (!rolePerms) return [];

  const flatPermissions = [];
  
  for (const [resource, actions] of Object.entries(rolePerms)) {
    for (const action of actions) {
      flatPermissions.push(`${resource}:${action}`);
    }
  }
  
  return flatPermissions;
};

/**
 * Helper function to check if a role has a specific permission
 * 
 * @param {string} roleType - Admin role type
 * @param {string} resource - Resource code
 * @param {string} action - Action code
 * @returns {boolean} True if role has the permission
 */
const hasPermission = (roleType, resource, action) => {
  const rolePerms = RolePermissions[roleType];
  if (!rolePerms || !rolePerms[resource]) return false;
  
  return rolePerms[resource].includes(action);
};

/**
 * Helper function to get all actions allowed on a specific resource for a role
 * 
 * @param {string} roleType - Admin role type
 * @param {string} resource - Resource code
 * @returns {string[]} Array of action codes
 */
const getResourceActions = (roleType, resource) => {
  const rolePerms = RolePermissions[roleType];
  if (!rolePerms || !rolePerms[resource]) return [];
  
  return [...rolePerms[resource]];
};

/**
 * Helper function to get all resources accessible by a role
 * 
 * @param {string} roleType - Admin role type
 * @returns {string[]} Array of resource codes
 */
const getAccessibleResources = (roleType) => {
  const rolePerms = RolePermissions[roleType];
  if (!rolePerms) return [];
  
  return Object.keys(rolePerms);
};

module.exports = {
  getRolePermissionsFlat,
  hasPermission,
  getResourceActions,
  getAccessibleResources
};