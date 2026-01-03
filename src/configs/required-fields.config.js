const adminCreationRequiredFields = [
  "adminType"  // authModeValidator handles email/phone
];

const adminCreationInBulkRequiredFields = [
  ...getAuthFields(),
  "adminType"
];

// ========================================
// 🔹 Admin Status Operation Fields
// ========================================
const activateAdminRequiredFields = ["reason"];   // WHY activating?
const deactivateAdminRequiredFields = ["reason"]; // WHY deactivating?
const blockAdminRequiredFields = ["reason"];      // WHY blocking?
const unblockAdminRequiredFields = ["reason"];    // WHY unblocking?
const changeSupervisorRequiredFields = ["newSupervisorId", "reason"]; // Change supervisor

// ========================================
// 🔹 User Status Operation Fields
// ========================================
const blockUserRequiredFields = ["reason"];
const unblockUserRequiredFields = ["reason"];
const blockDeviceRequiredFields = ["reason"];
const unblockDeviceRequiredFields = ["reason"];

module.exports = {
  adminCreationRequiredFields,
  adminCreationInBulkRequiredFields,
  activateAdminRequiredFields,
  deactivateAdminRequiredFields,
  blockAdminRequiredFields,
  unblockAdminRequiredFields,
  changeSupervisorRequiredFields,
  blockUserRequiredFields,
  unblockUserRequiredFields,
  blockDeviceRequiredFields,
  unblockDeviceRequiredFields
};
