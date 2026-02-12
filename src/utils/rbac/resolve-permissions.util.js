/**
 * Resolve Admin Permissions Utility
 * 
 * Resolves effective permissions for an admin by combining:
 * 1. Role-based permissions (from AdminType)
 * 2. Special permission grants (ALLOW overrides)
 * 3. Blocked permissions (DENY overrides)
 * 
 * Resolution Priority: DENY > SPECIAL_ALLOW > ROLE_ALLOW
 */

const { AdminModel, SpecialPermissionModel, BlockPermissionModel } = require("@models");
const { getRolePermissions } = require("./get-role-permissions.util");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * Resolve effective permissions for an admin
 * 
 * @param {string} adminId - Admin ID (e.g., "ADM1234567")
 * @returns {Promise<Array<string>>} Array of effective permission codes
 * 
 * @throws {Error} If admin not found
 * 
 * @example
 * const permissions = await resolveAdminPermissions("ADM1234567");
 * // Returns: ["admins:create", "users:block", ...] minus blocked + special
 */
async function resolveAdminPermissions(adminId) {
  try {
    logWithTime(`[resolveAdminPermissions] Starting for adminId: ${adminId}`);
    
    // 1. Fetch admin to get their role
    const admin = await AdminModel.findOne({ adminId });
    
    if (!admin) {
      throw new Error(`Admin not found: ${adminId}`);
    }
    
    logWithTime(`[resolveAdminPermissions] Admin found with role: ${admin.adminType}`);
    
    // 2. Get base permissions from role
    const rolePermissions = getRolePermissions(admin.adminType);
    logWithTime(`[resolveAdminPermissions] Base role permissions: ${rolePermissions.length}`);
    
    // 3. Fetch active special permissions (not expired, not revoked)
    const now = new Date();
    const specialPermissions = await SpecialPermissionModel.find({
      adminId,
      status: "ACTIVE",
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).select('permission').lean();
    
    const specialPermissionCodes = specialPermissions.map(sp => sp.permission);
    logWithTime(`[resolveAdminPermissions] Special permissions: ${specialPermissionCodes.length}`);
    
    // 4. Fetch active blocked permissions (not expired, not revoked)
    const blockedPermissions = await BlockPermissionModel.find({
      adminId,
      status: "ACTIVE",
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).select('permission').lean();
    
    const blockedPermissionCodes = blockedPermissions.map(bp => bp.permission);
    logWithTime(`[resolveAdminPermissions] Blocked permissions: ${blockedPermissionCodes.length}`);
    
    // 5. Apply resolution logic: DENY > SPECIAL_ALLOW > ROLE_ALLOW
    // Start with role permissions + special permissions
    const allowedPermissions = new Set([...rolePermissions, ...specialPermissionCodes]);
    
    // Remove blocked permissions (highest priority)
    blockedPermissionCodes.forEach(blocked => {
      allowedPermissions.delete(blocked);
    });
    
    const effectivePermissions = Array.from(allowedPermissions);
    logWithTime(`[resolveAdminPermissions] Effective permissions: ${effectivePermissions.length}`);
    
    return effectivePermissions;
    
  } catch (error) {
    logWithTime(`[resolveAdminPermissions] Error: ${error.message}`);
    throw error;
  }
}

/**
 * Resolve permissions with detailed breakdown
 * Returns separate arrays for role, special, blocked, and effective permissions
 * 
 * @param {string} adminId - Admin ID
 * @returns {Promise<Object>} Detailed permission breakdown
 * 
 * @example
 * const breakdown = await resolveAdminPermissionsDetailed("ADM1234567");
 * // Returns: { rolePermissions: [], specialPermissions: [], blockedPermissions: [], effectivePermissions: [] }
 */
async function resolveAdminPermissionsDetailed(adminId) {
  try {
    // 1. Fetch admin
    const admin = await AdminModel.findOne({ adminId });
    
    if (!admin) {
      throw new Error(`Admin not found: ${adminId}`);
    }
    
    // 2. Get base role permissions
    const rolePermissions = getRolePermissions(admin.adminType);
    
    // 3. Fetch special permissions with metadata
    const now = new Date();
    const specialPermissions = await SpecialPermissionModel.find({
      adminId,
      status: "ACTIVE",
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).lean();
    
    // 4. Fetch blocked permissions with metadata
    const blockedPermissions = await BlockPermissionModel.find({
      adminId,
      status: "ACTIVE",
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).lean();
    
    // 5. Calculate effective permissions
    const blockedCodes = blockedPermissions.map(bp => bp.permission);
    const specialCodes = specialPermissions.map(sp => sp.permission);
    
    const allowedPermissions = new Set([...rolePermissions, ...specialCodes]);
    blockedCodes.forEach(blocked => allowedPermissions.delete(blocked));
    
    return {
      adminType: admin.adminType,
      rolePermissions,
      specialPermissions: specialPermissions.map(sp => ({
        permission: sp.permission,
        grantedBy: sp.grantedBy,
        reason: sp.reason,
        expiresAt: sp.expiresAt,
        createdAt: sp.createdAt
      })),
      blockedPermissions: blockedPermissions.map(bp => ({
        permission: bp.permission,
        blockedBy: bp.blockedBy,
        reason: bp.reason,
        expiresAt: bp.expiresAt,
        createdAt: bp.createdAt
      })),
      effectivePermissions: Array.from(allowedPermissions)
    };
    
  } catch (error) {
    logWithTime(`[resolveAdminPermissionsDetailed] Error: ${error.message}`);
    throw error;
  }
}

/**
 * Batch resolve permissions for multiple admins
 * Optimized for bulk operations
 * 
 * @param {Array<string>} adminIds - Array of admin IDs
 * @returns {Promise<Map<string, Array<string>>>} Map of adminId to permissions
 */
async function batchResolveAdminPermissions(adminIds) {
  try {
    const results = new Map();
    
    // Resolve in parallel
    const promises = adminIds.map(async (adminId) => {
      try {
        const permissions = await resolveAdminPermissions(adminId);
        results.set(adminId, permissions);
      } catch (error) {
        logWithTime(`[batchResolveAdminPermissions] Failed for ${adminId}: ${error.message}`);
        results.set(adminId, []);
      }
    });
    
    await Promise.all(promises);
    
    return results;
    
  } catch (error) {
    logWithTime(`[batchResolveAdminPermissions] Error: ${error.message}`);
    throw error;
  }
}

module.exports = {
  resolveAdminPermissions,
  resolveAdminPermissionsDetailed,
  batchResolveAdminPermissions
};
