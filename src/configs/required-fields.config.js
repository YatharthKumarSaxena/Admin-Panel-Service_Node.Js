/**
 * REQUIRED FIELDS CONFIG (Auto-Generated)
 * 
 * DO NOT MANUALLY EDIT THIS FILE!
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

/*
const signUpField = getRequiredFields(FieldDefinitions.SIGN_UP);
const signInField = getRequiredFields(FieldDefinitions.SIGN_IN);
const activateAccount = getRequiredFields(FieldDefinitions.ACTIVATE_ACCOUNT);
const deactivateAccount = getRequiredFields(FieldDefinitions.DEACTIVATE_ACCOUNT);
const handle2FA = getRequiredFields(FieldDefinitions.HANDLE_2FA);
const changePassword = getRequiredFields(FieldDefinitions.CHANGE_PASSWORD);
const resetPassword = getRequiredFields(FieldDefinitions.RESET_PASSWORD);
const verifyEmail = getRequiredFields(FieldDefinitions.VERIFY_EMAIL);
const verifyPhone = getRequiredFields(FieldDefinitions.VERIFY_PHONE);
const resendVerification = getRequiredFields(FieldDefinitions.RESEND_VERIFICATION);

module.exports = {
    signUpField,
    signInField,
    activateAccount,
    deactivateAccount,
    handle2FA,
    changePassword,
    resetPassword,
    verifyEmail,
    verifyPhone,
    resendVerification
};
*/

const adminCreationRequiredFields = [
  "adminType",
  "reason"
];
const adminCreationInBulkRequiredFields = [
  "adminType"
];

const updateAdminDetailsRequiredFields = ["reason"];
const activateAdminRequiredFields = ["reason"];
const deactivateAdminRequiredFields = ["reason"];
const approveActivationRequestRequiredFields = ["reviewNotes"];
const rejectActivationRequestRequiredFields = ["reviewNotes"];
const approveDeactivationRequestRequiredFields = ["reviewNotes"];
const rejectDeactivationRequestRequiredFields = ["reviewNotes"];
const createActivationRequestRequiredFields = ["reason", "notes"];
const createDeactivationRequestRequiredFields = ["reason", "notes"];
const changeSupervisorRequiredFields = ["newSupervisorId", "reason"];
const blockUserRequiredFields = ["reason", "reasonDetails"];
const unblockUserRequiredFields = ["reason", "reasonDetails"];
const provideUserAccountDetailsRequiredFields = ["reason"];
const getUserActiveDevicesRequiredFields = ["reason"];
const checkAuthLogsRequiredFields = ["reason"];
const viewAdminActivityTrackerRequiredFields = ["reason"];
const blockDeviceRequiredFields = ["reason", "reasonDetails"];
const unblockDeviceRequiredFields = ["reason", "reasonDetails"];
const updateAdminRoleRequiredFields = ["newRole", "reason"];
const fetchAdminDetailsRequiredFields = ["reason"];
const fetchUserDetailsRequiredFields = ["reason"];
const fetchDeviceDetailsRequiredFields = ["reason"];

module.exports = {
  adminCreationRequiredFields,
  adminCreationInBulkRequiredFields,
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
  fetchUserDetailsRequiredFields,
  fetchDeviceDetailsRequiredFields
};