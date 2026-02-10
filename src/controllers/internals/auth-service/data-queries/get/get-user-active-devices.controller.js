const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { getUserActiveDevicesSuccessResponse } = require("@/responses/success/internal.response");

/**
 * Get User Active Devices Controller
 * Retrieves list of active devices/sessions for a user from Auth Service
 * 
 * NOTE: This will require integration with Authentication Service API
 */
const getUserActiveDevices = async (req, res) => {
  try {
    const admin = req.admin;
    const { reason } = req.params;

    const user = req.foundUser;

    const userId = user.userId;

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

    logWithTime(`✅ Admin ${admin.adminId} retrieved active devices for user ${userId}`);

    return getUserActiveDevicesSuccessResponse(res, activeDevices);

  } catch (err) {
    logWithTime(`❌ Internal Error in fetching active devices ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { getUserActiveDevices };
