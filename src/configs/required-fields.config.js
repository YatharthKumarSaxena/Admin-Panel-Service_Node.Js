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