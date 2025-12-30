const { checkRole } = require("@utils/role.util");
const {
  throwAccessDeniedError,
  throwInternalServerError,
  logMiddlewareError,
  errorMessage
} = require("@utils/error-handler.util");
const { logWithTime } = require("@utils/time-stamps.util");

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

      logWithTime(`✅ [${label}] Access granted for role: ${role}`);
      return next();
    } catch (err) {
      logMiddlewareError(label, "❌ Internal error during role check", req);
      errorMessage(err);
      return throwInternalServerError(res);
    }
  };
}

module.exports = {
    createRoleMiddleware
}