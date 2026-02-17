const { AdminTypes } = require("@configs/enums.config");
const { createRoleMiddleware } = require("../factory/role-based-access.middleware-factory");

/**
 * Pre-built Role Middleware for 6 Governance Roles
 * 
 * Based on Admin Panel RBAC governance system:
 * - SUPER_ADMIN: Root authority (hierarchy: 5)
 * - ORG_ADMIN: Organization operations head (hierarchy: 4)
 * - OPERATIONS_ADMIN: Day-to-day operations (hierarchy: 3)
 * - SUPPORT_ADMIN: Request handling (hierarchy: 2)
 * - AUDIT_ADMIN: Compliance monitoring (hierarchy: 2)
 * - INTERNAL_ADMIN: Shell role with no baseline permissions (hierarchy: 1)
 */

const RoleMiddlewares = {
  // Single role middleware
  onlySuperAdmins: createRoleMiddleware([AdminTypes.SUPER_ADMIN], "onlySuperAdmins"),
  onlyOrgAdmins: createRoleMiddleware([AdminTypes.ORG_ADMIN], "onlyOrgAdmins"),
  onlyOperationsAdmins: createRoleMiddleware([AdminTypes.OPERATIONS_ADMIN], "onlyOperationsAdmins"),
  onlySupportAdmins: createRoleMiddleware([AdminTypes.SUPPORT_ADMIN], "onlySupportAdmins"),
  onlyAuditAdmins: createRoleMiddleware([AdminTypes.AUDIT_ADMIN], "onlyAuditAdmins"),
  onlyInternalAdmins: createRoleMiddleware([AdminTypes.INTERNAL_ADMIN], "onlyInternalAdmins"),
  
  // Combined role middleware (common patterns)
  orgAndSuperAdmins: createRoleMiddleware(
    [AdminTypes.ORG_ADMIN, AdminTypes.SUPER_ADMIN],
    "orgAndSuperAdmins"
  ),
  operationsAndAbove: createRoleMiddleware(
    [AdminTypes.OPERATIONS_ADMIN, AdminTypes.ORG_ADMIN, AdminTypes.SUPER_ADMIN],
    "operationsAndAbove"
  ),
  supportAndAbove: createRoleMiddleware(
    [AdminTypes.SUPPORT_ADMIN, AdminTypes.OPERATIONS_ADMIN, AdminTypes.ORG_ADMIN, AdminTypes.SUPER_ADMIN],
    "supportAndAbove"
  ),
  allAdmins: createRoleMiddleware(
    Object.values(AdminTypes),
    "allAdmins"
  ),
  
  // Management roles (can manage other admins)
  managementRoles: createRoleMiddleware(
    [AdminTypes.ORG_ADMIN, AdminTypes.SUPER_ADMIN],
    "managementRoles"
  ),
  
  // Operational roles (perform day-to-day operations)
  operationalRoles: createRoleMiddleware(
    [AdminTypes.OPERATIONS_ADMIN, AdminTypes.SUPPORT_ADMIN],
    "operationalRoles"
  ),
  
  // Monitoring roles (read-only audit access)
  monitoringRoles: createRoleMiddleware(
    [AdminTypes.AUDIT_ADMIN],
    "monitoringRoles"
  )
};

module.exports = { RoleMiddlewares };

