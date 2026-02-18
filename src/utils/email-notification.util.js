const { sendEmail } = require("@/services/common/mail.service");
const { adminTemplate } = require("@services/templates");

/**
 * 📧 Email Notification Utilities
 * Business logic for sending specific email types
 */

/**
 * ✅ Send Account Activated Email
 */
const sendActivationEmail = (email, adminId, adminType, activatedBy) => {
  if (!email) return;

  const config = {
    ...adminTemplate.adminActivated,
    user_name: adminType,
    details: {
      'Admin ID': adminId,
      'Role': adminType,
      'Activated By': activatedBy,
      'Activated At': new Date().toLocaleString()
    }
  };

  config.actionlink = config.actionlink.replace('<ADMIN_PANEL_LINK>', process.env.ADMIN_PANEL_LINK || '#');
  config.action_link = config.action_link.replace('<ADMIN_PANEL_LINK>', process.env.ADMIN_PANEL_LINK || '#');

  sendEmail(email, config);
};

/**
 * ❌ Send Account Deactivated Email
 */
const sendDeactivationEmail = (email, adminId, adminType, deactivatedBy, reason) => {
  if (!email) return;

  const detailsObj = {
    'Admin ID': adminId,
    'Role': adminType,
    'Deactivated By': deactivatedBy,
    'Deactivated At': new Date().toLocaleString()
  };

  if (reason) {
    detailsObj['Reason'] = reason;
  }

  const config = {
    ...adminTemplate.adminDeactivated,
    user_name: adminType,
    details: detailsObj
  };

  sendEmail(email, config);
};

/**
 * 📝 Send Details Updated Email
 */
const sendDetailsUpdatedEmail = (email, adminId, adminType, updatedFields, updatedBy) => {
  if (!email) return;

  const fieldsString = updatedFields.join(', ');

  const config = {
    ...adminTemplate.adminDetailsUpdated,
    user_name: adminType,
    details: {
      'Admin ID': adminId,
      'Updated Fields': fieldsString,
      'Updated By': updatedBy || adminId,
      'Updated At': new Date().toLocaleString()
    }
  };

  sendEmail(email, config);
};

/**
 * 🚫 Send Account Blocked Email
 */
const sendAccountBlockedEmail = (email, adminId, adminType, blockedBy, reason) => {
  if (!email) return;

  const detailsObj = {
    'Admin ID': adminId,
    'Role': adminType,
    'Blocked By': blockedBy,
    'Blocked At': new Date().toLocaleString()
  };

  if (reason) {
    detailsObj['Reason'] = reason;
  }

  const config = {
    ...adminTemplate.adminBlocked,
    user_name: adminType,
    details: detailsObj
  };

  sendEmail(email, config);
};

/**
 * 🔓 Send Account Unblocked Email
 */
const sendAccountUnblockedEmail = (email, adminId, adminType, unblockedBy) => {
  if (!email) return;

  const config = {
    ...adminTemplate.adminUnblocked,
    user_name: adminType,
    details: {
      'Admin ID': adminId,
      'Role': adminType,
      'Unblocked By': unblockedBy,
      'Unblocked At': new Date().toLocaleString()
    }
  };

  config.actionlink = config.actionlink.replace('<ADMIN_PANEL_LINK>', process.env.ADMIN_PANEL_LINK || '#');
  config.action_link = config.action_link.replace('<ADMIN_PANEL_LINK>', process.env.ADMIN_PANEL_LINK || '#');

  sendEmail(email, config);
};

module.exports = {
  sendActivationEmail,
  sendDeactivationEmail,
  sendDetailsUpdatedEmail,
  sendAccountBlockedEmail,
  sendAccountUnblockedEmail
};
