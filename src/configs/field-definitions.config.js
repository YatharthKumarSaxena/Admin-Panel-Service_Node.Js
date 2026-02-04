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
