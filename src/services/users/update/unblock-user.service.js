// UNBLOCK USER SERVICE

const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Unblock User Service
 * @param {Object} user - The user to unblock
 * @param {Object} admin - The admin performing the unblock
 * @param {string} reason - Reason for unblocking
 * @param {string} reasonDetails - Detailed reason
 * @param {Object} device - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const unblockUserService = async (user, admin, reason, reasonDetails, device, requestId) => {
    try {
        // Clone for audit before changes
        const oldUserData = cloneForAudit(user);

        // Check if not blocked
        if (!user.isBlocked) {
            return {
                success: false,
                type: 'NOT_BLOCKED',
                message: 'User is not blocked'
            };
        }

        // Atomic update using findOneAndUpdate
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user._id, isBlocked: true },
            {
                $set: {
                    isBlocked: false,
                    unblockReason: reason,
                    unblockReasonDetails: reasonDetails || null,
                    unblockedBy: admin.adminId,
                    unblockedAt: new Date(),
                    updatedBy: admin.adminId
                },
                $inc: { unblockCount: 1 }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return {
                success: false,
                type: 'NOT_BLOCKED',
                message: 'User already unblocked by another process'
            };
        }

        logWithTime(`✅ User ${updatedUser.userId} unblocked by admin ${admin.adminId}`);

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldUserData, updatedUser);

        // Log activity
        logActivityTrackerEvent(
            admin,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.UNBLOCK_USER,
            `Unblocked user ${updatedUser.userId} for reason: ${reason}`,
            {
                oldData,
                newData,
                adminActions: {
                    targetId: updatedUser.userId,
                    reason: reason
                }
            }
        );

        return {
            success: true,
            data: updatedUser
        };

    } catch (error) {
        logWithTime(`❌ Unblock user service error: ${error.message}`);
        return {
            success: false,
            type: 'INVALID_DATA',
            message: error.message
        };
    }
};

module.exports = { unblockUserService };
