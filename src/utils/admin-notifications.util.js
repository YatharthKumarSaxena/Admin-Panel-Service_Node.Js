const { sendNotificationFactory } = require("./notification-dispatcher.util");

/**
 * 📬 Admin Notifications Helper
 * Pre-configured notification functions for all admin operations
 * Uses factory pattern to handle auth mode automatically
 */

// ========== CREATE ADMIN NOTIFICATIONS ==========

/**
 * Notify supervisor about new admin
 */
const notifySupervisorNewAdmin = (supervisor, newAdmin, createdBy) => {
    if (!supervisor || supervisor.adminId === createdBy.adminId) {
        // Skip if self-assigned
        return;
    }

    const emailData = {
        details: {
            'Admin ID': newAdmin.adminId,
            'Role': newAdmin.adminType,
            'Email': newAdmin.email || 'N/A',
            'Phone': newAdmin.fullPhoneNumber || 'N/A',
            'Created By': createdBy.adminId,
            'Created At': new Date().toLocaleString()
        }
    };

    const smsArgs = [newAdmin, createdBy.adminId];

    sendNotificationFactory(supervisor, 'supervisorNewAdminNotification', emailData, smsArgs);
};

// ========== ACTIVATION REQUEST NOTIFICATIONS ==========

/**
 * Notify requester about activation request submission
 */
const notifyActivationRequestSubmitted = (requester, targetAdmin, requestId) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Submitted At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId];

    sendNotificationFactory(requester, 'activationRequestSubmitted', emailData, smsArgs);
};

/**
 * Notify target admin about pending activation request
 */
const notifyActivationRequestPending = (targetAdmin, requester, requestId) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Requested By': requester.adminId,
            'Submitted At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requester.adminId];

    sendNotificationFactory(targetAdmin, 'activationRequestPending', emailData, smsArgs);
};

/**
 * Notify supervisor about activation request needing review
 */
const notifyActivationRequestReview = (supervisor, targetAdmin, requester, requestId) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Requested By': requester.adminId,
            'Submitted At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, requester.adminId];

    sendNotificationFactory(supervisor, 'activationRequestReview', emailData, smsArgs);
};

// ========== DEACTIVATION REQUEST NOTIFICATIONS ==========

/**
 * Notify requester about deactivation request submission
 */
const notifyDeactivationRequestSubmitted = (requester, targetAdmin, requestId, reason) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Reason': reason || 'Not specified',
            'Submitted At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, reason];

    sendNotificationFactory(requester, 'deactivationRequestSubmitted', emailData, smsArgs);
};

/**
 * Notify supervisor about deactivation request needing review
 */
const notifyDeactivationRequestReview = (supervisor, targetAdmin, requester, requestId, reason) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Requested By': requester.adminId,
            'Reason': reason || 'Not specified',
            'Submitted At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, requester.adminId, reason];

    sendNotificationFactory(supervisor, 'deactivationRequestReview', emailData, smsArgs);
};

// ========== DIRECT ACTIVATION NOTIFICATIONS ==========

/**
 * Notify target admin about activation
 */
const notifyAdminActivated = (targetAdmin, activatedBy) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Activated By': activatedBy.adminId,
            'Activated At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, activatedBy.adminId];

    sendNotificationFactory(targetAdmin, 'adminActivated', emailData, smsArgs);
};

/**
 * Notify actor about activation confirmation
 */
const notifyActivationConfirmation = (actor, targetAdmin) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Activated At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin];

    sendNotificationFactory(actor, 'activationConfirmation', emailData, smsArgs);
};

/**
 * Notify supervisor about activation (if supervisor != actor)
 */
const notifyActivationToSupervisor = (supervisor, targetAdmin, actor) => {
    if (!supervisor || supervisor.adminId === actor.adminId) {
        return; // Skip if actor is supervisor
    }

    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Activated By': actor.adminId,
            'Activated At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, actor.adminId];

    sendNotificationFactory(supervisor, 'activationNotificationSupervisor', emailData, smsArgs);
};

// ========== DIRECT DEACTIVATION NOTIFICATIONS ==========

/**
 * Notify target admin about deactivation
 */
