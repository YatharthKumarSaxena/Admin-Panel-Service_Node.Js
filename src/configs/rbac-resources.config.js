/**
 * RBAC RESOURCES CONFIGURATION
 * 
 * Defines all resources that can be controlled via permissions
 * in the Admin Panel governance system.
 * 
 * Resources represent entities or features that admins can act upon.
 */

const RBACResources = Object.freeze({
  ADMINS: {
    code: "admins",
    label: "Admins",
    description: "Admin account management and governance"
  },
  USERS: {
    code: "users",
    label: "Users",
    description: "End-user account management"
  },
  CLIENTS: {
    code: "clients",
    label: "Clients",
    description: "Client account management and conversion"
  },
  DEVICES: {
    code: "devices",
    label: "Devices",
    description: "Device management and security controls"
  },
  PERMISSIONS: {
    code: "permissions",
    label: "Permissions",
    description: "Permission grants and overrides"
  },
  ROLES: {
    code: "roles",
    label: "Roles",
    description: "Role assignment and management"
  },
  REQUESTS: {
    code: "requests",
    label: "Requests",
    description: "Approval workflow requests"
  },
  ACTIVITY_LOGS: {
    code: "activity_logs",
    label: "Activity Logs",
    description: "Admin activity tracking and audit logs"
  },
  AUTH_LOGS: {
    code: "auth_logs",
    label: "Auth Logs",
    description: "Authentication and login history logs"
  },
  SYSTEM_CONFIG: {
    code: "system_config",
    label: "System Configuration",
    description: "System-level settings and configurations"
  }
});

// Helper to get resource codes as array
const ResourceCodes = Object.freeze(
  Object.values(RBACResources).map(r => r.code)
);

module.exports = {
  RBACResources,
  ResourceCodes
};
