const { sendSMS } = require("@services/sms.service");
const { smsTemplate } = require("@services/templates/smsTemplate");

/**
 * 📱 SMS Notification Utilities
 * High-level functions for sending specific SMS notifications
 */

// ============= ADMIN SMS NOTIFICATIONS =============


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
  sendAdminActivatedSMS,
  sendAdminDeactivatedSMS,
  sendDetailsUpdatedSMS,

  // User SMS
  sendUserBlockedSMS,
  sendUserUnblockedSMS
};