const notifyAdminDeactivated = (targetAdmin, deactivatedBy, reason) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Deactivated By': deactivatedBy.adminId,
            'Deactivated At': new Date().toLocaleString(),
            'Reason': reason || 'Not specified'
        }
    };

    const smsArgs = [targetAdmin, deactivatedBy.adminId, reason];

    sendNotificationFactory(targetAdmin, 'adminDeactivated', emailData, smsArgs);
};

/**
 * Notify actor about deactivation confirmation
 */
const notifyDeactivationConfirmation = (actor, targetAdmin, reason) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Deactivated At': new Date().toLocaleString(),
            'Reason': reason || 'Not specified'
        }
    };

    const smsArgs = [targetAdmin, reason];

    sendNotificationFactory(actor, 'deactivationConfirmation', emailData, smsArgs);
};

/**
 * Notify supervisor about deactivation (if supervisor != actor)
 */
const notifyDeactivationToSupervisor = (supervisor, targetAdmin, actor, reason) => {
    if (!supervisor || supervisor.adminId === actor.adminId) {
        return; // Skip if actor is supervisor
    }

    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Deactivated By': actor.adminId,
            'Deactivated At': new Date().toLocaleString(),
            'Reason': reason || 'Not specified'
        }
    };

    const smsArgs = [targetAdmin, actor.adminId, reason];

    sendNotificationFactory(supervisor, 'deactivationNotificationSupervisor', emailData, smsArgs);
};

// ========== UPDATE DETAILS NOTIFICATIONS ==========

/**
 * Notify target admin about details update
 */
const notifyAdminDetailsUpdated = (targetAdmin, updatedBy, updatedFields) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Updated Fields': updatedFields.join(', '),
            'Updated By': updatedBy.adminId,
            'Updated At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, updatedFields, updatedBy.adminId];

    sendNotificationFactory(targetAdmin, 'adminDetailsUpdated', emailData, smsArgs);
};

/**
 * Notify actor about update confirmation
 */
const notifyDetailsUpdateConfirmation = (actor, targetAdmin, updatedFields) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Updated Fields': updatedFields.join(', '),
            'Updated At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, updatedFields];

    sendNotificationFactory(actor, 'detailsUpdateConfirmation', emailData, smsArgs);
};

/**
 * Notify supervisor about details update (if supervisor != actor)
 */
const notifyDetailsUpdateToSupervisor = (supervisor, targetAdmin, actor, updatedFields) => {
    if (!supervisor || supervisor.adminId === actor.adminId) {
        return; // Skip if actor is supervisor
    }

    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Updated Fields': updatedFields.join(', '),
            'Updated By': actor.adminId,
            'Updated At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, actor.adminId, updatedFields];

    sendNotificationFactory(supervisor, 'detailsUpdateNotificationSupervisor', emailData, smsArgs);
};

/**
 * Notify admin about own details update
 */
const notifyOwnDetailsUpdated = (admin, updatedFields) => {
    const emailData = {
        details: {
            'Admin ID': admin.adminId,
            'Updated Fields': updatedFields.join(', '),
            'Updated At': new Date().toLocaleString()
        }
    };

    const smsArgs = [admin, updatedFields];

    sendNotificationFactory(admin, 'ownDetailsUpdated', emailData, smsArgs);
};

// ========== APPROVAL/REJECTION NOTIFICATIONS ==========

/**
 * Notify requester about activation request approval
 */
const notifyActivationRequestApproved = (requester, targetAdmin, approver, requestId) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Approved By': approver.adminId,
            'Approved At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, approver.adminId];

    sendNotificationFactory(requester, 'activationRequestApproved', emailData, smsArgs);
};

/**
 * Notify approver about activation approval confirmation
 */
const notifyActivationApprovalConfirmation = (approver, targetAdmin, requestId) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Approved At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId];

    sendNotificationFactory(approver, 'activationApprovalConfirmation', emailData, smsArgs);
};

/**
 * Notify supervisor about activation approval (if supervisor != approver)
 */
const notifyActivationApprovedToSupervisor = (supervisor, targetAdmin, approver, requestId) => {
    if (!supervisor || supervisor.adminId === approver.adminId) {
        return;
    }

    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Approved By': approver.adminId,
            'Approved At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, approver.adminId];

    sendNotificationFactory(supervisor, 'activationApprovedNotificationSupervisor', emailData, smsArgs);
};

