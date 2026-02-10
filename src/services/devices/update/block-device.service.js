// BLOCK DEVICE SERVICE

const { DeviceModel } = require("@models/device.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Block Device Service
 * @param {string} deviceId - The device ID to block
 * @param {Object} admin - The admin performing the block
 * @param {string} reason - Reason for blocking
 * @param {string} reasonDetails - Detailed reason
 * @param {Object} requestDevice - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const blockDeviceService = async (deviceId, admin, reason, reasonDetails, requestDevice, requestId) => {
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

        // Check if already blocked
        if (device.isBlocked) {
            return {
                success: false,
                type: 'ALREADY_BLOCKED',
                message: 'Device is already blocked'
            };
        }

        // Atomic update using findOneAndUpdate
        const updatedDevice = await DeviceModel.findOneAndUpdate(
            { _id: device._id, isBlocked: false },
            {
                $set: {
                    isBlocked: true,
                    blockReason: reason,
                    blockReasonDetails: reasonDetails || null,
                    blockedBy: admin.adminId,
                    blockedAt: new Date()
                },
                $inc: { blockCount: 1 }
            },
            { new: true, runValidators: true }
        );

        if (!updatedDevice) {
            return {
                success: false,
                type: 'ALREADY_BLOCKED',
                message: 'Device already blocked by another process'
            };
        }

        logWithTime(`✅ Device ${updatedDevice.deviceId} blocked by admin ${admin.adminId}`);

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldDeviceData, updatedDevice);

        // Log activity
        logActivityTrackerEvent(
            admin,
            requestDevice,
            requestId,
            ACTIVITY_TRACKER_EVENTS.DEVICE_BLOCKED,
            `Blocked device ${updatedDevice.deviceId} for reason: ${reason}`,
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
        logWithTime(`❌ Block device service error: ${error.message}`);
        return {
            success: false,
            type: 'INVALID_DATA',
            message: error.message
        };
    }
};

module.exports = { blockDeviceService };
