/**
 * CENTRALIZED FIELD DEFINITIONS CONFIG
 * 
 * Single Source of Truth for:
 * - Required fields per endpoint/action
 * - Validation rules mapping
 * - Field-level metadata
 * 
 * Benefits:
 * 1. Ek jagah change karein, sab jagah reflect ho
 * 2. Type-safe through enum-like structure
 * 3. Automatic derivation of required-fields arrays
 * 4. Direct mapping to validation rules
 */

const { validationRules } = require("./validation.config");

/**
 * Field Metadata Structure:
 * {
 *   field: 'fieldName',           // Field identifier
 *   required: true/false,         // Is this field required?
 *   validation: validationRule,   // Link to validation.config.js rule
 *   description: 'Field purpose'  // Optional documentation
 * }
 */

// AUTH ENDPOINTS FIELD DEFINITIONS

const FieldDefinitions = {

  // ========== ADMIN PANEL OPERATIONS ==========
  
  // Admin Creation
  CREATE_ADMIN: {
    ADMIN_TYPE: {
      field: 'adminType',
      required: true,
      validation: validationRules.adminType,
      description: 'Type of admin being created'
    },
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.adminCreationReason,
      description: 'Reason for creating admin'
    }
  },

  // Fetch Admin Details
  FETCH_ADMIN_DETAILS: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.fetchAdminDetailsReason,
      description: 'Reason for fetching admin details'
    }
  },

  // Fetch User Details
  FETCH_USER_DETAILS: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.fetchUserDetailsReason,
      description: 'Reason for fetching user details'
    }
  },

  // Update Admin Details
  UPDATE_ADMIN_DETAILS: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.updateAdminDetailsReason,
      description: 'Reason for updating admin details'
    }
  },

  // Update Admin Role
  UPDATE_ADMIN_ROLE: {
    NEW_ROLE: {
      field: 'newRole',
      required: true,
      validation: validationRules.adminType,
      description: 'New role to assign to admin'
    },
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.adminUpdateRoleReason,
      description: 'Reason for role update'
    }
  },

  // Activate Admin
  ACTIVATE_ADMIN: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.activationReason,
      description: 'Reason for activating admin'
    }
  },

  // Deactivate Admin
  DEACTIVATE_ADMIN: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.deactivationReason,
      description: 'Reason for deactivating admin'
    }
  },

  // Change Supervisor
  CHANGE_SUPERVISOR: {
    NEW_SUPERVISOR_ID: {
      field: 'newSupervisorId',
      required: true,
      validation: validationRules.adminId,
      description: 'ID of the new supervisor'
    },
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.changeSupervisorReason,
      description: 'Reason for changing supervisor'
    }
  },

  // ========== REQUEST OPERATIONS ==========

  // Approve Activation Request
  APPROVE_ACTIVATION_REQUEST: {
    REVIEW_NOTES: {
      field: 'reviewNotes',
      required: true,
      validation: validationRules.notes,
      description: 'Review notes for approval'
    }
  },

  // Reject Activation Request
  REJECT_ACTIVATION_REQUEST: {
    REVIEW_NOTES: {
      field: 'reviewNotes',
      required: true,
      validation: validationRules.notes,
      description: 'Review notes for rejection'
    }
  },

  // Approve Deactivation Request
  APPROVE_DEACTIVATION_REQUEST: {
    REVIEW_NOTES: {
      field: 'reviewNotes',
      required: true,
      validation: validationRules.notes,
      description: 'Review notes for approval'
    }
  },

  // Reject Deactivation Request
  REJECT_DEACTIVATION_REQUEST: {
    REVIEW_NOTES: {
      field: 'reviewNotes',
      required: true,
      validation: validationRules.notes,
      description: 'Review notes for rejection'
    }
  },

  // Create Activation Request
  CREATE_ACTIVATION_REQUEST: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.activationReason,
      description: 'Reason for activation request'
    },
    NOTES: {
      field: 'notes',
      required: true,
      validation: validationRules.notes,
      description: 'Additional notes'
    }
  },

  // Create Deactivation Request
  CREATE_DEACTIVATION_REQUEST: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.deactivationReason,
      description: 'Reason for deactivation request'
    },
    NOTES: {
      field: 'notes',
      required: true,
      validation: validationRules.notes,
      description: 'Additional notes'
    }
  },

  // ========== USER OPERATIONS ==========

  // Block User
  BLOCK_USER: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.blockReason,
      description: 'Reason for blocking user'
    },
    REASON_DETAILS: {
      field: 'reasonDetails',
      required: true,
      validation: validationRules.notes,
      description: 'Detailed reason for blocking'
    }
  },

  // Unblock User
  UNBLOCK_USER: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.unblockReason,
      description: 'Reason for unblocking user'
    },
    REASON_DETAILS: {
      field: 'reasonDetails',
      required: true,
      validation: validationRules.notes,
      description: 'Detailed reason for unblocking'
    }
  },

  // ========== DEVICE OPERATIONS ==========

  // Block Device
  BLOCK_DEVICE: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.blockDeviceReason,
      description: 'Reason for blocking device'
    },
    REASON_DETAILS: {
      field: 'reasonDetails',
      required: true,
      validation: validationRules.notes,
      description: 'Detailed reason for blocking'
    }
  },

  // Unblock Device
  UNBLOCK_DEVICE: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.unblockDeviceReason,
      description: 'Reason for unblocking device'
    },
    REASON_DETAILS: {
      field: 'reasonDetails',
      required: true,
      validation: validationRules.notes,
      description: 'Detailed reason for unblocking'
    }
  },

  // Fetch Device Details
  FETCH_DEVICE_DETAILS: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.fetchDeviceDetailsReason,
      description: 'Reason for fetching device details'
    }
  },

  // ========== INTERNAL OPERATIONS ==========

  // Provide User Account Details
  PROVIDE_USER_ACCOUNT_DETAILS: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.userAccountDetailsReason,
      description: 'Reason for accessing user account details'
    }
  },

  // Get User Active Devices
  GET_USER_ACTIVE_DEVICES: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.userActiveDevicesReason,
      description: 'Reason for accessing user active devices'
    }
  },

  // Check Auth Logs
  CHECK_AUTH_LOGS: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.authLogCheckReason,
      description: 'Reason for checking auth logs'
    }
  },

  // ========== ACTIVITY TRACKER ==========

  // View Admin Activity Tracker
  VIEW_ADMIN_ACTIVITY_TRACKER: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.activityTrackerReason,
      description: 'Reason for viewing activity tracker'
    }
  },

  // ========== PERMISSION MANAGEMENT OPERATIONS ==========

  // Grant Special Permission
  GRANT_SPECIAL_PERMISSION: {
    ADMIN_ID: {
      field: 'adminId',
      required: true,
      validation: validationRules.adminId,
      description: 'Target admin ID to grant permission'
    },
    PERMISSION: {
      field: 'permission',
      required: true,
      validation: validationRules.permission,
      description: 'Permission code (resource:action format)'
    },
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.specialPermissionReason,
      description: 'Reason for granting special permission'
    },
    NOTES: {
      field: 'notes',
      required: false,
      validation: validationRules.notes,
      description: 'Additional notes for permission grant'
    },
    EXPIRES_AT: {
      field: 'expiresAt',
      required: false,
      description: 'Optional expiration date (ISO 8601)'
    }
  },

  // Block Permission
  BLOCK_PERMISSION: {
    ADMIN_ID: {
      field: 'adminId',
      required: true,
      validation: validationRules.adminId,
      description: 'Target admin ID to block permission'
    },
    PERMISSION: {
      field: 'permission',
      required: true,
      validation: validationRules.permission,
      description: 'Permission code to block'
    },
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.blockPermissionReason,
      description: 'Reason for blocking permission'
    },
    NOTES: {
      field: 'notes',
      required: false,
      validation: validationRules.notes,
      description: 'Additional notes for permission block'
    }
  },

  // Revoke Permission Override
  REVOKE_PERMISSION_OVERRIDE: {
    NOTES: {
      field: 'notes',
      required: false,
      validation: validationRules.notes,
      description: 'Notes for revocation'
    }
  },

  // ========== ROLE CHANGE REQUEST OPERATIONS ==========

  // Create Role Change Request
  CREATE_ROLE_CHANGE_REQUEST: {
    TARGET_ADMIN_ID: {
      field: 'targetAdminId',
      required: true,
      validation: validationRules.adminId,
      description: 'Admin ID whose role is to be changed'
    },
    REQUESTED_ROLE: {
      field: 'requestedRole',
      required: true,
      validation: validationRules.adminType,
      description: 'New role being requested'
    },
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.roleChangeReason,
      description: 'Reason for role change'
    },
    NOTES: {
      field: 'notes',
      required: false,
      validation: validationRules.notes,
      description: 'Additional notes for role change request'
    }
  },

  // Approve/Reject Role Change Request
  REVIEW_ROLE_CHANGE_REQUEST: {
    REVIEW_NOTES: {
      field: 'reviewNotes',
      required: false,
      validation: validationRules.reviewNotes,
      description: 'Review notes from approver'
    }
  },

  // ========== CLIENT MANAGEMENT OPERATIONS ==========

  // Create Client (Admin-initiated)
  CREATE_CLIENT: {
    USER_ID: {
      field: 'userId',
      required: true,
      validation: validationRules.adminId,
      description: 'User ID to convert to client'
    },
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.clientCreationReason,
      description: 'Reason for client creation'
    },
    NOTES: {
      field: 'notes',
      required: false,
      validation: validationRules.notes,
      description: 'Additional notes for client creation'
    }
  },

  // Revert Client
  REVERT_CLIENT: {
    REASON: {
      field: 'reason',
      required: true,
      validation: validationRules.clientRevertReason,
      description: 'Reason for reverting client'
    },
    NOTES: {
      field: 'notes',
      required: false,
      validation: validationRules.notes,
      description: 'Additional notes for client revert'
    }
  },

  // Request Client Onboarding (Self-signup)
  REQUEST_CLIENT_ONBOARDING: {
    USER_ID: {
      field: 'userId',
      required: true,
      validation: validationRules.adminId,
      description: 'User ID requesting client status'
    },
    ORG_NAME: {
      field: 'orgName',
      required: true,
      description: 'Organization name'
    },
    NOTES: {
      field: 'notes',
      required: false,
      validation: validationRules.notes,
      description: 'Additional information about the organization'
    }
  }
};

