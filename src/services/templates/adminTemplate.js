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

  supervisorOnAdminCreationNotification: {
    ...defaultConfig,
    subject: "👤 New Admin Created by Your Team Member",
    event_name: "New Admin Added",
    action: "Admin Created",
    status: "Success",
    message_intro: "A new admin has been created by one of your team members.",
    notes: "Please review the new admin details and provide guidance if needed.",
    details: {}, // Admin ID, Role, Email, Created By, Created At
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
  },

  // ========== NEW TEMPLATES FOR NOTIFICATIONS ==========

  // 🔹 Supervisor Notification - New Admin Created
  supervisorNewAdminNotification: {
    ...defaultConfig,
    subject: "👤 New Admin Added to Your Team",
    event_name: "New Team Member",
    action: "Admin Created",
    status: "Success",
    message_intro: "A new admin has been added to your team.",
    actionbutton_text: "View Team",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "You are assigned as the supervisor for this admin.\n\nPlease reach out to them for onboarding and support.",
    details: {} // Admin ID, Role, Email/Phone, Created By, Created At
  },

  // 🔹 Activation Request Submitted
  activationRequestSubmitted: {
    ...defaultConfig,
    subject: "📋 Activation Request Submitted",
    event_name: "Activation Request",
    action: "Request Submitted",
    status: "Pending",
    message_intro: "Your activation request has been submitted successfully.",
    notes: "Your request is pending approval from your supervisor or higher authority.\n\nYou will be notified once a decision is made.",
    details: {} // Request ID, Admin ID, Role, Submitted At
  },

  // 🔹 Activation Request Pending (Target Admin)
  activationRequestPending: {
    ...defaultConfig,
    subject: "⏳ Activation Request Pending for Your Account",
    event_name: "Activation Pending",
    action: "Request Pending",
    status: "Pending",
    message_intro: "An activation request has been submitted for your account.",
    notes: "Your account activation is pending approval.\n\nYou will be notified once the request is reviewed.",
    details: {} // Admin ID, Role, Requested By, Submitted At
  },

  // 🔹 Activation Request Review (Supervisor)
  activationRequestReview: {
    ...defaultConfig,
    subject: "🔍 Activation Request Requires Your Review",
    event_name: "Review Required",
    action: "Activation Request",
    status: "Pending Review",
    message_intro: "An activation request requires your review and approval.",
    actionbutton_text: "Review Request",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "Please review the request and take appropriate action.",
    details: {} // Request ID, Admin ID, Role, Requested By, Submitted At
  },

  // 🔹 Deactivation Request Submitted
  deactivationRequestSubmitted: {
    ...defaultConfig,
    subject: "📋 Deactivation Request Submitted",
    event_name: "Deactivation Request",
    action: "Request Submitted",
    status: "Pending",
    message_intro: "Your deactivation request has been submitted successfully.",
    notes: "Your request is pending approval from your supervisor or higher authority.\n\nYou will be notified once a decision is made.",
    details: {} // Request ID, Admin ID, Role, Reason, Submitted At
  },

  // 🔹 Deactivation Request Review (Supervisor)
  deactivationRequestReview: {
    ...defaultConfig,
    subject: "🔍 Deactivation Request Requires Your Review",
    event_name: "Review Required",
    action: "Deactivation Request",
    status: "Pending Review",
    message_intro: "A deactivation request requires your review and approval.",
    actionbutton_text: "Review Request",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "Please review the request and take appropriate action.",
    details: {} // Request ID, Admin ID, Role, Requested By, Reason, Submitted At
  },

  // 🔹 Activation Confirmation (Actor)
  activationConfirmation: {
    ...defaultConfig,
    subject: "✅ Admin Activation Confirmed",
    event_name: "Activation Completed",
    action: "Admin Activated",
    status: "Success",
    message_intro: "You have successfully activated an admin account.",
    actionbutton_text: "View Admin",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "The admin can now access the system with full permissions.",
    details: {} // Admin ID, Role, Activated At
  },

  // 🔹 Activation Notification to Supervisor
  activationNotificationSupervisor: {
    ...defaultConfig,
    subject: "ℹ️ Team Member Account Activated",
    event_name: "Team Member Activated",
    action: "Account Activated",
    status: "Success",
    message_intro: "One of your team member's account has been activated.",
    actionbutton_text: "View Team",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "The admin now has full access to the system.",
    details: {} // Admin ID, Role, Activated By, Activated At
  },

  // 🔹 Deactivation Confirmation (Actor)
  deactivationConfirmation: {
    ...defaultConfig,
    subject: "❌ Admin Deactivation Confirmed",
    event_name: "Deactivation Completed",
    action: "Admin Deactivated",
    status: "Success",
    message_intro: "You have successfully deactivated an admin account.",
    notes: "The admin can no longer access the system.",
    details: {} // Admin ID, Role, Deactivated At, Reason
  },

  // 🔹 Deactivation Notification to Supervisor
  deactivationNotificationSupervisor: {
    ...defaultConfig,
    subject: "ℹ️ Team Member Account Deactivated",
    event_name: "Team Member Deactivated",
    action: "Account Deactivated",
    status: "Deactivated",
    message_intro: "One of your team member's account has been deactivated.",
    notes: "The admin can no longer access the system.",
    details: {} // Admin ID, Role, Deactivated By, Deactivated At, Reason
  },

  // 🔹 Details Update Confirmation (Actor)
  detailsUpdateConfirmation: {
    ...defaultConfig,
    subject: "✅ Admin Details Update Confirmed",
    event_name: "Update Completed",
    action: "Details Updated",
    status: "Success",
    message_intro: "You have successfully updated an admin's details.",
    actionbutton_text: "View Admin",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "The changes have been applied to the admin's account.",
    details: {} // Admin ID, Updated Fields, Updated At
  },

  // 🔹 Details Update Notification to Supervisor
  detailsUpdateNotificationSupervisor: {
    ...defaultConfig,
    subject: "ℹ️ Team Member Details Updated",
    event_name: "Team Member Updated",
    action: "Details Updated",
    status: "Success",
    message_intro: "One of your team member's account details have been updated.",
    actionbutton_text: "View Team",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "Please review the changes if needed.",
    details: {} // Admin ID, Updated Fields, Updated By, Updated At
  },

  // 🔹 Activation Request Approved (Requester)
  activationRequestApproved: {
    ...defaultConfig,
    subject: "✅ Your Activation Request Has Been Approved",
    event_name: "Request Approved",
    action: "Activation Approved",
    status: "Approved",
    message_intro: "Great news! Your activation request has been approved.",
    actionbutton_text: "View Status",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "The admin account is now active and has full access.",
    details: {} // Request ID, Admin ID, Approved By, Approved At
  },

  // 🔹 Activation Approval Confirmation (Approver)
  activationApprovalConfirmation: {
    ...defaultConfig,
    subject: "✅ Activation Request Approved Successfully",
    event_name: "Approval Confirmed",
    action: "Request Approved",
    status: "Success",
    message_intro: "You have successfully approved an activation request.",
    notes: "The admin account is now active.",
    details: {} // Request ID, Admin ID, Approved At
  },

  // 🔹 Activation Approved Notification to Supervisor
  activationApprovedNotificationSupervisor: {
    ...defaultConfig,
    subject: "ℹ️ Activation Request Approved for Team Member",
    event_name: "Team Request Approved",
    action: "Activation Approved",
    status: "Success",
    message_intro: "An activation request for your team member has been approved.",
    actionbutton_text: "View Team",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "The admin now has full access to the system.",
    details: {} // Request ID, Admin ID, Approved By, Approved At
  },

  // 🔹 Activation Request Rejected (Requester)
  activationRequestRejected: {
    ...defaultConfig,
    subject: "❌ Your Activation Request Has Been Rejected",
    event_name: "Request Rejected",
    action: "Activation Rejected",
    status: "Rejected",
    message_intro: "Your activation request has been rejected.",
    notes: "Please contact your supervisor for more information.",
    details: {} // Request ID, Admin ID, Rejected By, Rejection Reason, Rejected At
  },

  // 🔹 Activation Rejection Confirmation (Rejector)
  activationRejectionConfirmation: {
    ...defaultConfig,
    subject: "❌ Activation Request Rejected Successfully",
    event_name: "Rejection Confirmed",
    action: "Request Rejected",
    status: "Success",
    message_intro: "You have successfully rejected an activation request.",
    notes: "The requester has been notified.",
    details: {} // Request ID, Admin ID, Rejected At, Reason
  },

  // 🔹 Activation Rejected Notification to Supervisor
  activationRejectedNotificationSupervisor: {
    ...defaultConfig,
    subject: "ℹ️ Activation Request Rejected for Team Member",
    event_name: "Team Request Rejected",
    action: "Activation Rejected",
    status: "Rejected",
    message_intro: "An activation request for your team member has been rejected.",
    notes: "The requester has been notified of the decision.",
    details: {} // Request ID, Admin ID, Rejected By, Rejection Reason, Rejected At
  },

  // 🔹 Deactivation Request Approved (Requester)
  deactivationRequestApproved: {
    ...defaultConfig,
    subject: "✅ Your Deactivation Request Has Been Approved",
    event_name: "Request Approved",
    action: "Deactivation Approved",
    status: "Approved",
    message_intro: "Your deactivation request has been approved.",
    notes: "The admin account has been deactivated as requested.",
    details: {} // Request ID, Admin ID, Approved By, Approved At
  },

  // 🔹 Deactivation Approval Confirmation (Approver)
  deactivationApprovalConfirmation: {
    ...defaultConfig,
    subject: "✅ Deactivation Request Approved Successfully",
    event_name: "Approval Confirmed",
    action: "Request Approved",
    status: "Success",
    message_intro: "You have successfully approved a deactivation request.",
    notes: "The admin account has been deactivated.",
    details: {} // Request ID, Admin ID, Approved At
  },

  // 🔹 Deactivation Approved Notification to Supervisor
  deactivationApprovedNotificationSupervisor: {
    ...defaultConfig,
    subject: "ℹ️ Deactivation Request Approved for Team Member",
    event_name: "Team Request Approved",
    action: "Deactivation Approved",
    status: "Success",
    message_intro: "A deactivation request for your team member has been approved.",
    notes: "The admin account has been deactivated.",
    details: {} // Request ID, Admin ID, Approved By, Approved At
  },

  // 🔹 Deactivation Request Rejected (Requester)
  deactivationRequestRejected: {
    ...defaultConfig,
    subject: "❌ Your Deactivation Request Has Been Rejected",
    event_name: "Request Rejected",
    action: "Deactivation Rejected",
    status: "Rejected",
    message_intro: "Your deactivation request has been rejected.",
    notes: "Please contact your supervisor for more information.",
    details: {} // Request ID, Admin ID, Rejected By, Rejection Reason, Rejected At
  },

  // 🔹 Deactivation Rejection Confirmation (Rejector)
  deactivationRejectionConfirmation: {
    ...defaultConfig,
    subject: "❌ Deactivation Request Rejected Successfully",
    event_name: "Rejection Confirmed",
    action: "Request Rejected",
    status: "Success",
    message_intro: "You have successfully rejected a deactivation request.",
    notes: "The requester has been notified.",
    details: {} // Request ID, Admin ID, Rejected At, Reason
  },

  // 🔹 Deactivation Rejected Notification to Supervisor
  deactivationRejectedNotificationSupervisor: {
    ...defaultConfig,
    subject: "ℹ️ Deactivation Request Rejected for Team Member",
    event_name: "Team Request Rejected",
    action: "Deactivation Rejected",
    status: "Rejected",
    message_intro: "A deactivation request for your team member has been rejected.",
    notes: "The requester has been notified of the decision.",
    details: {} // Request ID, Admin ID, Rejected By, Rejection Reason, Rejected At
  },

  // 🔹 New Supervisor Assigned
  newSupervisorAssigned: {
    ...defaultConfig,
    subject: "👨‍💼 You Have Been Assigned as Supervisor",
    event_name: "Supervisor Assigned",
    action: "New Responsibility",
    status: "Success",
    message_intro: "You have been assigned as supervisor for an admin.",
    actionbutton_text: "View Team",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "Please provide guidance and support to your team member.",
    details: {} // Admin ID, Role, Changed By, Changed At
  },

  // 🔹 Supervisor Removed
  supervisorRemoved: {
    ...defaultConfig,
    subject: "ℹ️ Supervisor Responsibility Removed",
    event_name: "Supervisor Removed",
    action: "Responsibility Changed",
    status: "Success",
    message_intro: "You are no longer the supervisor for an admin.",
    notes: "This change has been made by a higher authority.",
    details: {} // Admin ID, Role, Changed By, Changed At, New Supervisor
  },

  // 🔹 Supervisor Changed (Target Admin)
  supervisorChanged: {
    ...defaultConfig,
    subject: "🔄 Your Supervisor Has Been Changed",
    event_name: "Supervisor Updated",
    action: "Supervisor Changed",
    status: "Success",
    message_intro: "Your supervisor has been changed in the system.",
    actionbutton_text: "View Profile",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "Please reach out to your new supervisor for any support needed.",
    details: {} // Admin ID, Old Supervisor, New Supervisor, Changed By, Changed At
  },

  // 🔹 Own Details Updated
  ownDetailsUpdated: {
    ...defaultConfig,
    subject: "✅ Your Profile Has Been Updated",
    event_name: "Profile Updated",
    action: "Self Update",
    status: "Success",
    message_intro: "You have successfully updated your profile details.",
    actionbutton_text: "View Profile",
    actionlink: "<ADMIN_PANEL_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<ADMIN_PANEL_LINK>",
    notes: "Your changes have been saved successfully.",
    details: {} // Admin ID, Updated Fields, Updated At
  },

  // 🔹 User Account Blocked
  userBlocked: {
    ...defaultConfig,
    subject: "🚫 User Account Blocked",
    event_name: "User Account Blocked",
    action: "Account Block",
    status: "Blocked",
    message_intro: "A user account has been blocked for security/policy reasons.",
    notes: "The user will not be able to access their account until it is unblocked.\n\nIf you believe this is a mistake, please contact support.",
    details: {} // Will be populated: User ID, Email, Phone, Blocked By, Reason, Details, Timestamp
  },

  // 🔹 User Account Blocked - Supervisor Notification
  userBlockedSupervisor: {
    ...defaultConfig,
    subject: "🚫 [Supervisor Alert] User Account Blocked",
    event_name: "User Account Blocked - Supervisor Notification",
    action: "Account Block by Admin",
    status: "Blocked",
    message_intro: "One of your supervised admins has blocked a user account.",
    notes: "This is an automated notification for your oversight and record-keeping.",
    details: {} // Will be populated: Admin ID, Admin Email, User ID, User Email, User Phone, Reason, Details, Timestamp
  },

  // 🔹 User Account Unblocked
  userUnblocked: {
    ...defaultConfig,
    subject: "✅ User Account Unblocked",
    event_name: "User Account Unblocked",
    action: "Account Unblock",
    status: "Unblocked",
    message_intro: "Good news! A user account has been unblocked.",
    actionbutton_text: "Login Now",
    actionlink: "<USER_LOGIN_LINK>",
    fallback_note: "If the button doesn't work, copy the link below:",
    action_link: "<USER_LOGIN_LINK>",
    notes: "The user can now login and access their account normally.",
    details: {} // Will be populated: User ID, Email, Phone, Unblocked By, Reason, Timestamp
  },

  // 🔹 User Account Unblocked - Supervisor Notification
  userUnblockedSupervisor: {
    ...defaultConfig,
    subject: "✅ [Supervisor Alert] User Account Unblocked",
    event_name: "User Account Unblocked - Supervisor Notification",
    action: "Account Unblock by Admin",
    status: "Unblocked",
    message_intro: "One of your supervised admins has unblocked a user account.",
    notes: "This is an automated notification for your oversight and record-keeping.",
    details: {} // Will be populated: Admin ID, Admin Email, User ID, User Email, User Phone, Reason, Details, Timestamp
  },

  // 🔹 User Device Blocked - Supervisor Notification
  deviceBlockedSupervisor: {
    ...defaultConfig,
    subject: "🔒 [Supervisor Alert] User Device Blocked",
    event_name: "User Device Blocked - Supervisor Notification",
    action: "Device Block by Admin",
    status: "Blocked",
    message_intro: "One of your supervised admins has blocked a user device.",
    notes: "This is an automated notification for your oversight and record-keeping.",
    details: {} // Will be populated: Admin ID, Admin Email, User ID, User Email, User Phone, Device ID, Reason, Details, Timestamp
  },

  // 🔹 User Device Unblocked - Supervisor Notification
  deviceUnblockedSupervisor: {
    ...defaultConfig,
    subject: "🔓 [Supervisor Alert] User Device Unblocked",
    event_name: "User Device Unblocked - Supervisor Notification",
    action: "Device Unblock by Admin",
    status: "Unblocked",
    message_intro: "One of your supervised admins has unblocked a user device.",
    notes: "This is an automated notification for your oversight and record-keeping.",
    details: {} // Will be populated: Admin ID, Admin Email, User ID, User Email, User Phone, Device ID, Reason, Details, Timestamp
  }
};

module.exports = {
  adminTemplate
};
