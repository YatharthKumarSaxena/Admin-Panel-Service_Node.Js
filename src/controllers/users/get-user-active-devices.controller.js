const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers, throwNotFoundError } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");

/**
 * Get User Active Devices Controller
 * Retrieves list of active devices/sessions for a user from Auth Service
 * 
 * NOTE: This will require integration with Authentication Service API
 */
const getUserActiveDevices = async (req, res) => {
  try {
    const admin = req.admin;
    const { userId } = req.params;

    const user = req.foundUser;
    
    if (!user) {
      logWithTime(`❌ User not found for active devices ${getLogIdentifiers(req)}`);
      return throwNotFoundError(res, "User not found");
    }

    logWithTime(`🔍 Admin ${admin.adminId} fetching active devices for user ${userId}`);

    // TODO: Make API call to Authentication Service to fetch active devices/sessions
    // const activeDevices = await fetchActiveDevicesFromAuthService(userId);

    // Placeholder response (to be replaced with actual Auth Service integration)
    const activeDevices = {
      userId: userId,
      totalActiveDevices: 0,
      devices: [],
      message: "Auth Service integration pending"
    };

    // Log activity
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.GET_USER_ACTIVE_DEVICES, {
      description: `Admin ${admin.adminId} retrieved active devices for user ${userId}`,
      adminActions: {
        targetUserId: userId,
        reason: req.body?.reason || "Security audit"
      }
    });

    return res.status(OK).json({
      message: "Active devices retrieved successfully",
      data: activeDevices,
      checkedBy: admin.adminId
    });

  } catch (err) {
    logWithTime(`❌ Internal Error in fetching active devices ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { getUserActiveDevices };
