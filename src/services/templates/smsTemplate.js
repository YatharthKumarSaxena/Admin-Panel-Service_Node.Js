/**
 * 📱 SMS Templates
 * Detailed text templates for SMS notifications (matching email template style)
 * No buttons, just plain text links
 */

const smsTemplate = {
  // ============= ADMIN SMS TEMPLATES =============

  // 🎉 Admin Created
  adminCreated: (admin, createdBy) =>
    `🎉 Admin Account Created\n\nDear Admin,\n\nYour admin account has been successfully created!\n\nAdmin ID: ${admin.adminId}\nRole: ${admin.adminType}\nCreated By: ${createdBy}\n\nLogin: ${process.env.ADMIN_PANEL_LINK}\nSupport: ${process.env.SUPPORT_EMAIL}`,

  // ✅ Admin Activated
  adminActivated: (admin, activatedBy) =>
    `✅ Account Activated\n\nDear Admin,\n\nYour admin account is now active!\n\nAdmin ID: ${admin.adminId}\nRole: ${admin.adminType}\nActivated By: ${activatedBy}\n\nYou can now access all your permissions.\n\nLogin: ${process.env.ADMIN_PANEL_LINK}`,

  // ⏸️ Admin Deactivated
  adminDeactivated: (admin, deactivatedBy, reason) =>
    `⚠️ Account Deactivated\n\nDear Admin,\n\nYour admin account has been deactivated.\n\nAdmin ID: ${admin.adminId}\nDeactivated By: ${deactivatedBy}${reason ? `\nReason: ${reason}` : ''}\n\nPlease contact support for assistance if you think this is a mistake.\n\nSupport: ${process.env.SUPPORT_EMAIL}`,

  // 🔄 Role Changed
  roleChanged: (admin, oldRole, newRole, changedBy) =>
    `🔄 Role Updated\n\nDear Admin,\n\nYour role has been changed.\n\nAdmin ID: ${admin.adminId}\nPrevious Role: ${oldRole}\nNew Role: ${newRole}\nChanged By: ${changedBy}\n\nLogin to view your updated permissions.\n\nLogin: ${process.env.ADMIN_PANEL_LINK}`,

  // 📝 Details Updated
  detailsUpdated: (admin, updatedFields, updatedBy) =>
    `📝 Profile Updated\n\nDear Admin,\n\nYour admin profile has been updated.\n\nAdmin ID: ${admin.adminId}\nUpdated Fields: ${updatedFields.join(', ')}\nUpdated By: ${updatedBy}\n\nReview your profile for changes.\n\nLogin: ${process.env.ADMIN_PANEL_LINK}`,

  // 📋 Role Change Requested
  roleChangeRequested: (admin, currentRole, requestedRole) =>
    `📋 Role Change Request\n\nDear Admin,\n\nYour role change request has been submitted.\n\nAdmin ID: ${admin.adminId}\nCurrent Role: ${currentRole}\nRequested Role: ${requestedRole}\nStatus: Pending Approval\n\nYou will be notified once your request is reviewed.`,

  // ✅ Role Change Approved
  roleChangeApproved: (admin, oldRole, newRole, approvedBy) =>
    `✅ Request Approved\n\nDear Admin,\n\nGreat news! Your role change request has been approved.\n\nAdmin ID: ${admin.adminId}\nPrevious Role: ${oldRole}\nNew Role: ${newRole}\nApproved By: ${approvedBy}\n\nLogin to access your new permissions.\n\nLogin: ${process.env.ADMIN_PANEL_LINK}`,

  // ❌ Role Change Rejected
  roleChangeRejected: (admin, requestedRole, rejectedBy, reason) =>
    `❌ Request Rejected\n\nDear Admin,\n\nYour role change request has been rejected.\n\nAdmin ID: ${admin.adminId}\nRequested Role: ${requestedRole}\nRejected By: ${rejectedBy}${reason ? `\nReason: ${reason}` : ''}\n\nFor more information, contact support.\n\nSupport: ${process.env.SUPPORT_EMAIL}`,

  // ============= USER SMS TEMPLATES =============

  // 🚫 User Blocked
  userBlocked: (user, blockedBy, reason) =>
    `🚫 Account Blocked\n\nDear User,\n\nYour account has been blocked.\n\nUser ID: ${user.userId}\nBlocked By: ${blockedBy}${reason ? `\nReason: ${reason}` : ''}\n\nContact support for assistance if you think this is a mistake.\n\nSupport: ${process.env.SUPPORT_EMAIL}`,

  // ✅ User Unblocked
  userUnblocked: (user, unblockedBy) =>
    `✅ Account Unblocked\n\nDear User,\n\nYour account has been unblocked.\n\nUser ID: ${user.userId}\nUnblocked By: ${unblockedBy}\n\nYou can now login and access your account.\n\nLogin: ${process.env.FRONTEND_URL}`,

  
  adminRoleChanged: (admin, oldRole, newRole, changedBy) =>
    `🔄 Role Updated\n\nDear Admin,\n\nYour role has been changed.\n\nAdmin ID: ${admin.adminId}\nPrevious Role: ${oldRole}\nNew Role: ${newRole}\nChanged By: ${changedBy}\n\nLogin to view your updated permissions.\n\nLogin: ${process.env.ADMIN_PANEL_LINK}`,
  // ========== NEW SMS TEMPLATES ==========

  supervisorOnAdminCreationNotification: (newAdmin, createdBy) =>
  `👤 New Admin Created by Your Team Member\n\n` +
  `One of the admins under your supervision has created a new admin account.\n\n` +
  `New Admin Details:\n` +
  `Admin ID: ${newAdmin.adminId}\n` +
  `Admin Role: ${newAdmin.adminType}\n\n` +
  `Created By:\n` +
  `${createdBy.name} (${createdBy.role})\n\n` +
  `This action has been logged for your awareness.\n\n` +
  `Admin Panel:\n` +
  `${process.env.ADMIN_PANEL_LINK}`,

  // 👤 Supervisor Notification - New Admin
  supervisorNewAdminNotification: (newAdmin, createdBy) =>
    `👤 New Team Member\n\nA new admin has been added to your team.\n\nAdmin ID: ${newAdmin.adminId}\nRole: ${newAdmin.adminType}\nCreated By: ${createdBy}\n\nYou are assigned as their supervisor.\n\nLogin: ${process.env.ADMIN_PANEL_LINK}`,

  // 📋 Activation Request Submitted
  activationRequestSubmitted: (admin, requestId) =>
    `📋 Request Submitted\n\nYour activation request has been submitted.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nStatus: Pending Approval\n\nYou will be notified once reviewed.`,

  // ⏳ Activation Request Pending
  activationRequestPending: (admin, requestedBy) =>
    `⏳ Activation Pending\n\nAn activation request has been submitted for your account.\n\nAdmin ID: ${admin.adminId}\nRequested By: ${requestedBy}\n\nPending approval.`,

  // 🔍 Activation Request Review (Supervisor)
  activationRequestReview: (admin, requestId, requestedBy) =>
    `🔍 Review Required\n\nActivation request needs your review.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nRequested By: ${requestedBy}\n\nLogin to review: ${process.env.ADMIN_PANEL_LINK}`,

  // 📋 Deactivation Request Submitted
  deactivationRequestSubmitted: (admin, requestId, reason) =>
    `📋 Request Submitted\n\nYour deactivation request has been submitted.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}${reason ? `\nReason: ${reason}` : ''}\nStatus: Pending Approval\n\nYou will be notified once reviewed.`,

  // 🔍 Deactivation Request Review (Supervisor)
  deactivationRequestReview: (admin, requestId, requestedBy, reason) =>
    `🔍 Review Required\n\nDeactivation request needs your review.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nRequested By: ${requestedBy}${reason ? `\nReason: ${reason}` : ''}\n\nLogin to review: ${process.env.ADMIN_PANEL_LINK}`,

  // ✅ Activation Confirmation (Actor)
  activationConfirmation: (admin) =>
    `✅ Activation Confirmed\n\nYou have activated an admin account.\n\nAdmin ID: ${admin.adminId}\nRole: ${admin.adminType}\n\nAdmin can now access the system.`,

  // ℹ️ Activation Notification to Supervisor
  activationNotificationSupervisor: (admin, activatedBy) =>
    `ℹ️ Team Member Activated\n\nYour team member's account has been activated.\n\nAdmin ID: ${admin.adminId}\nRole: ${admin.adminType}\nActivated By: ${activatedBy}\n\nThey now have full access.`,

  // ❌ Deactivation Confirmation (Actor)
  deactivationConfirmation: (admin, reason) =>
    `❌ Deactivation Confirmed\n\nYou have deactivated an admin account.\n\nAdmin ID: ${admin.adminId}\nRole: ${admin.adminType}${reason ? `\nReason: ${reason}` : ''}\n\nAdmin can no longer access the system.`,

  // ℹ️ Deactivation Notification to Supervisor
  deactivationNotificationSupervisor: (admin, deactivatedBy, reason) =>
    `ℹ️ Team Member Deactivated\n\nYour team member's account has been deactivated.\n\nAdmin ID: ${admin.adminId}\nRole: ${admin.adminType}\nDeactivated By: ${deactivatedBy}${reason ? `\nReason: ${reason}` : ''}\n\nThey can no longer access the system.`,

  // ✅ Details Update Confirmation (Actor)
  detailsUpdateConfirmation: (admin, updatedFields) =>
    `✅ Update Confirmed\n\nYou have updated admin details.\n\nAdmin ID: ${admin.adminId}\nUpdated: ${updatedFields.join(', ')}\n\nChanges applied successfully.`,

  // ℹ️ Details Update Notification to Supervisor
  detailsUpdateNotificationSupervisor: (admin, updatedBy, updatedFields) =>
    `ℹ️ Team Member Updated\n\nYour team member's details have been updated.\n\nAdmin ID: ${admin.adminId}\nUpdated: ${updatedFields.join(', ')}\nUpdated By: ${updatedBy}`,

  // ✅ Activation Request Approved (Requester)
  activationRequestApproved: (admin, requestId, approvedBy) =>
    `✅ Request Approved\n\nYour activation request has been approved!\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nApproved By: ${approvedBy}\n\nAccount is now active.`,

  // ✅ Activation Approval Confirmation (Approver)
  activationApprovalConfirmation: (admin, requestId) =>
    `✅ Approval Confirmed\n\nYou approved an activation request.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\n\nAccount is now active.`,

  // ℹ️ Activation Approved Notification to Supervisor
  activationApprovedNotificationSupervisor: (admin, requestId, approvedBy) =>
    `ℹ️ Team Request Approved\n\nActivation request for your team member has been approved.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nApproved By: ${approvedBy}\n\nAccount is now active.`,

  // ❌ Activation Request Rejected (Requester)
  activationRequestRejected: (admin, requestId, rejectedBy, reason) =>
    `❌ Request Rejected\n\nYour activation request has been rejected.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nRejected By: ${rejectedBy}${reason ? `\nReason: ${reason}` : ''}\n\nContact supervisor for details.`,

  // ❌ Activation Rejection Confirmation (Rejector)
  activationRejectionConfirmation: (admin, requestId, reason) =>
    `❌ Rejection Confirmed\n\nYou rejected an activation request.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}${reason ? `\nReason: ${reason}` : ''}\n\nRequester notified.`,

  // ℹ️ Activation Rejected Notification to Supervisor
  activationRejectedNotificationSupervisor: (admin, requestId, rejectedBy, reason) =>
    `ℹ️ Team Request Rejected\n\nActivation request for your team member has been rejected.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nRejected By: ${rejectedBy}${reason ? `\nReason: ${reason}` : ''}`,

  // ✅ Deactivation Request Approved (Requester)
  deactivationRequestApproved: (admin, requestId, approvedBy) =>
    `✅ Request Approved\n\nYour deactivation request has been approved.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nApproved By: ${approvedBy}\n\nAccount has been deactivated.`,

  // ✅ Deactivation Approval Confirmation (Approver)
  deactivationApprovalConfirmation: (admin, requestId) =>
    `✅ Approval Confirmed\n\nYou approved a deactivation request.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\n\nAccount has been deactivated.`,

  // ℹ️ Deactivation Approved Notification to Supervisor
  deactivationApprovedNotificationSupervisor: (admin, requestId, approvedBy) =>
    `ℹ️ Team Request Approved\n\nDeactivation request for your team member has been approved.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nApproved By: ${approvedBy}\n\nAccount has been deactivated.`,

  // ❌ Deactivation Request Rejected (Requester)
  deactivationRequestRejected: (admin, requestId, rejectedBy, reason) =>
    `❌ Request Rejected\n\nYour deactivation request has been rejected.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nRejected By: ${rejectedBy}${reason ? `\nReason: ${reason}` : ''}\n\nContact supervisor for details.`,

  // ❌ Deactivation Rejection Confirmation (Rejector)
  deactivationRejectionConfirmation: (admin, requestId, reason) =>
    `❌ Rejection Confirmed\n\nYou rejected a deactivation request.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}${reason ? `\nReason: ${reason}` : ''}\n\nRequester notified.`,

  // ℹ️ Deactivation Rejected Notification to Supervisor
  deactivationRejectedNotificationSupervisor: (admin, requestId, rejectedBy, reason) =>
    `ℹ️ Team Request Rejected\n\nDeactivation request for your team member has been rejected.\n\nRequest ID: ${requestId}\nAdmin ID: ${admin.adminId}\nRejected By: ${rejectedBy}${reason ? `\nReason: ${reason}` : ''}`,

  // 👨‍💼 New Supervisor Assigned
  newSupervisorAssigned: (admin, changedBy) =>
    `👨‍💼 Supervisor Assigned\n\nYou are now supervisor for an admin.\n\nAdmin ID: ${admin.adminId}\nRole: ${admin.adminType}\nAssigned By: ${changedBy}\n\nPlease provide support to your team member.`,

  // ℹ️ Supervisor Removed
  supervisorRemoved: (admin, changedBy, newSupervisor) =>
    `ℹ️ Supervisor Changed\n\nYou are no longer supervisor for an admin.\n\nAdmin ID: ${admin.adminId}\nNew Supervisor: ${newSupervisor}\nChanged By: ${changedBy}`,

  // 🔄 Supervisor Changed (Target Admin)
  supervisorChanged: (admin, oldSupervisor, newSupervisor, changedBy) =>
    `🔄 Supervisor Updated\n\nYour supervisor has been changed.\n\nAdmin ID: ${admin.adminId}\nOld Supervisor: ${oldSupervisor}\nNew Supervisor: ${newSupervisor}\nChanged By: ${changedBy}\n\nPlease reach out to your new supervisor.`,

  // ✅ Own Details Updated
  ownDetailsUpdated: (admin, updatedFields) =>
    `✅ Profile Updated\n\nYou have updated your profile.\n\nAdmin ID: ${admin.adminId}\nUpdated: ${updatedFields.join(', ')}\n\nChanges saved successfully.`,

  // User Block/Unblock SMS Templates
  userBlockedNotification: (user, blockedBy, reason, reasonDetails) =>
    `🚫 Account Blocked\n\nYour account has been blocked.\n\nUser ID: ${user.userId}\nBlocked By: Admin ${blockedBy}\nReason: ${reason}${reasonDetails ? `\nDetails: ${reasonDetails.substring(0, 50)}...` : ''}\n\nContact support for assistance.`,

  userBlockedSupervisorNotification: (supervisor, user, admin, reason, reasonDetails) =>
    `🚫 [Supervisor Alert]\n\nAdmin ${admin.adminId} blocked user ${user.userId}\n\nReason: ${reason}${reasonDetails ? `\nDetails: ${reasonDetails.substring(0, 40)}...` : ''}\n\nTimestamp: ${new Date().toLocaleString()}`,

  userUnblockedNotification: (user, unblockedBy, reason) =>
    `✅ Account Unblocked\n\nYour account has been unblocked.\n\nUser ID: ${user.userId}\nUnblocked By: Admin ${unblockedBy}\nReason: ${reason}\n\nYou can now login to your account.`,

  userUnblockedSupervisorNotification: (supervisor, user, admin, reason, reasonDetails) =>
    `✅ [Supervisor Alert]\n\nAdmin ${admin.adminId} unblocked user ${user.userId}\n\nReason: ${reason}${reasonDetails ? `\nDetails: ${reasonDetails.substring(0, 40)}...` : ''}\n\nTimestamp: ${new Date().toLocaleString()}`,

  deviceBlockedSupervisorNotification: (supervisor, user, deviceId, admin, reason, reasonDetails) =>
    `🔒 [Supervisor Alert]\n\nAdmin ${admin.adminId} blocked device for user ${user.userId}\n\nDevice: ${deviceId.substring(0, 8)}...\nReason: ${reason}${reasonDetails ? `\nDetails: ${reasonDetails.substring(0, 30)}...` : ''}\n\nTime: ${new Date().toLocaleString()}`,

  deviceUnblockedSupervisorNotification: (supervisor, user, deviceId, admin, reason, reasonDetails) =>
    `🔓 [Supervisor Alert]\n\nAdmin ${admin.adminId} unblocked device for user ${user.userId}\n\nDevice: ${deviceId.substring(0, 8)}...\nReason: ${reason}${reasonDetails ? `\nDetails: ${reasonDetails.substring(0, 30)}...` : ''}\n\nTime: ${new Date().toLocaleString()}`

};

module.exports = { smsTemplate };