/**
 * Notify requester about activation request rejection
 */
const notifyActivationRequestRejected = (requester, targetAdmin, rejector, requestId, reason) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Rejected By': rejector.adminId,
            'Rejection Reason': reason || 'Not specified',
            'Rejected At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, rejector.adminId, reason];

    sendNotificationFactory(requester, 'activationRequestRejected', emailData, smsArgs);
};

/**
 * Notify rejector about activation rejection confirmation
 */
const notifyActivationRejectionConfirmation = (rejector, targetAdmin, requestId, reason) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Rejected At': new Date().toLocaleString(),
            'Reason': reason || 'Not specified'
        }
    };

    const smsArgs = [targetAdmin, requestId, reason];

    sendNotificationFactory(rejector, 'activationRejectionConfirmation', emailData, smsArgs);
};

/**
 * Notify supervisor about activation rejection (if supervisor != rejector)
 */
const notifyActivationRejectedToSupervisor = (supervisor, targetAdmin, rejector, requestId, reason) => {
    if (!supervisor || supervisor.adminId === rejector.adminId) {
        return;
    }

    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Rejected By': rejector.adminId,
            'Rejection Reason': reason || 'Not specified',
            'Rejected At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, rejector.adminId, reason];

    sendNotificationFactory(supervisor, 'activationRejectedNotificationSupervisor', emailData, smsArgs);
};

// Similar functions for DEACTIVATION approval/rejection...
const notifyDeactivationRequestApproved = (requester, targetAdmin, approver, requestId) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Approved By': approver.adminId,
            'Approved At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, approver.adminId];

    sendNotificationFactory(requester, 'deactivationRequestApproved', emailData, smsArgs);
};

const notifyDeactivationApprovalConfirmation = (approver, targetAdmin, requestId) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Approved At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId];

    sendNotificationFactory(approver, 'deactivationApprovalConfirmation', emailData, smsArgs);
};

const notifyDeactivationApprovedToSupervisor = (supervisor, targetAdmin, approver, requestId) => {
    if (!supervisor || supervisor.adminId === approver.adminId) {
        return;
    }

    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Approved By': approver.adminId,
            'Approved At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, approver.adminId];

    sendNotificationFactory(supervisor, 'deactivationApprovedNotificationSupervisor', emailData, smsArgs);
};

const notifyDeactivationRequestRejected = (requester, targetAdmin, rejector, requestId, reason) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Rejected By': rejector.adminId,
            'Rejection Reason': reason || 'Not specified',
            'Rejected At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, rejector.adminId, reason];

    sendNotificationFactory(requester, 'deactivationRequestRejected', emailData, smsArgs);
};

const notifyDeactivationRejectionConfirmation = (rejector, targetAdmin, requestId, reason) => {
    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Rejected At': new Date().toLocaleString(),
            'Reason': reason || 'Not specified'
        }
    };

    const smsArgs = [targetAdmin, requestId, reason];

    sendNotificationFactory(rejector, 'deactivationRejectionConfirmation', emailData, smsArgs);
};

const notifyDeactivationRejectedToSupervisor = (supervisor, targetAdmin, rejector, requestId, reason) => {
    if (!supervisor || supervisor.adminId === rejector.adminId) {
        return;
    }

    const emailData = {
        details: {
            'Request ID': requestId,
            'Admin ID': targetAdmin.adminId,
            'Rejected By': rejector.adminId,
            'Rejection Reason': reason || 'Not specified',
            'Rejected At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, requestId, rejector.adminId, reason];

    sendNotificationFactory(supervisor, 'deactivationRejectedNotificationSupervisor', emailData, smsArgs);
};

// ========== SUPERVISOR CHANGE NOTIFICATIONS ==========

/**
 * Notify new supervisor about assignment
 */
const notifyNewSupervisorAssigned = (newSupervisor, targetAdmin, changedBy) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Changed By': changedBy.adminId,
            'Changed At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, changedBy.adminId];

    sendNotificationFactory(newSupervisor, 'newSupervisorAssigned', emailData, smsArgs);
};

/**
 * Notify old supervisor about removal
 */
const notifySupervisorRemoved = (oldSupervisor, targetAdmin, changedBy, newSupervisor) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Role': targetAdmin.adminType,
            'Changed By': changedBy.adminId,
            'New Supervisor': newSupervisor.adminId,
            'Changed At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, changedBy.adminId, newSupervisor.adminId];

    sendNotificationFactory(oldSupervisor, 'supervisorRemoved', emailData, smsArgs);
};

