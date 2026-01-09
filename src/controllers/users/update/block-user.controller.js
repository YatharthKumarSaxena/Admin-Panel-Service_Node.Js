const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwNotFoundError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { BlockReasons } = require("@configs/enums.config");
const { notifyUserBlocked, notifyUserBlockedToSupervisor } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/**
 * Block User Controller
 * Blocks a user account with a specified reason
 */

const blockUser = async (req, res) => {
  try {
    const admin = req.admin;
    const { reason, reasonDetails } = req.body;

    // Validate block reason
    if (!Object.values(BlockReasons).includes(reason)) {
      logWithTime(`❌ Invalid block reason: ${reason} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Invalid block reason provided");
    }

    // Find user (assumed to be in req.foundUser by middleware)
    const user = req.foundUser;

    const userId = user.userId;
    
    // Check if already blocked
    if (user.isBlocked) {
      logWithTime(`⚠️ User ${userId} already blocked ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "User is already blocked");
    }

    // Block the user
    user.isBlocked = true;
    user.blockReason = reason;
    user.blockReasonDetails = reasonDetails;
    user.blockedBy = admin.adminId;
    user.updatedBy = admin.adminId;

    await user.save();

    // Send notifications
    await notifyUserBlocked(user, admin, reason, reasonDetails);
    
    // Notify supervisor if different from actor
    const supervisor = await fetchAdmin(null, null, admin.supervisorId);
    if(supervisor) {
      await notifyUserBlockedToSupervisor(supervisor, user, admin, reason, reasonDetails);
    }

    // Update isBlocked status in Auth Service and all other services
    logWithTime(`✅ User ${userId} blocked successfully by ${admin.adminId}`);

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.BLOCK_USER, {
      description: `User ${userId} blocked for reason: ${reason}`,
      adminActions: {
        targetId: userId,
        reason: reasonDetails
      }
    });

    return res.status(OK).json({
      message: "User blocked successfully",
      userId: userId,
      blockedBy: admin.adminId,
      reason: reason
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in blocking user ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { blockUser };
