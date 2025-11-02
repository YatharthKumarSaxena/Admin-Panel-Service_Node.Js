const { checkRole } = require("../../utils/role.utils");
const { AdminType } = require("../../configs/enums.config");
const {
  throwAccessDeniedError,
  throwInternalServerError,
  logMiddlewareError,
  errorMessage
} = require("../../configs/error-handler.configs");

/**
 * Creates a role-checking middleware with structured logging
 * @param {string[]} allowedRoles - Roles allowed to access the route
 * @param {string} label - Middleware label for logging
 * @returns {function} Express middleware
 */

function createRoleMiddleware(allowedRoles, label) {
  return function (req, res, next) {
    try {
      const role = req.admin?.adminType;
      if (!checkRole(role, allowedRoles)) {
        logMiddlewareError(label, `Access denied for role: ${role}`, req);
        return throwAccessDeniedError(res, `Access denied for role: ${role}`);
      }

      logMiddlewareError(label, `✅ Access granted for role: ${role}`, req);
      return next();
    } catch (err) {
      logMiddlewareError(label, "❌ Internal error during role check", req);
      errorMessage(err);
      return throwInternalServerError(res);
    }
  };
}

const RoleMiddlewares = {
  onlyAdmins: createRoleMiddleware([AdminType.ADMIN], "onlyAdminsMiddleware"),
  onlySuperAdmins: createRoleMiddleware([AdminType.SUPER_ADMIN], "onlySuperAdminsMiddleware"),
  onlyMidAdmins: createRoleMiddleware([AdminType.MID_ADMIN], "onlyMidAdminsMiddleware"),
  adminsAndMidAdmins: createRoleMiddleware([AdminType.ADMIN, AdminType.MID_ADMIN], "adminsAndMidAdminsMiddleware"),
  midAdminsAndSuperAdmins: createRoleMiddleware([AdminType.MID_ADMIN, AdminType.SUPER_ADMIN], "midAdminsAndSuperAdminsMiddleware")
};

module.exports = { createRoleMiddleware, RoleMiddlewares };