/**
 * Notify target admin about supervisor change
 */
const notifySupervisorChanged = (targetAdmin, oldSupervisor, newSupervisor, changedBy) => {
    const emailData = {
        details: {
            'Admin ID': targetAdmin.adminId,
            'Old Supervisor': oldSupervisor.adminId,
            'New Supervisor': newSupervisor.adminId,
            'Changed By': changedBy.adminId,
            'Changed At': new Date().toLocaleString()
        }
    };

    const smsArgs = [targetAdmin, oldSupervisor.adminId, newSupervisor.adminId, changedBy.adminId];

    sendNotificationFactory(targetAdmin, 'supervisorChanged', emailData, smsArgs);
};

// ============================================
// USER BLOCK/UNBLOCK NOTIFICATIONS
// ============================================

const notifyUserBlocked = async (user, admin, reason, reasonDetails) => {
    const emailData = {
        details: {
            'User ID': user.userId,
            'Email': user.email || 'N/A',
            'Phone': user.fullPhoneNumber || 'N/A',
            'Blocked By': `Admin ${admin.adminId}`,
            'Reason': reason,
            'Reason Details': reasonDetails || 'N/A',
            'Timestamp': new Date().toLocaleString()
        }
    };
    const smsArgs = [user, admin.adminId, reason, reasonDetails];
    await sendNotificationFactory(user, 'userBlocked', emailData, smsArgs);
};

const notifyUserBlockedToSupervisor = async (supervisor, user, admin, reason, reasonDetails) => {
    if (!supervisor || supervisor.adminId === admin.adminId) return;

    const emailData = {
        details: {
            'Admin': `${admin.adminId} (${admin.adminType})`,
            'Admin Email': admin.email || 'N/A',
            'User Blocked': user.userId,
            'User Email': user.email || 'N/A',
            'User Phone': user.fullPhoneNumber || 'N/A',
            'Block Reason': reason,
            'Reason Details': reasonDetails || 'N/A',
            'Timestamp': new Date().toLocaleString()
        }
    };
    const smsArgs = [supervisor, user, admin, reason, reasonDetails];
    await sendNotificationFactory(supervisor, 'userBlockedSupervisor', emailData, smsArgs);
};

const notifyUserUnblocked = async (user, admin, reason) => {
    const emailData = {
        details: {
            'User ID': user.userId,
            'Email': user.email || 'N/A',
            'Phone': user.fullPhoneNumber || 'N/A',
            'Unblocked By': `Admin ${admin.adminId}`,
            'Reason': reason,
            'Timestamp': new Date().toLocaleString()
        }
    };
    const smsArgs = [user, admin.adminId, reason];
    await sendNotificationFactory(user, 'userUnblocked', emailData, smsArgs);
};

const notifyUserUnblockedToSupervisor = async (supervisor, user, admin, reason, reasonDetails) => {
    if (!supervisor || supervisor.adminId === admin.adminId) return;

    const emailData = {
        details: {
            'Admin': `${admin.adminId} (${admin.adminType})`,
            'Admin Email': admin.email || 'N/A',
            'User Unblocked': user.userId,
            'User Email': user.email || 'N/A',
            'User Phone': user.fullPhoneNumber || 'N/A',
            'Unblock Reason': reason,
            'Reason Details': reasonDetails || 'N/A',
            'Timestamp': new Date().toLocaleString()
        }
    };
    const smsArgs = [supervisor, user, admin, reason, reasonDetails];
    await sendNotificationFactory(supervisor, 'userUnblockedSupervisor', emailData, smsArgs);
};

// ============================================
// DEVICE BLOCK/UNBLOCK NOTIFICATIONS
// ============================================

