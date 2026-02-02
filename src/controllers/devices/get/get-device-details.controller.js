const { logWithTime } = require("@utils/time-stamps.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { throwInternalServerError, getLogIdentifiers, throwDBResourceNotFoundError } = require("@/responses/common/error-handler.response");
const { OK } = require("@configs/http-status.config");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { DeviceModel } = require("@models/index");

/**
 * View Admin Details Controller
 * Retrieves comprehensive details of an admin
 */

const viewDeviceDetails = async (req, res) => {
    try {
        const actor = req.admin;
        const { deviceId, reason } = req.params;

        const device = await DeviceModel.findOne({ deviceId: deviceId });

        if (!device) {
            logWithTime(`❌ Device ${deviceId} not found ${getLogIdentifiers(req)}`);
            return throwDBResourceNotFoundError(res, `Device with ID ${deviceId}`);
        }

        logWithTime(`🔍 Admin ${actor.adminId} viewing details of device ${deviceId}`);

        // Prepare sanitized device details
        const deviceDetails = {
            deviceId: device.deviceId,
            deviceType: device.deviceType,
            deviceName: device.deviceName,
            isVerified: device.isVerified,
            createdAt: device.createdAt,
            updatedAt: device.updatedAt,
            isBlocked: device.isBlocked,
            blockReason: device.blockReason,
            blockReasonDetails: device.blockReasonDetails,
            blockedBy: device.blockedBy,
            blockCount: device.blockCount,
            unblockReason: device.unblockReason,
            unblockReasonDetails: device.unblockReasonDetails,
            unblockedBy: device.unblockedBy,
            unblockCount: device.unblockCount,
            blockedAt: device.blockedAt,
            unblockedAt: device.unblockedAt
        };

        logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.VIEW_DEVICE_DETAILS, {
            description: `Admin ${actor.adminId} viewed details of device ${deviceId}`,
            adminActions: {
                targetId: deviceId,
                reason: reason
            }
        });


        return res.status(OK).json({
            message: "Device details retrieved successfully",
            data: deviceDetails,
            viewedBy: actor.adminId
        });

    } catch (err) {
        logWithTime(`❌ Internal Error in viewing device details ${getLogIdentifiers(req)}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { viewDeviceDetails };
