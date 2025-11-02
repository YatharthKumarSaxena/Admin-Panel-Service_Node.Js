/**
 * Checks if the given role has required permission
 * Used across microservices for RBAC validation.
 *
 * @param {string} role - Actual role of user (from token).
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles.
 * @returns {boolean}
 */

function checkRole(role, allowedRoles) {
  if (!role || !allowedRoles) return false;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.map(r => r.toUpperCase()).includes(role.toUpperCase());
}

module.exports = { checkRole };
