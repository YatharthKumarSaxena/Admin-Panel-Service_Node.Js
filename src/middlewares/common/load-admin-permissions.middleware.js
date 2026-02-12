/**
 * Load Admin Permissions Middleware
 * 
 * Resolves and loads effective permissions into request object.
 * Should be used after admin authentication middleware.
 * 
 * Attaches: req.adminPermissions (Array<string>)
 */

const { resolveAdminPermissions } = require("@utils/rbac");
const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError } = require("@configs/error-handler.configs");

/**
 * Middleware to load admin permissions
 * Resolves effective permissions and attaches to req.adminPermissions
 */
async function loadAdminPermissions(req, res, next) {
  try {
    // Ensure admin is authenticated (req.admin should exist from auth middleware)
    if (!req.admin || !req.admin.adminId) {
      return throwInternalServerError(res, new Error("Admin not authenticated. Ensure auth middleware runs before loadAdminPermissions."));
    }
    
    const { adminId } = req.admin;
    logWithTime(`[loadAdminPermissions] Loading permissions for ${adminId}`);
    
    // Skip if permissions already loaded (prevent duplicate loading)
    if (req.adminPermissions) {
      logWithTime(`[loadAdminPermissions] Permissions already loaded, skipping`);
      return next();
    }
    
    // Resolve effective permissions
    const permissions = await resolveAdminPermissions(adminId);
    
    // Attach to request
    req.adminPermissions = permissions;
    
    logWithTime(`[loadAdminPermissions] Loaded ${permissions.length} permissions for ${adminId}`);
    
    next();
    
  } catch (error) {
    logWithTime(`[loadAdminPermissions] Error: ${error.message}`);
    return throwInternalServerError(res, error);
  }
}

module.exports = {
  loadAdminPermissions
};
