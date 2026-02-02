const { OK } = require("@/configs/http-status.config");
const { logWithTime } = require("@/utils/time-stamps.util");
const { DeviceModel } = require("@models/device.model");
const { AdminModel } = require("@models/admin.model");
const { throwDBResourceNotFoundError, throwConflictError, throwInternalServerError } = require("@/responses/common/error-handler.response");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { notifyUserDeviceBlockedToSupervisor } = require("@utils/admin-notifications.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@/configs/tracker.config");

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

        // Activity Tracking
        logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.DEVICE_BLOCKED, {
            adminActions: {
                targetId: deviceId,
                reason: reason,
            },
            description: `Admin ${adminId} blocked device ${deviceId}`,
            oldData: { isBlocked: false },
            newData: { isBlocked: true, blockReason: reason, blockedBy: adminId }
        });

        // Notify Supervisor
        try {
            const admin = req.admin;
            if (admin.supervisor) {
                const supervisor = await AdminModel.findOne({ adminId: admin.supervisor });
                if (supervisor) {
                    // Get device owner if exists
                    const deviceOwner = device.owner ? await require("@models/user.model").UserModel.findById(device.owner) : null;
                    
                    await notifyUserDeviceBlockedToSupervisor(
                        supervisor,
                        deviceOwner || { userId: 'N/A', email: 'N/A', fullPhoneNumber: 'N/A' },
                        deviceId,
                        admin,
                        reason,
                        reasonDetails
                    );
                }
            }
        } catch (notifyError) {
            logWithTime(`⚠️ Failed to notify supervisor about device block: ${notifyError.message}`);
        }

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
