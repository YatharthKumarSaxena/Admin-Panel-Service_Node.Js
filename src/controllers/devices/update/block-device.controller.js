const { OK } = require("@/configs/http-status.config");
const { logWithTime } = require("@/utils/time-stamps.util");
const { DeviceModel } = require("@models/device.model");
const { throwDBResourceNotFoundError, throwConflictError, throwInternalServerError } = require("@utils/error-handler.util");

/* 🚫 Block Device */
const blockDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const {
            reason,
            reasonDetails
        } = req.body;

        if (deviceId === req.deviceId) {
            logWithTime(`❌ Admin ${req.admin.adminId} attempted to block their own device ${deviceId}`);
            return throwConflictError(res, "You cannot block the device you are currently using");
        }

        const adminId = req.admin.adminId; 

        const device = await DeviceModel.findOne({ deviceId });

        if (!device) {
            logWithTime(`❌ Device ${deviceId} not found for blocking`);
            return throwDBResourceNotFoundError(res, `Device with ID ${deviceId}`);
        }

        if (device.isBlocked) {
            logWithTime(`⚠️ Device ${deviceId} is already blocked`);
            return throwConflictError(res, `Device with ID ${deviceId} is already blocked`);
        }

        device.isBlocked = true;
        device.blockReason = reason;
        device.blockReasonDetails = reasonDetails || null;
        device.blockedBy = adminId;

        await device.save();

        logWithTime(`✅ Device ${deviceId} blocked by admin ${adminId}`);

        return res.status(OK).json({
            success: true,
            message: "Device blocked successfully"
        });

    } catch (error) {
        logWithTime(`❌ Internal Error in blocking device ${deviceId}`);
        return throwInternalServerError(res,error);
    }
};

module.exports = {
    blockDevice
};
