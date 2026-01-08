const { OK } = require("@/configs/http-status.config");
const { logWithTime } = require("@/utils/time-stamps.util");
const { DeviceModel } = require("@models/device.model");
const { throwDBResourceNotFoundError, throwConflictError, throwInternalServerError } = require("@utils/error-handler.util");

/* ✅ Unblock Device */
const unblockDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const {
            reason,
            reasonDetails
        } = req.body;

        if (deviceId === req.deviceId) {
            logWithTime(`❌ Admin ${req.admin.adminId} attempted to unblock their own device ${deviceId}`);
            return throwConflictError(res, "You cannot unblock the device you are currently using");
        }

        const adminId = req.admin.adminId;

        const device = await DeviceModel.findOne({ deviceId });

        if (!device) {
            logWithTime(`❌ Device ${deviceId} not found for unblocking`);
            return throwDBResourceNotFoundError(res, `Device with ID ${deviceId}`);
        }

        if (!device.isBlocked) {
            logWithTime(`⚠️ Device ${deviceId} is not blocked`);
            return throwConflictError(res, `Device with ID ${deviceId} is not blocked`);
        }

        device.isBlocked = false;
        device.unblockReason = reason;
        device.unblockReasonDetails = reasonDetails || null;
        device.unblockedBy = adminId;

        await device.save();

        logWithTime(`✅ Device ${deviceId} unblocked by admin ${adminId}`);

        return res.status(OK).json({
            success: true,
            message: "Device unblocked successfully"
        });

    } catch (error) {
        logWithTime(`❌ Internal Error in unblocking device ${deviceId}`);
        return throwInternalServerError(res,error);
    }
};

module.exports = {
    unblockDevice
};