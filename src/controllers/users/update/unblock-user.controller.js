const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { UnblockReasons } = require("@configs/enums.config");
const { notifyUserUnblocked, notifyUserUnblockedToSupervisor } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Unblock User Controller
 * Unblocks a previously blocked user account
 */
const unblockUser = async (req, res) => {
  try {
    const admin = req.admin;
    const { reason, reasonDetails } = req.body;

    // Validate unblock reason
    if (!Object.values(UnblockReasons).includes(reason)) {
      logWithTime(`❌ Invalid unblock reason: ${reason} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Invalid unblock reason provided");
    }

    // Find user (assumed to be in req.foundUser by middleware)
    const user = req.foundUser;

    const userId = user.userId;
    
    // Check if user is actually blocked
    if (!user.isBlocked) {
      logWithTime(`⚠️ User ${userId} is not blocked ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "User is not blocked");
    }

    // Unblock the user
    user.isBlocked = false;
    user.unblockReason = reason;
    user.unblockReasonDetails = reasonDetails;
    user.unblockedBy = admin.adminId;
    user.updatedBy = admin.adminId;

    await user.save();

    logWithTime(`✅ User ${userId} unblocked successfully by ${admin.adminId}`);

    // Send notifications
    await notifyUserUnblocked(user, admin, reason);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, admin.supervisorId);
    if(supervisor) {
      await notifyUserUnblockedToSupervisor(supervisor, user, admin, reason, reasonDetails);
    }

    // Update isBlocked status in Auth Service and all other services
    
    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.UNBLOCK_USER, {
      description: `User ${userId} unblocked for reason: ${reason}`,
      adminActions: {
        targetId: userId,
        reason: reasonDetails
      }
    });

    return res.status(OK).json({
      message: "User unblocked successfully",
      userId: userId,
      unblockedBy: admin.adminId,
      reason: reason
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in unblocking user ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { unblockUser };
