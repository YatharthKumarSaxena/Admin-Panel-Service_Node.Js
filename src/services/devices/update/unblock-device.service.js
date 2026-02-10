// UNBLOCK DEVICE SERVICE

const { DeviceModel } = require("@models/device.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Unblock Device Service
 * @param {string} deviceId - The device ID to unblock
 * @param {Object} admin - The admin performing the unblock
 * @param {string} reason - Reason for unblocking
 * @param {string} reasonDetails - Detailed reason
 * @param {Object} requestDevice - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const unblockDeviceService = async (deviceId, admin, reason, reasonDetails, requestDevice, requestId) => {
    try {
        // Fetch device first
        const device = await DeviceModel.findOne({ deviceId }).lean();

        if (!device) {
            return {
                success: false,
                type: 'NOT_FOUND',
                message: 'Device not found'
            };
        }

        // Clone for audit before changes
        const oldDeviceData = cloneForAudit(device);

        // Check if not blocked
        if (!device.isBlocked) {
            return {
                success: false,
                type: 'NOT_BLOCKED',
                message: 'Device is not blocked'
            };
        }

        // Atomic update using findOneAndUpdate
        const updatedDevice = await DeviceModel.findOneAndUpdate(
            { _id: device._id, isBlocked: true },
            {
                $set: {
                    isBlocked: false,
                    unblockReason: reason,
                    unblockReasonDetails: reasonDetails || null,
                    unblockedBy: admin.adminId,
                    unblockedAt: new Date()
                },
                $inc: { unblockCount: 1 }
            },
            { new: true, runValidators: true }
        );

        if (!updatedDevice) {
            return {
                success: false,
                type: 'NOT_BLOCKED',
                message: 'Device already unblocked by another process'
            };
        }

        logWithTime(`✅ Device ${updatedDevice.deviceId} unblocked by admin ${admin.adminId}`);

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldDeviceData, updatedDevice);

        // Log activity
        logActivityTrackerEvent(
            admin,
            requestDevice,
            requestId,
            ACTIVITY_TRACKER_EVENTS.DEVICE_UNBLOCKED,
            `Unblocked device ${updatedDevice.deviceId} for reason: ${reason}`,
            {
                oldData,
                newData,
                adminActions: {
                    targetId: updatedDevice.deviceId,
                    reason: reason
                }
            }
        );

        return {
            success: true,
            data: updatedDevice
        };

    } catch (error) {
        logWithTime(`❌ Unblock device service error: ${error.message}`);
        return {
            success: false,
            type: 'INVALID_DATA',
            message: error.message
        };
    }
};

module.exports = { unblockDeviceService };