// HELPER: Get Required Fields Array

/**
 * Extracts required field names from a definition object
 * @param {Object} definition - Field definition object (e.g., FieldDefinitions.SIGN_UP)
 * @returns {Array<string>} - Array of required field names
 * 
 * Example:
 * getRequiredFields(FieldDefinitions.CHANGE_PASSWORD) 
 * => ['password', 'newPassword', 'confirmPassword']
 */

const getRequiredFields = (definition) => {
  return Object.values(definition)
    .filter(fieldMeta => fieldMeta.required)
    .map(fieldMeta => fieldMeta.field);
};

// HELPER: Get Validation Set

/**
 * Extracts validation rules mapped to field names
 * @param {Object} definition - Field definition object
 * @returns {Object} - Validation set { fieldName: validationRule }
 * 
 * Example:
 * getValidationSet(FieldDefinitions.VERIFY_PHONE)
 * => { phone: validationRules.phone }
 */

const getValidationSet = (definition) => {
  return Object.values(definition).reduce((acc, fieldMeta) => {
    if (fieldMeta.validation) {
      acc[fieldMeta.field] = fieldMeta.validation;
    }
    return acc;
  }, {});
};

// EXPORTS

module.exports = {
  FieldDefinitions,
  getRequiredFields,
  getValidationSet
};
