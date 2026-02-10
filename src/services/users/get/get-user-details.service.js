// GET USER DETAILS SERVICE

const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");

/**
 * Get User Details Service
 * @param {string} userId - The user ID to fetch
 * @param {Object} viewer - The admin viewing the details
 * @param {Object} device - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const getUserDetailsService = async (userId, viewer, device, requestId) => {
    try {
        const user = await UserModel.findOne({ userId })
            .select('-__v')
            .lean();

        if (!user) {
            return {
                success: false,
                type: 'NOT_FOUND',
                message: 'User not found'
            };
        }

        // Log activity tracker event
        logActivityTrackerEvent(
            viewer,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.VIEW_USER_DETAILS,
            `Viewed details of user ${userId}`,
            {
                adminActions: {
                    targetId: userId
                }
            }
        );

        logWithTime(`✅ Admin ${viewer.adminId} viewed details of user ${userId}`);

        return {
            success: true,
            data: user
        };

    } catch (error) {
        logWithTime(`❌ Get user details service error: ${error.message}`);
        return {
            success: false,
            type: 'INVALID_DATA',
            message: error.message
        };
    }
};

module.exports = { getUserDetailsService };
