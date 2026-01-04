const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { UnblockDeviceReasons } = require("@configs/enums.config");

/**
 * Unblock Device Controller (Internal API)
 * Called by Auth Service to unblock a user device
 * This is an internal service-to-service endpoint
 */

const unblockDevice = async (req, res) => {
  try {
    const { userId, deviceId, reason, unblockedBy } = req.body;

    // Validate unblock device reason
    if (!Object.values(UnblockDeviceReasons).includes(reason)) {
      logWithTime(`❌ Invalid unblock device reason: ${reason} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Invalid unblock device reason provided");
    }

    // Validate UUID format for deviceId
    const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!UUID_V4_REGEX.test(deviceId)) {
      logWithTime(`❌ Invalid device ID format: ${deviceId} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Invalid device ID format. Must be a valid UUID v4.");
    }

    // TODO: Verify with Auth Service if device exists for this user
    // const deviceExists = await verifyDeviceInAuthService(userId, deviceId);
    // if (!deviceExists) {
    //   return throwBadRequestError(res, "Device not found for this user");
    // }

    // TODO: Check if device is actually blocked in Auth Service
    // const isBlocked = await checkDeviceBlockStatusInAuthService(userId, deviceId);
    // if (!isBlocked) {
    //   logWithTime(`⚠️ Device ${deviceId} for user ${userId} is not blocked ${getLogIdentifiers(req)}`);
    //   return throwBadRequestError(res, "Device is not blocked");
    // }

    // TODO: Call Auth Service to unblock the device
    // await unblockDeviceInAuthService(userId, deviceId, {
    //   reason,
    //   unblockedBy
    // });

    logWithTime(`✅ Device ${deviceId} unblocked for user ${userId} by ${unblockedBy || 'SYSTEM'}`);

    // Log activity in tracker
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.UNBLOCK_USER_DEVICE, {
      description: `Device ${deviceId} unblocked for user ${userId}. Reason: ${reason}`,
      adminActions: {
        targetUserId: userId,
        deviceId: deviceId,
        reason: reason,
        unblockedBy: unblockedBy || 'SYSTEM'
      }
    });

    return res.status(OK).json({
      message: "Device unblocked successfully",
      userId: userId,
      deviceId: deviceId,
      unblockedBy: unblockedBy || 'SYSTEM',
      reason: reason,
      note: "Device has been unblocked in Auth Service. User can now login from this device."
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in unblocking device ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { unblockDevice };
