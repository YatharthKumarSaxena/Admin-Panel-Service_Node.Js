// GET DEVICE DETAILS SERVICE

const { DeviceModel } = require("@models/device.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");

/**
 * Get Device Details Service
 * @param {string} deviceId - The device ID to fetch
 * @param {Object} viewer - The admin viewing the details
 * @param {Object} device - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const getDeviceDetailsService = async (deviceId, viewer, device, requestId) => {
    try {
        const deviceDetails = await DeviceModel.findOne({ deviceId })
            .select('-__v')
            .lean();

        if (!deviceDetails) {
            return {
                success: false,
                type: 'NOT_FOUND',
                message: 'Device not found'
            };
        }

        // Log activity tracker event
        logActivityTrackerEvent(
            viewer,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.VIEW_DEVICE_DETAILS,
            `Viewed details of device ${deviceId}`,
            {
                adminActions: {
                    targetId: deviceId
                }
            }
        );

        logWithTime(`✅ Admin ${viewer.adminId} viewed details of device ${deviceId}`);

        return {
            success: true,
            data: deviceDetails
        };

    } catch (error) {
        logWithTime(`❌ Get device details service error: ${error.message}`);
        return {
            success: false,
            type: 'INVALID_DATA',
            message: error.message
        };
    }
};

module.exports = { getDeviceDetailsService };
