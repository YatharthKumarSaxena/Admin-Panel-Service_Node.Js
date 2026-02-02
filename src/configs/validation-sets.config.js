const { validationRules } = require("./validation.config");

/**
 * Validation Sets Configuration
 * Maps controller names to their validation rules
 * Each field maps to a validationRule object with enum/regex/length checks
 */

/**
 * VALIDATION SETS CONFIG (Auto-Generated)
 * 
 * DO NOT MANUALLY EDIT THIS FILE!
 * 
 * These validation sets are automatically derived from:
 * @see field-definitions.config.js (Single Source of Truth)
 * 
 * To add/remove/modify validation rules:
 * → Edit FieldDefinitions in field-definitions.config.js
 * → Changes will automatically reflect here
 */

/*
const { FieldDefinitions, getValidationSet } = require("./field-definitions.config");

// AUTO-GENERATED VALIDATION SETS

const validationSets = {
  signUp: getValidationSet(FieldDefinitions.SIGN_UP),
  signIn: getValidationSet(FieldDefinitions.SIGN_IN),
  activateAccount: getValidationSet(FieldDefinitions.ACTIVATE_ACCOUNT),
  deactivateAccount: getValidationSet(FieldDefinitions.DEACTIVATE_ACCOUNT),
  handle2FA: getValidationSet(FieldDefinitions.HANDLE_2FA),
  changePassword: getValidationSet(FieldDefinitions.CHANGE_PASSWORD),
  resetPassword: getValidationSet(FieldDefinitions.RESET_PASSWORD),
  verifyPhone: getValidationSet(FieldDefinitions.VERIFY_PHONE),
  verifyEmail: getValidationSet(FieldDefinitions.VERIFY_EMAIL),
  resendVerification: getValidationSet(FieldDefinitions.RESEND_VERIFICATION)
};

module.exports = {
  validationSets
};*/

const validationSets = {
  // Admin Management
  createAdmin: {
    'adminType': validationRules.adminType,
    'reason': validationRules.adminCreationReason
  },

  fetchAdminDetails: {
    'reason': validationRules.fetchAdminDetailsReason
  },

  fetchUserDetails: {
    'reason': validationRules.fetchUserDetailsReason
  },

  updateAdminDetails: {
    'reason': validationRules.updateAdminDetailsReason
  },
  
  updateAdminRole: {
    'newRole': validationRules.adminType,
    'reason': validationRules.adminUpdateRoleReason
  },

  // Admin Status Operations
  activateAdmin: {
    'reason': validationRules.activationReason
  },
  
  deactivateAdmin: {
    'reason': validationRules.deactivationReason
  },
  
  approveActivationRequest: {
    'reviewNotes': validationRules.notes
  },
  
  rejectActivationRequest: {
    'reviewNotes': validationRules.notes
  },
  
  approveDeactivationRequest: {
    'reviewNotes': validationRules.notes
  },
  
  rejectDeactivationRequest: {
    'reviewNotes': validationRules.notes
  },
  
  createActivationRequest: {
    'reason': validationRules.activationReason,
    'notes': validationRules.notes
  },
  
  createDeactivationRequest: {
    'reason': validationRules.deactivationReason,
    'notes': validationRules.notes
  },
  
  // Supervisor Management
  changeSupervisor: {
    'newSupervisorId': validationRules.adminId,
    'reason': validationRules.changeSupervisorReason
  },
  
  // User Operations
  blockUser: {
    'reason': validationRules.blockReason,
    'reasonDetails': validationRules.notes
  },
  
  unblockUser: {
    'reason': validationRules.unblockReason,
    'reasonDetails': validationRules.notes
  },
  
  provideUserAccountDetails: {
    'reason': validationRules.userAccountDetailsReason
  },
  
  getUserActiveDevices: {
    'reason': validationRules.userActiveDevicesReason
  },
  
  // Auth Logs Operations
  checkAuthLogs: {
    'reason': validationRules.authLogCheckReason
  },

  viewAdminActivityTracker: {
    'reason': validationRules.activityTrackerReason
  },

  blockDevice: {
    'reason': validationRules.blockDeviceReason,
    'reasonDetails': validationRules.notes
  },

  unblockDevice: {
    'reason': validationRules.unblockDeviceReason,
    'reasonDetails': validationRules.notes
  },

  fetchDeviceDetails: {
    'reason': validationRules.fetchDeviceDetailsReason
  }
};

module.exports = {
  validationSets
};
