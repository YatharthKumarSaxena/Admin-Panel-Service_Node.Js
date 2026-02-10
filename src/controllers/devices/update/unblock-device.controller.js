const { logWithTime } = require("@/utils/time-stamps.util");
const { unblockDeviceService } = require("@services/devices/update/unblock-device.service");
const { throwConflictError, throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { unblockDeviceSuccessResponse } = require("@/responses/success/index");
const { notifyUserDeviceUnblockedToSupervisor } = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");

/* ✅ Unblock Device */
const unblockDevice = async (req, res) => {
    try {
        const admin = req.admin;
        const { deviceId } = req.params;
        const { reason, reasonDetails } = req.body;

        // Check if unblocking own device
        if (deviceId === req.deviceId) {
            logWithTime(`❌ Admin ${admin.adminId} attempted to unblock their own device ${deviceId} ${getLogIdentifiers(req)}`);
            return throwConflictError(res, "You cannot unblock the device you are currently using");
        }

        // Call service (service will fetch device and handle all DB operations)
        const result = await unblockDeviceService(
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
            if (result.type === 'NOT_BLOCKED') {
                return throwConflictError(res, result.message);
            }
            return throwInternalServerError(res, result.message);
        }

        // Notify Supervisor using fetchAdmin utility
        try {
            if (admin.supervisorId) {
                const supervisor = await fetchAdmin(null, null, admin.supervisorId);
                if (supervisor) {
                    await notifyUserDeviceUnblockedToSupervisor(
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
        return unblockDeviceSuccessResponse(res, result.data, admin);

    } catch (error) {
        logWithTime(`❌ Internal Error in unblockDevice controller ${getLogIdentifiers(req)}: ${error.message}`);
        return throwInternalServerError(res, error);
    }
};

module.exports = {
    unblockDevice
};