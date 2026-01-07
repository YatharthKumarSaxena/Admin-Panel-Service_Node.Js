const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");

/**
 * View Admin Details Controller
 * Retrieves comprehensive details of an admin
 */

const viewUserDetails = async (req, res) => {
    try {
        const actor = req.admin;
        const { reason } = req.params;

        const targetUser = req.foundUser;

        logWithTime(`🔍 Admin ${actor.adminId} viewing details of ${targetUser.userId}`);

        // Prepare sanitized user details
        const userDetails = {
            userId: targetUser.userId,
            email: targetUser.email || null,
            fullPhoneNumber: targetUser.fullPhoneNumber || null,
            isBlocked: targetUser.isBlocked,
            blockedCount: targetUser.blockCount,
            unblockedCount: targetUser.unblockCount,
            blockedAt: targetUser.blockedAt || null,
            unblockedAt: targetUser.unblockedAt || null,
            createdAt: targetUser.createdAt,
            updatedAt: targetUser.updatedAt,
            blockReason: targetUser.blockReason || null,
            unblockReason: targetUser.unblockReason || null,
            blockReasonDetails: targetUser.blockReasonDetails || null,
            unblockReasonDetails: targetUser.unblockReasonDetails || null,
            blockedBy: targetUser.blockedBy || null,
            unblockedBy: targetUser.unblockedBy || null
        };

        logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.VIEW_USER_DETAILS, {
            description: `Admin ${actor.adminId} viewed details of ${targetUser.userId}`,
            adminActions: {
                targetUserId: targetUser.userId,
                reason: reason
            }
        });

        return res.status(OK).json({
            message: "User details retrieved successfully",
            data: userDetails,
            viewedBy: actor.adminId
        });

    } catch (err) {
        logWithTime(`❌ Internal Error in viewing user details ${getLogIdentifiers(req)}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { viewUserDetails };
