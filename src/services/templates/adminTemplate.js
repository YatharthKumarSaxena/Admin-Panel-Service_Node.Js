const { defaultConfig } = require("./defaultTemplate");

/**
 * 🎯 Admin Panel Email Templates
 * Config-based templates for all admin events
 */
const adminTemplate = {
  // 🔹 Admin Account Creation
  adminCreated: {
    ...defaultConfig,
    subject: "🎉 Welcome to Admin Panel",
    event_name: "Admin Account Created",
    action: "Account Creation",
    status: "Activated",
    message_intro: "Your admin account has been successfully created! Welcome to our platform.",
    actionbutton_text: "Access Admin Panel",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "You can now access the admin panel and start managing the platform.\n\nNext Steps:\n• Log in to the admin panel\n• Complete your profile\n• Familiarize yourself with the dashboard",
    details: {} // Will be populated: Admin ID, Role, Email, Created By, Created At
  },

  // 🔹 Admin Account Activation
  adminActivated: {
    ...defaultConfig,
    subject: "✅ Your Account Has Been Activated",
    event_name: "Account Activation",
    action: "Account Activated",
    status: "Activated",
    message_intro: "Good news! Your admin account has been activated.",
    actionbutton_text: "Login Now",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "You can now log in and access all admin panel features.",
    details: {} // Admin ID, Role, Activated By, Activated At
  },

  // 🔹 Admin Account Deactivation
  adminDeactivated: {
    ...defaultConfig,
    subject: "❌ Your Account Has Been Deactivated",
    event_name: "Account Deactivation",
    action: "Account Deactivated",
    status: "Deactivated",
    message_intro: "This is to inform you that your admin account has been deactivated.",
    notes: "You will no longer be able to access the admin panel.\n\nIf you believe this is a mistake, please contact your supervisor.",
    details: {} // Admin ID, Role, Deactivated By, Deactivated At, Reason
  },

  // 🔹 Admin Role Change
  adminRoleChanged: {
    ...defaultConfig,
    subject: "🔄 Your Role Has Been Updated",
    event_name: "Role Update",
    action: "Role Changed",
    status: "Success",
    message_intro: "Your admin role has been updated in the system.",
    actionbutton_text: "View Dashboard",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "Your access permissions and responsibilities have been updated according to your new role.\n\nPlease log in to see your updated dashboard and permissions.",
    details: {} // Admin ID, Previous Role, New Role, Changed By, Changed At
  },

  // 🔹 Admin Details Updated
  adminDetailsUpdated: {
    ...defaultConfig,
    subject: "📝 Your Account Details Have Been Updated",
    event_name: "Account Details Update",
    action: "Details Updated",
    status: "Success",
    message_intro: "Your admin account details have been updated.",
    notes: "If you did not make these changes, please contact your supervisor immediately for security purposes.",
    details: {} // Admin ID, Updated Fields, Updated By, Updated At
  },

  // 🔹 Role Change Request Submitted
  roleChangeRequested: {
    ...defaultConfig,
    subject: "📋 Role Change Request Submitted",
    event_name: "Role Change Request",
    action: "Request Submitted",
    status: "Submitted",
    message_intro: "A role change request has been submitted for review.",
    actionbutton_text: "View Request",
    actionlink: "<REQUEST_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<REQUEST_LINK>",
    notes: "Your request is pending approval from a higher authority.\n\nYou will be notified once a decision is made.",
    details: {} // Request ID, Target Admin, Current Role, Requested Role, Submitted By
  },

  // 🔹 Role Change Request Approved
  roleChangeApproved: {
    ...defaultConfig,
    subject: "✅ Role Change Request Approved",
    event_name: "Role Change Approved",
    action: "Request Approved",
    status: "Approved",
    message_intro: "Your role change request has been approved.",
    actionbutton_text: "View Dashboard",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "Your new role and permissions are now active.",
    details: {} // Request ID, Admin ID, Old Role, New Role, Approved By, Approved At
  },

  // 🔹 Role Change Request Rejected
  roleChangeRejected: {
    ...defaultConfig,
    subject: "❌ Role Change Request Rejected",
    event_name: "Role Change Rejected",
    action: "Request Rejected",
    status: "Rejected",
    message_intro: "Your role change request has been rejected.",
    notes: "Please contact your supervisor if you have questions about this decision.",
    details: {} // Request ID, Admin ID, Current Role, Requested Role, Rejected By, Rejection Reason
  },

  // 🔹 Bulk Admin Creation Summary
  bulkAdminCreated: {
    ...defaultConfig,
    subject: "📊 Bulk Admin Creation Summary",
    event_name: "Bulk Admin Creation",
    action: "Bulk Operation Completed",
    status: "Success",
    message_intro: "Your bulk admin creation operation has been completed.",
    actionbutton_text: "View Admin List",
    actionlink: "<ADMIN_LIST_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_LIST_LINK>",
    details: {} // Total Processed, Created Count, Failed Count, Invalid Count
  },

  // 🔹 Password Reset Request
  passwordResetRequested: {
    ...defaultConfig,
    subject: "🔐 Password Reset Request",
    event_name: "Password Reset",
    action: "Reset Password",
    message_intro: "A password reset has been requested for your account.",
    actionbutton_text: "Reset Password",
    actionlink: "<RESET_LINK>",
    action_cta: "Click the button below to reset your password:",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<RESET_LINK>",
    notes: "This link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.",
    details: {} // Admin ID, Requested At
  }
};

module.exports = {
  adminTemplate
};
