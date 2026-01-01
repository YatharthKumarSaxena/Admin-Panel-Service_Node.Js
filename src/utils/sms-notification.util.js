const { sendSMS } = require("@services/sms.service");
const { smsTemplate } = require("@services/templates/smsTemplate");

/**
 * 📱 SMS Notification Utilities
 * High-level functions for sending specific SMS notifications
 */

// ============= ADMIN SMS NOTIFICATIONS =============

/**
 * Send Admin Created SMS
 */
const sendAdminCreatedSMS = async (admin, createdBy) => {
  if (!admin.fullPhoneNumber) {
    console.log("⚠️ Admin has no phone number, skipping SMS");
    return { success: false, reason: "No phone number" };
  }

  const adminName = admin.fullName || admin.firstName || "Admin";
  const role = admin.role?.name || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.adminCreated(adminName, role)
  });
};

/**
 * Send Admin Activated SMS
 */
const sendAdminActivatedSMS = async (admin) => {
  if (!admin.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const adminName = admin.fullName || admin.firstName || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.adminActivated(adminName)
  });
};

/**
 * Send Admin Deactivated SMS
 */
const sendAdminDeactivatedSMS = async (admin) => {
  if (!admin.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const adminName = admin.fullName || admin.firstName || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.adminDeactivated(adminName)
  });
};

/**
 * Send Role Changed SMS
 */
const sendRoleChangedSMS = async (admin, oldRole, newRole) => {
  if (!admin.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const adminName = admin.fullName || admin.firstName || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.roleChanged(adminName, oldRole, newRole)
  });
};

/**
 * Send Details Updated SMS
 */
const sendDetailsUpdatedSMS = async (admin) => {
  if (!admin.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const adminName = admin.fullName || admin.firstName || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.detailsUpdated(adminName)
  });
};

/**
 * Send Admin Blocked SMS
 */
const sendAdminBlockedSMS = async (admin) => {
  if (!admin.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const adminName = admin.fullName || admin.firstName || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.adminBlocked(adminName)
  });
};

/**
 * Send Admin Unblocked SMS
 */
const sendAdminUnblockedSMS = async (admin) => {
  if (!admin.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const adminName = admin.fullName || admin.firstName || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.adminUnblocked(adminName)
  });
};

/**
 * Send Role Change Requested SMS
 */
const sendRoleChangeRequestedSMS = async (admin, currentRole, requestedRole) => {
  if (!admin.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const adminName = admin.fullName || admin.firstName || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.roleChangeRequested(adminName, currentRole, requestedRole)
  });
};

/**
 * Send Role Change Approved SMS
 */
const sendRoleChangeApprovedSMS = async (admin, newRole) => {
  if (!admin.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const adminName = admin.fullName || admin.firstName || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.roleChangeApproved(adminName, newRole)
  });
};

/**
 * Send Role Change Rejected SMS
 */
const sendRoleChangeRejectedSMS = async (admin, requestedRole) => {
  if (!admin.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const adminName = admin.fullName || admin.firstName || "Admin";

  return await sendSMS(admin.fullPhoneNumber, {
    message: smsTemplate.roleChangeRejected(adminName, requestedRole)
  });
};

// ============= USER SMS NOTIFICATIONS =============

/**
 * Send User Created SMS
 */
const sendUserCreatedSMS = async (user) => {
  if (!user.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const userName = user.fullName || user.firstName || "User";

  return await sendSMS(user.fullPhoneNumber, {
    message: smsTemplate.userCreated(userName)
  });
};

/**
 * Send User Activated SMS
 */
const sendUserActivatedSMS = async (user) => {
  if (!user.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const userName = user.fullName || user.firstName || "User";

  return await sendSMS(user.fullPhoneNumber, {
    message: smsTemplate.userActivated(userName)
  });
};

/**
 * Send User Deactivated SMS
 */
const sendUserDeactivatedSMS = async (user) => {
  if (!user.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const userName = user.fullName || user.firstName || "User";

  return await sendSMS(user.fullPhoneNumber, {
    message: smsTemplate.userDeactivated(userName)
  });
};

/**
 * Send User Blocked SMS
 */
const sendUserBlockedSMS = async (user) => {
  if (!user.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const userName = user.fullName || user.firstName || "User";

  return await sendSMS(user.fullPhoneNumber, {
    message: smsTemplate.userBlocked(userName)
  });
};

/**
 * Send User Unblocked SMS
 */
const sendUserUnblockedSMS = async (user) => {
  if (!user.fullPhoneNumber) return { success: false, reason: "No phone number" };

  const userName = user.fullName || user.firstName || "User";

  return await sendSMS(user.fullPhoneNumber, {
    message: smsTemplate.userUnblocked(userName)
  });
};

module.exports = {
  // Admin SMS
  sendAdminCreatedSMS,
  sendAdminActivatedSMS,
  sendAdminDeactivatedSMS,
  sendRoleChangedSMS,
  sendDetailsUpdatedSMS,
  sendAdminBlockedSMS,
  sendAdminUnblockedSMS,
  sendRoleChangeRequestedSMS,
  sendRoleChangeApprovedSMS,
  sendRoleChangeRejectedSMS,
  
  // User SMS
  sendUserCreatedSMS,
  sendUserActivatedSMS,
  sendUserDeactivatedSMS,
  sendUserBlockedSMS,
  sendUserUnblockedSMS
};
