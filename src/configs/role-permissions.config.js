/**
 * RBAC PERMISSIONS CONFIGURATION
 * 
 * Single Source of Truth for role-based permissions.
 * Maps each governance role to its base permissions following
 * the Admin Panel Service responsibility matrix.
 * 
 * Uses nested Resource-Action structure for better maintainability
 * and alignment with industry standard RBAC patterns.
 * 
 * Structure: { role: { resource: [actions] } }
 * Resolution Priority: DENY > SPECIAL_ALLOW > ROLE_ALLOW
 */

const { RBACResources } = require("./rbac-resources.config");
const { RBACActions } = require("./rbac-actions.config");
const { AdminTypes } = require("./enums.config");

/**
 * Role Permission Mappings
 * Each role is assigned its base permissions using resource-action structure
 */
const RolePermissions = Object.freeze({

  /**
   * SUPER_ADMIN - Root Authority
   * 
   * Full system control. Can perform all operations including:
   * - Create/delete any admin
   * - Assign/remove any role
   * - Grant/revoke any permission
   * - Override approvals
   * - System configuration
   * - Cannot be blocked by lower roles
   */
  [AdminTypes.SUPER_ADMIN]: {
    [RBACResources.ADMINS.code]: [
      RBACActions.CREATE.code,
      RBACActions.READ.code,
      RBACActions.UPDATE.code,
      RBACActions.DELETE.code,
      RBACActions.ACTIVATE.code,
      RBACActions.DEACTIVATE.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code,
      RBACActions.PASSWORD_RESET.code,
      RBACActions.MFA_ENFORCE.code,
      RBACActions.MFA_RESET.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code,
      RBACActions.SESSION_TERMINATE_SINGLE.code,
      RBACActions.SESSION_TERMINATE_ALL.code,
      RBACActions.TERMINATE_ALL_SESSIONS_ON_DEVICE.code
    ],
    [RBACResources.USERS.code]: [
      RBACActions.READ.code,
      RBACActions.ACTIVATE.code,
      RBACActions.DEACTIVATE.code,
      RBACActions.DELETE.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code,
      RBACActions.PASSWORD_RESET.code,
      RBACActions.MFA_ENFORCE.code,
      RBACActions.MFA_RESET.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code,
      RBACActions.SESSION_TERMINATE_SINGLE.code,
      RBACActions.SESSION_TERMINATE_ALL.code,
      RBACActions.TERMINATE_ALL_SESSIONS_ON_DEVICE.code
    ],
    [RBACResources.CLIENTS.code]: [
      RBACActions.CREATE.code,
      RBACActions.READ.code,
      RBACActions.UPDATE.code,
      RBACActions.DELETE.code,
      RBACActions.ACTIVATE.code,
      RBACActions.DEACTIVATE.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code,
      RBACActions.REVERT.code,
      RBACActions.PASSWORD_RESET.code,
      RBACActions.MFA_ENFORCE.code,
      RBACActions.MFA_RESET.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code,
      RBACActions.SESSION_TERMINATE_SINGLE.code,
      RBACActions.SESSION_TERMINATE_ALL.code,
      RBACActions.TERMINATE_ALL_SESSIONS_ON_DEVICE.code
    ],
    [RBACResources.DEVICES.code]: [
      RBACActions.READ.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code
    ],
    [RBACResources.PERMISSIONS.code]: [
      RBACActions.READ.code,
      RBACActions.GRANT_PERMISSION.code,
      RBACActions.REVOKE_PERMISSION.code
    ],
    [RBACResources.ROLES.code]: [
      RBACActions.READ.code,
      RBACActions.ASSIGN_ROLE.code
    ],
    [RBACResources.REQUESTS.code]: [
      RBACActions.CREATE.code,
      RBACActions.READ.code,
      RBACActions.APPROVE.code,
      RBACActions.REJECT.code,
      RBACActions.CANCEL.code,
      RBACActions.EXECUTE.code,
      RBACActions.ABORT_EXECUTION.code,
      RBACActions.ESCALATE.code,
      RBACActions.ARCHIVE.code
    ],
    [RBACResources.ACTIVITY_LOGS.code]: [
      RBACActions.READ.code,
      RBACActions.EXPORT.code
    ],
    [RBACResources.AUTH_LOGS.code]: [
      RBACActions.READ.code,
      RBACActions.EXPORT.code
    ],
    [RBACResources.SYSTEM_CONFIG.code]: [
      RBACActions.READ.code,
      RBACActions.UPDATE.code
    ]
  },

  /**
   * ORG_ADMIN - Organization Operations Head
   * 
   * Manages organizational operations including:
   * - Create Ops/Support/Internal admins
   * - Manage clients
   * - User lifecycle management
   * - Review operational requests
   * - View activity logs
   * 
   * Cannot:
   * - Create Super Admins
   * - Override system configs
   */
  [AdminTypes.ORG_ADMIN]: {
    [RBACResources.ADMINS.code]: [
      RBACActions.CREATE.code,
      RBACActions.READ.code,
      RBACActions.UPDATE.code,
      RBACActions.ACTIVATE.code,
      RBACActions.DEACTIVATE.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code,
      RBACActions.PASSWORD_RESET.code,
      RBACActions.MFA_ENFORCE.code,
      RBACActions.MFA_RESET.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code,
      RBACActions.SESSION_TERMINATE_SINGLE.code,
      RBACActions.SESSION_TERMINATE_ALL.code,
      RBACActions.TERMINATE_ALL_SESSIONS_ON_DEVICE.code
    ],
    [RBACResources.USERS.code]: [
      RBACActions.READ.code,
      RBACActions.ACTIVATE.code,
      RBACActions.DEACTIVATE.code,
      RBACActions.DELETE.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code,
      RBACActions.PASSWORD_RESET.code,
      RBACActions.MFA_ENFORCE.code,
      RBACActions.MFA_RESET.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code,
      RBACActions.SESSION_TERMINATE_SINGLE.code,
      RBACActions.SESSION_TERMINATE_ALL.code,
      RBACActions.TERMINATE_ALL_SESSIONS_ON_DEVICE.code
    ],
    [RBACResources.CLIENTS.code]: [
      RBACActions.CREATE.code,
      RBACActions.READ.code,
      RBACActions.UPDATE.code,
      RBACActions.ACTIVATE.code,
      RBACActions.DEACTIVATE.code,
      RBACActions.DELETE.code,
      RBACActions.REVERT.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code,
      RBACActions.PASSWORD_RESET.code,
      RBACActions.MFA_ENFORCE.code,
      RBACActions.MFA_RESET.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code,
      RBACActions.SESSION_TERMINATE_SINGLE.code,
      RBACActions.SESSION_TERMINATE_ALL.code,
      RBACActions.TERMINATE_ALL_SESSIONS_ON_DEVICE.code
    ],
    [RBACResources.DEVICES.code]: [
      RBACActions.READ.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code
    ],
    [RBACResources.PERMISSIONS.code]: [
      RBACActions.READ.code,
      RBACActions.GRANT_PERMISSION.code,
      RBACActions.REVOKE_PERMISSION.code
    ],
    [RBACResources.ROLES.code]: [
      RBACActions.READ.code,
      RBACActions.ASSIGN_ROLE.code
    ],
    [RBACResources.REQUESTS.code]: [
      RBACActions.CREATE.code,
      RBACActions.READ.code,
      RBACActions.APPROVE.code,
      RBACActions.REJECT.code,
      RBACActions.CANCEL.code,
      RBACActions.EXECUTE.code,
      RBACActions.ABORT_EXECUTION.code,
      RBACActions.ESCALATE.code,
      RBACActions.ARCHIVE.code
    ],
    [RBACResources.ACTIVITY_LOGS.code]: [
      RBACActions.READ.code,
      RBACActions.EXPORT.code
    ],
    [RBACResources.AUTH_LOGS.code]: [
      RBACActions.READ.code,
      RBACActions.EXPORT.code
    ],
    [RBACResources.SYSTEM_CONFIG.code]: [
      RBACActions.READ.code
    ]
  },

  /**
   * OPERATIONS_ADMIN - Day-to-Day Operations
   * 
   * Handles routine user & device operations:
   * - Block/unblock users
   * - Block/unblock devices
   * - Password resets (via user management)
   * - Deactivate suspicious accounts
   * - View user activity
   * - Flag accounts
   * 
   * Cannot:
   * - Create admins
   * - Assign roles
   * - Grant permissions
   */
  [AdminTypes.OPERATIONS_ADMIN]: {
    [RBACResources.USERS.code]: [
      RBACActions.READ.code,
      RBACActions.DEACTIVATE.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code,
      RBACActions.PASSWORD_RESET.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code,
      RBACActions.SESSION_TERMINATE_SINGLE.code,
      RBACActions.SESSION_TERMINATE_ALL.code,
      RBACActions.TERMINATE_ALL_SESSIONS_ON_DEVICE.code
    ],
    [RBACResources.CLIENTS.code]: [
      RBACActions.READ.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code,
      RBACActions.PASSWORD_RESET.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code,
      RBACActions.SESSION_TERMINATE_SINGLE.code,
      RBACActions.SESSION_TERMINATE_ALL.code,
      RBACActions.TERMINATE_ALL_SESSIONS_ON_DEVICE.code
    ],
    [RBACResources.DEVICES.code]: [
      RBACActions.READ.code,
      RBACActions.BLOCK.code,
      RBACActions.UNBLOCK.code,
      RBACActions.SUSPEND.code,
      RBACActions.UNSUSPEND.code
    ],
    [RBACResources.REQUESTS.code]: [
      RBACActions.CREATE.code,
      RBACActions.READ.code,
      RBACActions.CANCEL.code
    ],
    [RBACResources.ACTIVITY_LOGS.code]: [
      RBACActions.READ.code
    ],
    [RBACResources.AUTH_LOGS.code]: [
      RBACActions.READ.code
    ]
  },

  /**
   * SUPPORT_ADMIN - Request Handling Layer
   * 
   * Handles support requests and escalations:
   * - Review deactivation/reactivation requests
   * - Process unblock appeals
   * - Raise escalations
   * - View limited activity logs
   * 
   * Cannot:
   * - Deactivate admins
   * - Grant roles
   * - Assign permissions
   * - Approve requests (can only create/view)
   */
  [AdminTypes.SUPPORT_ADMIN]: {
    [RBACResources.USERS.code]: [
      RBACActions.READ.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code
    ],
    [RBACResources.CLIENTS.code]: [
      RBACActions.READ.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code
    ],
    [RBACResources.DEVICES.code]: [
      RBACActions.READ.code
    ],
    [RBACResources.REQUESTS.code]: [
      RBACActions.CREATE.code,
      RBACActions.READ.code,
      RBACActions.CANCEL.code,
      RBACActions.ESCALATE.code
    ],
    [RBACResources.ACTIVITY_LOGS.code]: [
      RBACActions.READ.code
    ],
    [RBACResources.AUTH_LOGS.code]: [
      RBACActions.READ.code
    ]
  },

  /**
   * AUDIT_ADMIN - Compliance Monitoring
   * 
   * Read-only governance role for compliance:
   * - View auth logs
   * - View admin activity
   * - Monitor suspicious actions
   * - Export reports
   * 
   * No write permissions - pure monitoring role
   */
  [AdminTypes.AUDIT_ADMIN]: {
    [RBACResources.ADMINS.code]: [
      RBACActions.READ.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code
    ],
    [RBACResources.USERS.code]: [
      RBACActions.READ.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code
    ],
    [RBACResources.CLIENTS.code]: [
      RBACActions.READ.code,
      RBACActions.SESSION_VIEW.code,
      RBACActions.SESSION_DEVICE_VIEW.code
    ],
    [RBACResources.DEVICES.code]: [
      RBACActions.READ.code
    ],
    [RBACResources.PERMISSIONS.code]: [
      RBACActions.READ.code
    ],
    [RBACResources.ROLES.code]: [
      RBACActions.READ.code
    ],
    [RBACResources.REQUESTS.code]: [
      RBACActions.READ.code
    ],
    [RBACResources.ACTIVITY_LOGS.code]: [
      RBACActions.READ.code,
      RBACActions.EXPORT.code
    ],
    [RBACResources.AUTH_LOGS.code]: [
      RBACActions.READ.code,
      RBACActions.EXPORT.code
    ],
    [RBACResources.SYSTEM_CONFIG.code]: [
      RBACActions.READ.code
    ]
  },

  /**
   * INTERNAL_ADMIN - Shell Role
   * 
   * Least-privileged governance classification.
   * Used to identify internal staff for approval routing
   * and governance isolation.
   * 
   * Default permissions: NONE
   * Power only via special permissions or temporary overrides
   */
  [AdminTypes.INTERNAL_ADMIN]: {
    // No baseline permissions
    // All access must be granted via special permissions
  }
});

module.exports = {
  RolePermissions
};