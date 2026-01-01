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
    `✅ Account Unblocked\n\nDear User,\n\nYour account has been unblocked.\n\nUser ID: ${user.userId}\nUnblocked By: ${unblockedBy}\n\nYou can now login and access your account.\n\nLogin: ${process.env.FRONTEND_URL}`
};

module.exports = { smsTemplate };
