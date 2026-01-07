const { validationRules } = require("./validation.config");

/**
 * Validation Sets Configuration
 * Maps controller names to their validation rules
 * Each field maps to a validationRule object with enum/regex/length checks
 */

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
    'deviceId': validationRules.deviceId,
    'reason': validationRules.blockDeviceReason,
    'reasonDetails': validationRules.notes
  },

  unblockDevice: {
    'deviceId': validationRules.deviceId,
    'reason': validationRules.unblockDeviceReason,
    'reasonDetails': validationRules.notes
  }
};

module.exports = {
  validationSets
};
