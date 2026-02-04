/**
 * REQUIRED FIELDS CONFIG (Auto-Generated from Field Definitions)
 * 
 * These arrays are automatically derived from:
 * @see field-definitions.config.js (Single Source of Truth)
 * 
 * To add/remove/modify required fields:
 * → Edit FieldDefinitions in field-definitions.config.js
 * → Changes will automatically reflect here
 */

const { FieldDefinitions, getRequiredFields } = require("./field-definitions.config");

// AUTO-GENERATED REQUIRED FIELDS

const adminCreationRequiredFields = getRequiredFields(FieldDefinitions.CREATE_ADMIN);
const updateAdminDetailsRequiredFields = getRequiredFields(FieldDefinitions.UPDATE_ADMIN_DETAILS);
const activateAdminRequiredFields = getRequiredFields(FieldDefinitions.ACTIVATE_ADMIN);
const deactivateAdminRequiredFields = getRequiredFields(FieldDefinitions.DEACTIVATE_ADMIN);
const approveActivationRequestRequiredFields = getRequiredFields(FieldDefinitions.APPROVE_ACTIVATION_REQUEST);
const rejectActivationRequestRequiredFields = getRequiredFields(FieldDefinitions.REJECT_ACTIVATION_REQUEST);
const approveDeactivationRequestRequiredFields = getRequiredFields(FieldDefinitions.APPROVE_DEACTIVATION_REQUEST);
const rejectDeactivationRequestRequiredFields = getRequiredFields(FieldDefinitions.REJECT_DEACTIVATION_REQUEST);
const createActivationRequestRequiredFields = getRequiredFields(FieldDefinitions.CREATE_ACTIVATION_REQUEST);
const createDeactivationRequestRequiredFields = getRequiredFields(FieldDefinitions.CREATE_DEACTIVATION_REQUEST);
const changeSupervisorRequiredFields = getRequiredFields(FieldDefinitions.CHANGE_SUPERVISOR);
const blockUserRequiredFields = getRequiredFields(FieldDefinitions.BLOCK_USER);
const unblockUserRequiredFields = getRequiredFields(FieldDefinitions.UNBLOCK_USER);
const provideUserAccountDetailsRequiredFields = getRequiredFields(FieldDefinitions.PROVIDE_USER_ACCOUNT_DETAILS);
const getUserActiveDevicesRequiredFields = getRequiredFields(FieldDefinitions.GET_USER_ACTIVE_DEVICES);
const checkAuthLogsRequiredFields = getRequiredFields(FieldDefinitions.CHECK_AUTH_LOGS);
const viewAdminActivityTrackerRequiredFields = getRequiredFields(FieldDefinitions.VIEW_ADMIN_ACTIVITY_TRACKER);
const blockDeviceRequiredFields = getRequiredFields(FieldDefinitions.BLOCK_DEVICE);
const unblockDeviceRequiredFields = getRequiredFields(FieldDefinitions.UNBLOCK_DEVICE);
const updateAdminRoleRequiredFields = getRequiredFields(FieldDefinitions.UPDATE_ADMIN_ROLE);
const fetchAdminDetailsRequiredFields = getRequiredFields(FieldDefinitions.FETCH_ADMIN_DETAILS);
const fetchUserBlockDetailsRequiredFields = getRequiredFields(FieldDefinitions.FETCH_USER_BLOCK_DETAILS);
const fetchDeviceDetailsRequiredFields = getRequiredFields(FieldDefinitions.FETCH_DEVICE_DETAILS);

module.exports = {
  adminCreationRequiredFields,
  updateAdminDetailsRequiredFields,
  activateAdminRequiredFields,
  deactivateAdminRequiredFields,
  approveActivationRequestRequiredFields,
  rejectActivationRequestRequiredFields,
  approveDeactivationRequestRequiredFields,
  rejectDeactivationRequestRequiredFields,
  createActivationRequestRequiredFields,
  createDeactivationRequestRequiredFields,
  changeSupervisorRequiredFields,
  blockUserRequiredFields,
  unblockUserRequiredFields,
  provideUserAccountDetailsRequiredFields,
  getUserActiveDevicesRequiredFields,
  checkAuthLogsRequiredFields,
  viewAdminActivityTrackerRequiredFields,
  blockDeviceRequiredFields,
  unblockDeviceRequiredFields,
  updateAdminRoleRequiredFields,
  fetchAdminDetailsRequiredFields,
  fetchUserBlockDetailsRequiredFields,
  fetchDeviceDetailsRequiredFields
};