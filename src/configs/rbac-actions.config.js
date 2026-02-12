/**
 * RBAC ACTIONS CONFIGURATION
 * 
 * Defines all actions that can be performed on resources
 * in the Admin Panel governance system.
 * 
 * Actions represent operations that can be controlled via permissions.
 */

const RBACActions = Object.freeze({
  CREATE: {
    code: "create",
    label: "Create",
    description: "Create new instances of the resource"
  },
  READ: {
    code: "read",
    label: "Read",
    description: "View and read resource details"
  },
  UPDATE: {
    code: "update",
    label: "Update",
    description: "Modify existing resource attributes"
  },
  DELETE: {
    code: "delete",
    label: "Delete",
    description: "Remove or delete resources"
  },
  BLOCK: {
    code: "block",
    label: "Block",
    description: "Block or restrict resource access"
  },
  UNBLOCK: {
    code: "unblock",
    label: "Unblock",
    description: "Remove blocks and restore access"
  },
  ACTIVATE: {
    code: "activate",
    label: "Activate",
    description: "Activate deactivated resources"
  },
  DEACTIVATE: {
    code: "deactivate",
    label: "Deactivate",
    description: "Deactivate active resources"
  },
  APPROVE: {
    code: "approve",
    label: "Approve",
    description: "Approve pending requests"
  },
  REJECT: {
    code: "reject",
    label: "Reject",
    description: "Reject pending requests"
  },
  EXPORT: {
    code: "export",
    label: "Export",
    description: "Export data and generate reports"
  },
  ASSIGN_ROLE: {
    code: "assign_role",
    label: "Assign Role",
    description: "Assign roles to admins"
  },
  GRANT_PERMISSION: {
    code: "grant_permission",
    label: "Grant Permission",
    description: "Grant special permissions"
  },
  REVOKE_PERMISSION: {
    code: "revoke_permission",
    label: "Revoke Permission",
    description: "Revoke or block permissions"
  },
  VIEW_SENSITIVE: {
    code: "view_sensitive",
    label: "View Sensitive Data",
    description: "Access sensitive information"
  }
});

// Helper to get action codes as array
const ActionCodes = Object.freeze(
  Object.values(RBACActions).map(a => a.code)
);

module.exports = {
  RBACActions,
  ActionCodes
};
