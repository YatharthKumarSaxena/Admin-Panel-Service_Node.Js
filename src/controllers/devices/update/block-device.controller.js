const { logWithTime } = require("@/utils/time-stamps.util");
const { blockDeviceService } = require("@services/devices/update/block-device.service");
const { throwConflictError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { blockDeviceSuccessResponse } = require("@/responses/success/index");
const { notifyUserDeviceBlockedToSupervisor } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/* 🚫 Block Device */
const blockDevice = async (req, res) => {
    try {
        const admin = req.admin;
        const { deviceId } = req.params;
        const { reason, reasonDetails } = req.body;

        // Check if blocking own device
        if (deviceId === req.deviceId) {
            logWithTime(`❌ Admin ${admin.adminId} attempted to block their own device ${deviceId} ${getLogIdentifiers(req)}`);
            return throwConflictError(res, "You cannot block the device you are currently using");
        }

        // Call service (service will fetch device and handle all DB operations)
        const result = await blockDeviceService(
            deviceId,
            admin,
            reason,
            reasonDetails,
            req.device,
            req.requestId
        );

        // Handle service errors
        if (!result.success) {
            if (result.type === 'NOT_FOUND') {
                const { throwDBResourceNotFoundError } = require("@/responses/common/error-handler.response");
                return throwDBResourceNotFoundError(res, result.message);
            }
            if (result.type === 'ALREADY_BLOCKED') {
                return throwConflictError(res, result.message);
            }
            return throwInternalServerError(res, result.message);
        }

        // Notify Supervisor using fetchAdmin utility
        try {
            if (admin.supervisorId) {
                const supervisor = await fetchAdmin(null, null, admin.supervisorId);
                if (supervisor) {
                    await notifyUserDeviceBlockedToSupervisor(
                        supervisor,
                        { userId: 'N/A', email: 'N/A', fullPhoneNumber: 'N/A' },
                        deviceId,
                        admin,
                        reason,
                        reasonDetails
                    );
                }
            }
        } catch (notifyError) {
            logWithTime(`⚠️ Failed to notify supervisor: ${notifyError.message}`);
        }

        // Success response
        return blockDeviceSuccessResponse(res, result.data, admin);

    } catch (error) {
        logWithTime(`❌ Internal Error in blockDevice controller ${getLogIdentifiers(req)}: ${error.message}`);
        return throwInternalServerError(res, error);
    }
};

module.exports = {
    blockDevice
};