const notifyUserDeviceBlockedToSupervisor = async (supervisor, user, deviceId, admin, reason, reasonDetails) => {
    if (!supervisor || supervisor.adminId === admin.adminId) return;

    const emailData = {
        details: {
            'Admin': `${admin.adminId} (${admin.adminType})`,
            'Admin Email': admin.email || 'N/A',
            'User': user.userId,
            'User Email': user.email || 'N/A',
            'User Phone': user.fullPhoneNumber || 'N/A',
            'Device ID': deviceId,
            'Block Reason': reason,
            'Reason Details': reasonDetails || 'N/A',
            'Timestamp': new Date().toLocaleString()
        }
    };
    const smsArgs = [supervisor, user, deviceId, admin, reason, reasonDetails];
    await sendNotificationFactory(supervisor, 'deviceBlockedSupervisor', emailData, smsArgs);
};

const notifyUserDeviceUnblockedToSupervisor = async (supervisor, user, deviceId, admin, reason, reasonDetails) => {
    if (!supervisor || supervisor.adminId === admin.adminId) return;

    const emailData = {
        details: {
            'Admin': `${admin.adminId} (${admin.adminType})`,
            'Admin Email': admin.email || 'N/A',
            'User': user.userId,
            'User Email': user.email || 'N/A',
            'User Phone': user.fullPhoneNumber || 'N/A',
            'Device ID': deviceId,
            'Unblock Reason': reason,
            'Reason Details': reasonDetails || 'N/A',
            'Timestamp': new Date().toLocaleString()
        }
    };
    const smsArgs = [supervisor, user, deviceId, admin, reason, reasonDetails];
    await sendNotificationFactory(supervisor, 'deviceUnblockedSupervisor', emailData, smsArgs);
};

const notifySupervisorOnAdminCreation = (supervisor, newAdmin, creator) => {
    if (!supervisor || supervisor.adminId === creator.adminId) {
        // Skip if self-assigned
        return;
    }

    const emailData = {
        details: {
            'Admin ID': newAdmin.adminId,
            'Role': newAdmin.adminType,
            'Email': newAdmin.email || 'N/A',
            'Phone': newAdmin.fullPhoneNumber || 'N/A',
            'Created By': creator.adminId,
            'Created At': new Date().toLocaleString()
        }
    };

    const smsArgs = [newAdmin, creator.adminId];

    sendNotificationFactory(supervisor, 'supervisorOnAdminCreationNotification', emailData, smsArgs);
};

module.exports = {
    // Create Admin
    notifySupervisorNewAdmin,
    notifySupervisorOnAdminCreation,

    // Activation Requests
    notifyActivationRequestSubmitted,
    notifyActivationRequestPending,
    notifyActivationRequestReview,

    // Deactivation Requests
    notifyDeactivationRequestSubmitted,
    notifyDeactivationRequestReview,

    // Direct Activation
    notifyAdminActivated,
    notifyActivationConfirmation,
    notifyActivationToSupervisor,

    // Direct Deactivation
    notifyAdminDeactivated,
    notifyDeactivationConfirmation,
    notifyDeactivationToSupervisor,

    // Update Details
    notifyAdminDetailsUpdated,
    notifyDetailsUpdateConfirmation,
    notifyDetailsUpdateToSupervisor,
    notifyOwnDetailsUpdated,

    // Activation Approval/Rejection
    notifyActivationRequestApproved,
    notifyActivationApprovalConfirmation,
    notifyActivationApprovedToSupervisor,
    notifyActivationRequestRejected,
    notifyActivationRejectionConfirmation,
    notifyActivationRejectedToSupervisor,

    // Deactivation Approval/Rejection
    notifyDeactivationRequestApproved,
    notifyDeactivationApprovalConfirmation,
    notifyDeactivationApprovedToSupervisor,
    notifyDeactivationRequestRejected,
    notifyDeactivationRejectionConfirmation,
    notifyDeactivationRejectedToSupervisor,

    // Supervisor Change
    notifyNewSupervisorAssigned,
    notifySupervisorRemoved,
    notifySupervisorChanged,

    // User Block/Unblock
    notifyUserBlocked,
    notifyUserBlockedToSupervisor,
    notifyUserUnblocked,
    notifyUserUnblockedToSupervisor,

    // Device Block/Unblock
    notifyUserDeviceBlockedToSupervisor,
    notifyUserDeviceUnblockedToSupervisor
};
