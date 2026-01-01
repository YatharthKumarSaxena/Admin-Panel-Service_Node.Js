const { sendEmail } = require("@services/mail.service");
const { adminTemplate } = require("@services/templates");

/**
 * 📧 Email Notification Utilities
 * Business logic for sending specific email types
 */

/**
 * 📬 Send Welcome Email (Admin Created)
 */

const sendWelcomeEmail = (email, adminId, adminType, createdBy) => {
  if (!email) return;

  const config = {
    ...adminTemplate.adminCreated,
    user_name: adminType,
    details: {
      'Admin ID': adminId,
      'Role': adminType,
      'Email': email,
      'Created By': createdBy,
      'Created At': new Date().toLocaleString()
    }
  };

  // Replace placeholders
  config.actionlink = config.actionlink.replace('<ADMIN_PANEL_LINK>', process.env.ADMIN_PANEL_LINK || '#');
  config.action_link = config.action_link.replace('<ADMIN_PANEL_LINK>', process.env.ADMIN_PANEL_LINK || '#');

  sendEmail(email, config);
};

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
 * 🔄 Send Role Changed Email
 */
const sendRoleChangeEmail = (email, adminId, oldRole, newRole, changedBy) => {
  if (!email) return;

  const config = {
    ...adminTemplate.adminRoleChanged,
    user_name: newRole,
    action: `Role Changed: ${oldRole} → ${newRole}`,
    details: {
      'Admin ID': adminId,
      'Previous Role': oldRole,
      'New Role': newRole,
      'Changed By': changedBy,
      'Changed At': new Date().toLocaleString()
    }
  };

  config.actionlink = config.actionlink.replace('<ADMIN_PANEL_LINK>', process.env.ADMIN_PANEL_LINK || '#');
  config.action_link = config.action_link.replace('<ADMIN_PANEL_LINK>', process.env.ADMIN_PANEL_LINK || '#');

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

/**
 * 📋 Send Role Change Request Email
 */
const sendRoleChangeRequestEmail = (email, requestId, targetAdminId, currentRole, requestedRole, submittedBy) => {
  if (!email) return;

  const config = {
    ...adminTemplate.roleChangeRequested,
    user_name: currentRole,
    details: {
      'Request ID': requestId,
      'Target Admin': targetAdminId,
      'Current Role': currentRole,
      'Requested Role': requestedRole,
      'Submitted By': submittedBy,
      'Submitted At': new Date().toLocaleString()
    }
  };

  // Replace REQUEST_LINK placeholder
  const requestLink = `${process.env.ADMIN_PANEL_LINK}/requests/${requestId}` || '#';
  config.actionlink = config.actionlink.replace('<REQUEST_LINK>', requestLink);
  config.action_link = config.action_link.replace('<REQUEST_LINK>', requestLink);

  sendEmail(email, config);
};

module.exports = {
  sendWelcomeEmail,
  sendActivationEmail,
  sendDeactivationEmail,
  sendRoleChangeEmail,
  sendDetailsUpdatedEmail,
  sendAccountBlockedEmail,
  sendAccountUnblockedEmail,
  sendRoleChangeRequestEmail,
};
