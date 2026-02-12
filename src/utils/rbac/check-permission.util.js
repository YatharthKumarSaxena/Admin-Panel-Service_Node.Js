/**
 * Check Permission Utility
 * 
 * Simple interface to verify if an admin has a specific permission.
 * Used by middleware and controllers for permission-based access control.
 */

const { resolveAdminPermissions } = require("./resolve-permissions.util");
const { logWithTime } = require("@utils/time-stamps.util");

// In-memory cache for permission resolution (optional, can be replaced with Redis)
const permissionCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Check if an admin has a specific permission
 * 
 * @param {string} adminId - Admin ID
 * @param {string} permission - Permission code (resource:action)
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {Promise<boolean>} True if admin has the permission
 * 
 * @example
 * const canCreate = await hasPermission("ADM1234567", "admins:create");
 * if (canCreate) {
 *   // Allow admin creation
 * }
 */
async function hasPermission(adminId, permission, useCache = true) {
  try {
    logWithTime(`[hasPermission] Checking ${permission} for ${adminId}`);
    
    // Check cache if enabled
    if (useCache) {
      const cached = getFromCache(adminId);
      if (cached) {
        const result = cached.includes(permission);
        logWithTime(`[hasPermission] Cache hit: ${result}`);
        return result;
      }
    }
    
    // Resolve permissions from database
    const permissions = await resolveAdminPermissions(adminId);
    
    // Cache the result if enabled
    if (useCache) {
      setInCache(adminId, permissions);
    }
    
    const result = permissions.includes(permission);
    logWithTime(`[hasPermission] Result: ${result}`);
    
    return result;
    
  } catch (error) {
    logWithTime(`[hasPermission] Error: ${error.message}`);
    // Fail-safe: deny permission on error
    return false;
  }
}

/**
 * Check if an admin has ALL of the specified permissions
 * 
 * @param {string} adminId - Admin ID
 * @param {Array<string>} permissions - Array of permission codes
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {Promise<boolean>} True if admin has all permissions
 * 
 * @example
 * const canManageUsers = await hasAllPermissions("ADM1234567", [
 *   "users:block",
 *   "users:unblock",
 *   "users:deactivate"
 * ]);
 */
async function hasAllPermissions(adminId, permissions, useCache = true) {
  try {
    // Get admin's effective permissions
    let effectivePermissions;
    
    if (useCache) {
      const cached = getFromCache(adminId);
      if (cached) {
        effectivePermissions = cached;
      } else {
        effectivePermissions = await resolveAdminPermissions(adminId);
        setInCache(adminId, effectivePermissions);
      }
    } else {
      effectivePermissions = await resolveAdminPermissions(adminId);
    }
    
    // Check if all required permissions exist
    const result = permissions.every(p => effectivePermissions.includes(p));
    logWithTime(`[hasAllPermissions] ${adminId} has all ${permissions.length} permissions: ${result}`);
    
    return result;
    
  } catch (error) {
    logWithTime(`[hasAllPermissions] Error: ${error.message}`);
    return false;
  }
}

/**
 * Check if an admin has ANY of the specified permissions
 * 
 * @param {string} adminId - Admin ID
 * @param {Array<string>} permissions - Array of permission codes
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {Promise<boolean>} True if admin has at least one permission
 * 
 * @example
 * const canViewLogs = await hasAnyPermission("ADM1234567", [
 *   "activity_logs:read",
 *   "auth_logs:read"
 * ]);
 */
async function hasAnyPermission(adminId, permissions, useCache = true) {
  try {
    // Get admin's effective permissions
    let effectivePermissions;
    
    if (useCache) {
      const cached = getFromCache(adminId);
      if (cached) {
        effectivePermissions = cached;
      } else {
        effectivePermissions = await resolveAdminPermissions(adminId);
        setInCache(adminId, effectivePermissions);
      }
    } else {
      effectivePermissions = await resolveAdminPermissions(adminId);
    }
    
    // Check if any required permission exists
    const result = permissions.some(p => effectivePermissions.includes(p));
    logWithTime(`[hasAnyPermission] ${adminId} has any of ${permissions.length} permissions: ${result}`);
    
    return result;
    
  } catch (error) {
    logWithTime(`[hasAnyPermission] Error: ${error.message}`);
    return false;
  }
}

/**
 * Check permissions with wildcard support
 * Supports patterns like "admins:*" (all admin actions)
 * 
 * @param {string} adminId - Admin ID
 * @param {string} permissionPattern - Permission pattern with optional wildcards
 * @returns {Promise<boolean>} True if admin has matching permission
 * 
 * @example
 * const hasAnyAdminPermission = await hasPermissionPattern("ADM1234567", "admins:*");
 */
async function hasPermissionPattern(adminId, permissionPattern) {
  try {
    const permissions = await resolveAdminPermissions(adminId);
    
    // If no wildcard, do exact match
    if (!permissionPattern.includes('*')) {
      return permissions.includes(permissionPattern);
    }
    
    // Convert pattern to regex
    const pattern = permissionPattern.replace(/\*/g, '.*');
    const regex = new RegExp(`^${pattern}$`);
    
    // Check if any permission matches the pattern
    const result = permissions.some(p => regex.test(p));
    logWithTime(`[hasPermissionPattern] ${adminId} matches pattern ${permissionPattern}: ${result}`);
    
    return result;
    
  } catch (error) {
    logWithTime(`[hasPermissionPattern] Error: ${error.message}`);
    return false;
  }
}

// ========== CACHE MANAGEMENT ==========

/**
 * Get permissions from cache
 */
function getFromCache(adminId) {
  const cached = permissionCache.get(adminId);
  
  if (!cached) {
    return null;
  }
  
  // Check if cache expired
  if (Date.now() > cached.expiresAt) {
    permissionCache.delete(adminId);
    return null;
  }
  
  return cached.permissions;
}

/**
 * Set permissions in cache
 */
function setInCache(adminId, permissions) {
  permissionCache.set(adminId, {
    permissions,
    expiresAt: Date.now() + CACHE_TTL
  });
}

/**
 * Clear permission cache for a specific admin
 * Call this when admin's permissions change (role change, special grant, etc.)
 * 
 * @param {string} adminId - Admin ID
 */
function clearPermissionCache(adminId) {
  permissionCache.delete(adminId);
  logWithTime(`[clearPermissionCache] Cleared cache for ${adminId}`);
}

/**
 * Clear entire permission cache
 * Call this during system maintenance or configuration changes
 */
function clearAllPermissionCache() {
  const size = permissionCache.size;
  permissionCache.clear();
  logWithTime(`[clearAllPermissionCache] Cleared ${size} cache entries`);
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  return {
    size: permissionCache.size,
    ttl: CACHE_TTL
  };
}

module.exports = {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasPermissionPattern,
  clearPermissionCache,
  clearAllPermissionCache,
  getCacheStats
};
