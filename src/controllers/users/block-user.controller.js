const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers, throwNotFoundError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { BlockReasons } = require("@configs/enums.config");

/**
 * Block User Controller
 * Blocks a user account with a specified reason
 */
const blockUser = async (req, res) => {
  try {
    const admin = req.admin;
    const { userId, reason, reasonDetails } = req.body;

    // Validate block reason
    if (!Object.values(BlockReasons).includes(reason)) {
      logWithTime(`❌ Invalid block reason: ${reason} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Invalid block reason provided");
    }

    // Find user (assumed to be in req.foundUser by middleware)
    const user = req.foundUser;
    
    if (!user) {
      logWithTime(`❌ User not found for blocking ${getLogIdentifiers(req)}`);
      return throwNotFoundError(res, "User not found");
    }

    // Check if already blocked
    if (user.isBlocked) {
      logWithTime(`⚠️ User ${userId} already blocked ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "User is already blocked");
    }

    // Block the user
    user.isBlocked = true;
    user.blockReason = reason;
    user.blockReasonDetails = reasonDetails || null;
    user.blockedAt = new Date();
    user.blockedBy = admin.adminId;
    user.updatedBy = admin.adminId;

    await user.save();

    logWithTime(`✅ User ${userId} blocked successfully by ${admin.adminId}`);

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.BLOCK_USER, {
      description: `User ${userId} blocked for reason: ${reason}`,
      adminActions: {
        targetUserId: userId,
        reason: reason,
        reasonDetails: reasonDetails || "No additional details provided"
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
