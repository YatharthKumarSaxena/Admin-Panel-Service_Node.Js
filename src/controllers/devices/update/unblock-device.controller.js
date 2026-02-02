const { OK } = require("@/configs/http-status.config");
const { logWithTime } = require("@/utils/time-stamps.util");
const { DeviceModel } = require("@models/device.model");
const { AdminModel } = require("@models/admin.model");
const { throwDBResourceNotFoundError, throwConflictError, throwInternalServerError } = require("@/responses/common/error-handler.response");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { notifyUserDeviceUnblockedToSupervisor } = require("@utils/admin-notifications.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@/configs/tracker.config");

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

        // Activity Tracking
        logActivityTrackerEvent(req, ACTIVITY_TRACKER_EVENTS.DEVICE_UNBLOCKED, {
            adminActions: {
                targetId: deviceId,
                reason: reason,
            },
            description: `Admin ${adminId} unblocked device ${deviceId}`,
            oldData: { isBlocked: true },
            newData: { isBlocked: false, unblockReason: reason, unblockedBy: adminId }
        });

        // Notify Supervisor
        try {
            const admin = req.admin;
            if (admin.supervisor) {
                const supervisor = await AdminModel.findOne({ adminId: admin.supervisor });
                if (supervisor) {
                    // Get device owner if exists
                    const deviceOwner = device.owner ? await require("@models/user.model").UserModel.findById(device.owner) : null;
                    
                    await notifyUserDeviceUnblockedToSupervisor(
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
            logWithTime(`⚠️ Failed to notify supervisor about device unblock: ${notifyError.message}`);
        }

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