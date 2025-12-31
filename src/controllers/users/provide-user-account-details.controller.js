const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers, throwNotFoundError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");

/**
 * Provide User Account Details Controller
 * Returns comprehensive user account information
 */
const provideUserAccountDetails = async (req, res) => {
  try {
    const admin = req.admin;
    const { userId } = req.params;

    const user = req.foundUser;
    
    if (!user) {
      logWithTime(`❌ User not found ${getLogIdentifiers(req)}`);
      return throwNotFoundError(res, "User not found");
    }

    logWithTime(`🔍 Admin ${admin.adminId} accessing account details for user ${userId}`);

    // Prepare sanitized user details (exclude sensitive fields if needed)
    const userDetails = {
      userId: user.userId,
      email: user.email || null,
      fullPhoneNumber: user.fullPhoneNumber || null,
      isActive: user.isActive,
      isBlocked: user.isBlocked || false,
      blockReason: user.blockReason || null,
      blockReasonDetails: user.blockReasonDetails || null,
      blockedAt: user.blockedAt || null,
      blockedBy: user.blockedBy || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdBy: user.createdBy || null,
      lastLoginAt: user.lastLoginAt || null,
      // Add other fields as per your User model
    };

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.PROVIDE_USER_ACCOUNT_DETAILS, {
      description: `Admin ${admin.adminId} viewed account details for user ${userId}`,
      adminActions: {
        targetUserId: userId,
        reason: req.body?.reason || "Account verification"
      }
    });

    return res.status(OK).json({
      message: "User account details retrieved successfully",
      data: userDetails,
      accessedBy: admin.adminId
    });

  } catch (err) {
    logWithTime(`❌ Internal Error in providing user details ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { provideUserAccountDetails };
