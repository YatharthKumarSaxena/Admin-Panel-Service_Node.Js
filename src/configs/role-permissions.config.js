/**
 * RBAC PERMISSIONS CONFIGURATION
 * 
 * Single Source of Truth for role-based permissions.
 * Maps each governance role to its base permissions following
 * the Admin Panel Service responsibility matrix.
 * 
 * Resolution Priority: DENY > SPECIAL_ALLOW > ROLE_ALLOW
 */

const { Permissions } = require("./permissions.config");
const { AdminTypes } = require("./enums.config");

/**
 * Role Permission Mappings
 * Each role is assigned its base permissions
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
  [AdminTypes.SUPER_ADMIN]: Object.values(Permissions),

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
  [AdminTypes.ORG_ADMIN]: [
    // Admin Management (Limited to lower roles)
    Permissions.ADMIN_CREATE,
    Permissions.ADMIN_READ,
    Permissions.ADMIN_UPDATE,
    Permissions.ADMIN_ACTIVATE,
    Permissions.ADMIN_DEACTIVATE,
    Permissions.ADMIN_SUSPEND,
    Permissions.ADMIN_UNSUSPEND,
    Permissions.ADMIN_PASSWORD_RESET,

    // User Management (Full Lifecycle)
    Permissions.USER_READ,
    Permissions.USER_ACTIVATE,
    Permissions.USER_DEACTIVATE,
    Permissions.USER_DELETE,
    Permissions.USER_BLOCK,
    Permissions.USER_UNBLOCK,
    Permissions.USER_SUSPEND,
    Permissions.USER_UNSUSPEND,
    Permissions.USER_PASSWORD_RESET,

    // Client Management (Full Lifecycle)
    Permissions.CLIENT_CREATE,
    Permissions.CLIENT_READ,
    Permissions.CLIENT_UPDATE,
    Permissions.CLIENT_ACTIVATE,
    Permissions.CLIENT_DEACTIVATE,
    Permissions.CLIENT_DELETE,
    Permissions.CLIENT_REVERT,
    Permissions.CLIENT_BLOCK,
    Permissions.CLIENT_UNBLOCK,
    Permissions.CLIENT_SUSPEND,
    Permissions.CLIENT_UNSUSPEND,
    Permissions.CLIENT_PASSWORD_RESET,

    // Device Management
    Permissions.DEVICE_READ,
    Permissions.DEVICE_BLOCK,
    Permissions.DEVICE_UNBLOCK,
    Permissions.DEVICE_SUSPEND,
    Permissions.DEVICE_UNSUSPEND,

    // Session Governance (Full Control)
    Permissions.USER_SESSION_VIEW,
    Permissions.USER_SESSION_TERMINATE_SINGLE,
    Permissions.USER_SESSION_TERMINATE_ALL,
    Permissions.USER_MFA_ENFORCE,
    Permissions.USER_MFA_RESET,
    Permissions.ADMIN_SESSION_VIEW,
    Permissions.ADMIN_SESSION_TERMINATE_SINGLE,
    Permissions.ADMIN_SESSION_TERMINATE_ALL,
    Permissions.ADMIN_MFA_ENFORCE,
    Permissions.ADMIN_MFA_RESET,
    Permissions.CLIENT_SESSION_VIEW,
    Permissions.CLIENT_SESSION_TERMINATE_SINGLE,
    Permissions.CLIENT_SESSION_TERMINATE_ALL,
    Permissions.CLIENT_MFA_ENFORCE,
    Permissions.CLIENT_MFA_RESET,

    // Role & Permission Management
    Permissions.ROLE_ASSIGN,
    Permissions.ROLE_VIEW,
    Permissions.PERMISSION_GRANT,
    Permissions.PERMISSION_REVOKE,
    Permissions.PERMISSION_VIEW,

    // Request Management (Full)
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW,
    Permissions.REQUEST_APPROVE,
    Permissions.REQUEST_REJECT,
    Permissions.REQUEST_CANCEL,
    Permissions.REQUEST_EXECUTE,
    Permissions.REQUEST_ABORT_EXECUTION,
    Permissions.REQUEST_ESCALATE,
    Permissions.REQUEST_ARCHIVE,

    // Logs (Full Access)
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.ACTIVITY_LOGS_EXPORT,
    Permissions.AUTH_LOGS_VIEW,
    Permissions.AUTH_LOGS_EXPORT,

    // System Config (Read Only)
    Permissions.SYSTEM_CONFIG_READ
  ],

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
  
  [AdminTypes.OPERATIONS_ADMIN]: [
    // User Management (Operational)
    Permissions.USER_READ,
    Permissions.USER_DEACTIVATE,
    Permissions.USER_BLOCK,
    Permissions.USER_UNBLOCK,
    Permissions.USER_SUSPEND,
    Permissions.USER_UNSUSPEND,
    Permissions.USER_PASSWORD_RESET,

    // Client Management (Operational)
    Permissions.CLIENT_READ,
    Permissions.CLIENT_BLOCK,
    Permissions.CLIENT_UNBLOCK,
    Permissions.CLIENT_SUSPEND,
    Permissions.CLIENT_UNSUSPEND,
    Permissions.CLIENT_PASSWORD_RESET,

    // Device Management
    Permissions.DEVICE_READ,
    Permissions.DEVICE_BLOCK,
    Permissions.DEVICE_UNBLOCK,
    Permissions.DEVICE_SUSPEND,
    Permissions.DEVICE_UNSUSPEND,

    // Session Governance (User & Client)
    Permissions.USER_SESSION_VIEW,
    Permissions.USER_SESSION_TERMINATE_SINGLE,
    Permissions.USER_SESSION_TERMINATE_ALL,
    Permissions.CLIENT_SESSION_VIEW,
    Permissions.CLIENT_SESSION_TERMINATE_SINGLE,
    Permissions.CLIENT_SESSION_TERMINATE_ALL,

    // Request Management
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW,
    Permissions.REQUEST_CANCEL,

    // Logs (View Only)
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.AUTH_LOGS_VIEW
  ],

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
  [AdminTypes.SUPPORT_ADMIN]: [
    // User Management (Read Only)
    Permissions.USER_READ,

    // Client Management (Read Only)
    Permissions.CLIENT_READ,

    // Device Management (Read Only)
    Permissions.DEVICE_READ,

    // Session Governance (View Only)
    Permissions.USER_SESSION_VIEW,
    Permissions.CLIENT_SESSION_VIEW,

    // Request Management
    Permissions.REQUEST_CREATE,
    Permissions.REQUEST_VIEW,
    Permissions.REQUEST_CANCEL,
    Permissions.REQUEST_ESCALATE,

    // Logs (View Only)
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.AUTH_LOGS_VIEW
  ],

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
  [AdminTypes.AUDIT_ADMIN]: [
    // Admin Viewing
    Permissions.ADMIN_READ,

    // User Viewing
    Permissions.USER_READ,

    // Client Viewing
    Permissions.CLIENT_READ,

    // Device Viewing
    Permissions.DEVICE_READ,

    // Session Governance (View Only)
    Permissions.USER_SESSION_VIEW,
    Permissions.ADMIN_SESSION_VIEW,
    Permissions.CLIENT_SESSION_VIEW,

    // Role & Permission Viewing
    Permissions.ROLE_VIEW,
    Permissions.PERMISSION_VIEW,

    // Request Viewing
    Permissions.REQUEST_VIEW,

    // Logs (Full Read + Export)
    Permissions.ACTIVITY_LOGS_VIEW,
    Permissions.ACTIVITY_LOGS_EXPORT,
    Permissions.AUTH_LOGS_VIEW,
    Permissions.AUTH_LOGS_EXPORT,

    // System Config (Read Only)
    Permissions.SYSTEM_CONFIG_READ
  ],

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
  [AdminTypes.INTERNAL_ADMIN]: [
    // No baseline permissions
    // All access must be granted via special permissions
  ]
});

module.exports = {
  RolePermissions
};