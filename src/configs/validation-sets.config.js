/**
 * VALIDATION SETS CONFIG (Auto-Generated from Field Definitions)
 * 
 * These validation sets are automatically derived from:
 * @see field-definitions.config.js (Single Source of Truth)
 * 
 * To add/remove/modify validation rules:
 * → Edit FieldDefinitions in field-definitions.config.js
 * → Changes will automatically reflect here
 */

const { FieldDefinitions, getValidationSet } = require("./field-definitions.config");

// AUTO-GENERATED VALIDATION SETS

const validationSets = {
  // Admin Management
  createAdmin: getValidationSet(FieldDefinitions.CREATE_ADMIN),
  fetchAdminDetails: getValidationSet(FieldDefinitions.FETCH_ADMIN_DETAILS),
  fetchUserDetails: getValidationSet(FieldDefinitions.FETCH_USER_DETAILS),
  updateAdminDetails: getValidationSet(FieldDefinitions.UPDATE_ADMIN_DETAILS),
  updateAdminRole: getValidationSet(FieldDefinitions.UPDATE_ADMIN_ROLE),
  
  // Admin Status Operations
  activateAdmin: getValidationSet(FieldDefinitions.ACTIVATE_ADMIN),
  deactivateAdmin: getValidationSet(FieldDefinitions.DEACTIVATE_ADMIN),
  changeSupervisor: getValidationSet(FieldDefinitions.CHANGE_SUPERVISOR),
  
  // Request Operations
  approveActivationRequest: getValidationSet(FieldDefinitions.APPROVE_ACTIVATION_REQUEST),
  rejectActivationRequest: getValidationSet(FieldDefinitions.REJECT_ACTIVATION_REQUEST),
  approveDeactivationRequest: getValidationSet(FieldDefinitions.APPROVE_DEACTIVATION_REQUEST),
  rejectDeactivationRequest: getValidationSet(FieldDefinitions.REJECT_DEACTIVATION_REQUEST),
  createActivationRequest: getValidationSet(FieldDefinitions.CREATE_ACTIVATION_REQUEST),
  createDeactivationRequest: getValidationSet(FieldDefinitions.CREATE_DEACTIVATION_REQUEST),
  
  // User Operations
  blockUser: getValidationSet(FieldDefinitions.BLOCK_USER),
  unblockUser: getValidationSet(FieldDefinitions.UNBLOCK_USER),
  
  // Device Operations
  blockDevice: getValidationSet(FieldDefinitions.BLOCK_DEVICE),
  unblockDevice: getValidationSet(FieldDefinitions.UNBLOCK_DEVICE),
  fetchDeviceDetails: getValidationSet(FieldDefinitions.FETCH_DEVICE_DETAILS),
  
  // Internal Operations
  provideUserAccountDetails: getValidationSet(FieldDefinitions.PROVIDE_USER_ACCOUNT_DETAILS),
  getUserActiveDevices: getValidationSet(FieldDefinitions.GET_USER_ACTIVE_DEVICES),
  checkAuthLogs: getValidationSet(FieldDefinitions.CHECK_AUTH_LOGS),
  
  // Activity Tracker
  viewAdminActivityTracker: getValidationSet(FieldDefinitions.VIEW_ADMIN_ACTIVITY_TRACKER)
};

module.exports = {
  validationSets
};
