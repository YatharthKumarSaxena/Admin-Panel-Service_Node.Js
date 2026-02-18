/**
 * RBAC ACTIONS CONFIGURATION
 * 
 * Defines all actions that can be performed on resources
 * in the Admin Panel governance system.
 * 
 * Actions represent operations that can be controlled via permissions.
 */

const RBACActions = Object.freeze({
  // ========== BASIC CRUD OPERATIONS ==========
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
  
  // ========== ACCOUNT STATE MANAGEMENT ==========
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
  SUSPEND: {
    code: "suspend",
    label: "Suspend",
    description: "Temporarily suspend resource access"
  },
  UNSUSPEND: {
    code: "unsuspend",
    label: "Unsuspend",
    description: "Remove suspension and restore access"
  },
  REVERT: {
    code: "revert",
    label: "Revert",
    description: "Revert resource to previous state"
  },
  
  // ========== AUTHENTICATION & SECURITY ==========
  PASSWORD_RESET: {
    code: "password_reset",
    label: "Password Reset",
    description: "Reset account password"
  },
  MFA_ENFORCE: {
    code: "mfa_enforce",
    label: "Enforce MFA",
    description: "Enforce multi-factor authentication"
  },
  MFA_RESET: {
    code: "mfa_reset",
    label: "Reset MFA",
    description: "Reset multi-factor authentication settings"
  },
  
  // ========== SESSION MANAGEMENT ==========
  SESSION_VIEW: {
    code: "session_view",
    label: "View Sessions",
    description: "View active user sessions"
  },
  SESSION_DEVICE_VIEW: {
    code: "session_device_view",
    label: "View Session Devices",
    description: "View devices associated with sessions"
  },
  SESSION_TERMINATE_SINGLE: {
    code: "session_terminate_single",
    label: "Terminate Single Session",
    description: "Terminate a specific user session"
  },
  SESSION_TERMINATE_ALL: {
    code: "session_terminate_all",
    label: "Terminate All Sessions",
    description: "Terminate all user sessions"
  },
  TERMINATE_ALL_SESSIONS_ON_DEVICE: {
    code: "terminate_all_sessions_on_device",
    label: "Terminate Device Sessions",
    description: "Terminate all sessions on a specific device"
  },
  
  // ========== ROLE & PERMISSION MANAGEMENT ==========
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
  
  // ========== REQUEST WORKFLOW OPERATIONS ==========
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
  CANCEL: {
    code: "cancel",
    label: "Cancel",
    description: "Cancel pending or in-progress requests"
  },
  EXECUTE: {
    code: "execute",
    label: "Execute",
    description: "Execute approved requests"
  },
  ABORT_EXECUTION: {
    code: "abort_execution",
    label: "Abort Execution",
    description: "Abort request execution in progress"
  },
  ESCALATE: {
    code: "escalate",
    label: "Escalate",
    description: "Escalate request to higher authority"
  },
  ARCHIVE: {
    code: "archive",
    label: "Archive",
    description: "Archive completed or rejected requests"
  },
  
  // ========== DATA & REPORTING ==========
  EXPORT: {
    code: "export",
    label: "Export",
    description: "Export data and generate reports"
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
