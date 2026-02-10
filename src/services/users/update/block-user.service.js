// BLOCK USER SERVICE

const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Block User Service
 * @param {Object} user - The user to block
 * @param {Object} admin - The admin performing the block
 * @param {string} reason - Reason for blocking
 * @param {string} reasonDetails - Detailed reason
 * @param {Object} device - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const blockUserService = async (user, admin, reason, reasonDetails, device, requestId) => {
    try {
        // Clone for audit before changes
        const oldUserData = cloneForAudit(user);

        // Check if already blocked
        if (user.isBlocked) {
            return {
                success: false,
                type: 'ALREADY_BLOCKED',
                message: 'User is already blocked'
            };
        }

        // Atomic update using findOneAndUpdate
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user._id, isBlocked: false },
            {
                $set: {
                    isBlocked: true,
                    blockReason: reason,
                    blockReasonDetails: reasonDetails || null,
                    blockedBy: admin.adminId,
                    blockedAt: new Date(),
                    updatedBy: admin.adminId
                },
                $inc: { blockCount: 1 }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return {
                success: false,
                type: 'ALREADY_BLOCKED',
                message: 'User already blocked by another process'
            };
        }

        logWithTime(`✅ User ${updatedUser.userId} blocked by admin ${admin.adminId}`);

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldUserData, updatedUser);

        // Log activity
        logActivityTrackerEvent(
            admin,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.BLOCK_USER,
            `Blocked user ${updatedUser.userId} for reason: ${reason}`,
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
        logWithTime(`❌ Block user service error: ${error.message}`);
        return {
            success: false,
            type: 'INVALID_DATA',
            message: error.message
        };
    }
};

module.exports = { blockUserService };
