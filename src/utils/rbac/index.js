/**
 * RBAC Utilities Index
 * 
 * Centralized export for Role-Based Access Control utilities
 */

const { getRolePermissions, roleHasPermission, getAllAdminTypes } = require("./get-role-permissions.util");
const { resolveAdminPermissions, resolveAdminPermissionsDetailed, batchResolveAdminPermissions } = require("./resolve-permissions.util");
const { 
  hasPermission, 
  hasAllPermissions, 
  hasAnyPermission, 
  hasPermissionPattern,
  clearPermissionCache,
  clearAllPermissionCache,
  getCacheStats
} = require("./check-permission.util");

module.exports = {
  // Role permissions
  getRolePermissions,
  roleHasPermission,
  getAllAdminTypes,
  
  // Permission resolution
  resolveAdminPermissions,
  resolveAdminPermissionsDetailed,
  batchResolveAdminPermissions,
  
  // Permission checking
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasPermissionPattern,
  
  // Cache management
  clearPermissionCache,
  clearAllPermissionCache,
  getCacheStats
};
