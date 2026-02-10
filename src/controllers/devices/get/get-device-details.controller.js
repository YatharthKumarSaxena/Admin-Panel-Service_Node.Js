const { logWithTime } = require("@utils/time-stamps.util");
const { throwInternalServerError, getLogIdentifiers } = require("@/responses/common/error-handler.response");
const { getDeviceDetailsService } = require("@services/devices/get/get-device-details.service");
const { viewDeviceDetailsSuccessResponse } = require("@/responses/success/index");

/**
 * View Device Details Controller
 * Retrieves comprehensive details of a device
 */

const viewDeviceDetails = async (req, res) => {
    try {
        const admin = req.admin;
        const { deviceId, reason } = req.params;

        // Call service (service will fetch device and handle not found)
        const result = await getDeviceDetailsService(
            deviceId,
            admin,
            req.device,
            req.requestId
        );

        // Handle service errors
        if (!result.success) {
            if (result.type === 'NOT_FOUND') {
                const { throwDBResourceNotFoundError } = require("@/responses/common/error-handler.response");
                return throwDBResourceNotFoundError(res, result.message);
            }
            return throwInternalServerError(res, result.message);
        }

        // Success response
        return viewDeviceDetailsSuccessResponse(res, result.data, admin);

    } catch (err) {
        logWithTime(`❌ Internal Error in viewDeviceDetails controller ${getLogIdentifiers(req)}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { viewDeviceDetails };
