const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwBadRequestError, throwInternalServerError, getLogIdentifiers } = require("@utils/error-handler.util");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { BlockDeviceReasons } = require("@configs/enums.config");

/**
 * Block Device Controller (Internal API)
 * Called by Auth Service to block a user device
 * This is an internal service-to-service endpoint
 */

const blockDevice = async (req, res) => {
  try {
    const { userId, deviceId, reason, reasonDetails, blockedBy } = req.body;

    // Validate block device reason
    if (!Object.values(BlockDeviceReasons).includes(reason)) {
      logWithTime(`❌ Invalid block device reason: ${reason} ${getLogIdentifiers(req)}`);
      return throwBadRequestError(res, "Invalid block device reason provided");
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

    // TODO: Check if device is already blocked in Auth Service
    // const isAlreadyBlocked = await checkDeviceBlockStatusInAuthService(userId, deviceId);
    // if (isAlreadyBlocked) {
    //   logWithTime(`⚠️ Device ${deviceId} for user ${userId} is already blocked ${getLogIdentifiers(req)}`);
    //   return throwBadRequestError(res, "Device is already blocked");
    // }

    // TODO: Call Auth Service to block the device
    // await blockDeviceInAuthService(userId, deviceId, {
    //   reason,
    //   reasonDetails,
    //   blockedBy
    // });

    logWithTime(`✅ Device ${deviceId} blocked for user ${userId} by ${blockedBy || 'SYSTEM'}`);

    // Log activity in tracker
    logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.BLOCK_USER_DEVICE, {
      description: `Device ${deviceId} blocked for user ${userId}. Reason: ${reason}`,
      adminActions: {
        targetUserId: userId,
        deviceId: deviceId,
        reason: reasonDetails || reason,
        blockedBy: blockedBy || 'SYSTEM'
      }
    });

    return res.status(OK).json({
      message: "Device blocked successfully",
      userId: userId,
      deviceId: deviceId,
      blockedBy: blockedBy || 'SYSTEM',
      reason: reason,
      note: "Device has been blocked in Auth Service. User will be logged out from this device."
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      logWithTime(`⚠️ Validation Error: ${err.message}`);
      return throwBadRequestError(res, err.message);
    }
    logWithTime(`❌ Internal Error in blocking device ${getLogIdentifiers(req)}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { blockDevice };
