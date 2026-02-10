// ACTIVATE ADMIN WITH REQUEST MANAGEMENT SERVICE

const { AdminModel } = require("@models/admin.model");
const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes, requestStatus, requestType, AdminType } = require("@configs/enums.config");
const { 
    notifyAdminActivated, 
    notifyActivationConfirmation, 
    notifyActivationToSupervisor 
} = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Activate Admin with Request Management Service
 * @param {Object} targetAdmin - The admin to activate (from req with .lean())
 * @param {Object} activatorAdmin - The admin performing activation
 * @param {string} activationReason - Reason for activation
 * @param {Object} device - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const activateAdminWithRequestService = async (targetAdmin, activatorAdmin, activationReason, device, requestId) => {
    try {
        // Clone for audit before changes
        const oldAdminData = cloneForAudit(targetAdmin);

        // Check if Super Admin
        if (targetAdmin.adminType === AdminType.SUPER_ADMIN) {
            return {
                success: false,
                type: AdminErrorTypes.UNAUTHORIZED,
                message: "Cannot activate or deactivate a Super Admin"
            };
        }

        // Check if already active
        if (targetAdmin.isActive === true) {
            return {
                success: false,
                type: AdminErrorTypes.ALREADY_ACTIVE,
                message: "Admin is already active"
            };
        }

        // Handle existing pending requests
        const existingRequest = await AdminStatusRequestModel.findOne({
            targetAdminId: targetAdmin.adminId,
            requestType: { $in: [requestType.ACTIVATION, requestType.DEACTIVATION] },
            status: requestStatus.PENDING
        }).lean();

        if (existingRequest) {
            const newStatus = existingRequest.requestType === requestType.ACTIVATION 
                ? requestStatus.APPROVED 
                : requestStatus.REJECTED;

            await AdminStatusRequestModel.findOneAndUpdate(
                { _id: existingRequest._id },
                {
                    $set: {
                        status: newStatus,
                        reviewedBy: activatorAdmin.adminId,
                        reviewedAt: new Date(),
                        reviewNotes: `Auto-processed: Admin directly activated by Super Admin ${activatorAdmin.adminId}`
                    }
                },
                { new: true, runValidators: true }
            );
        }

        // Atomic activation - MUST use findOneAndUpdate because targetAdmin is .lean()
        const updatedAdmin = await AdminModel.findOneAndUpdate(
            { _id: targetAdmin._id, isActive: false },
            {
                $set: {
                    isActive: true,
                    activatedBy: activatorAdmin.adminId,
                    activatedReason: activationReason,
                    updatedBy: activatorAdmin.adminId
                }
            },
            { new: true }
        );

        if (!updatedAdmin) {
            return {
                success: false,
                type: AdminErrorTypes.ALREADY_ACTIVE,
                message: "Admin already activated by another process"
            };
        }

        logWithTime(`✅ Admin activated in DB: ${updatedAdmin.adminId} by ${activatorAdmin.adminId}`);

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldAdminData, updatedAdmin);

        // Send notifications
        await notifyAdminActivated(updatedAdmin, activatorAdmin);
        await notifyActivationConfirmation(activatorAdmin, updatedAdmin);
        
        // Notify supervisor if exists
        const supervisor = await fetchAdmin(updatedAdmin.supervisorId);
        if (supervisor) {
            await notifyActivationToSupervisor(supervisor, updatedAdmin, activatorAdmin);
        }

        // Determine event type
        const eventType = updatedAdmin.adminType === AdminType.MID_ADMIN 
            ? ACTIVITY_TRACKER_EVENTS.ACTIVATE_MID_ADMIN 
            : ACTIVITY_TRACKER_EVENTS.ACTIVATE_ADMIN;

        // Log activity
        logActivityTrackerEvent(
            activatorAdmin,
            device,
            requestId,
            eventType,
            `Admin ${updatedAdmin.adminId} directly activated by Super Admin`,
            { 
                oldData,
                newData,
                adminActions: { 
                    targetId: updatedAdmin.adminId, 
                    reason: activationReason 
                } 
            }
        );

        return {
            success: true,
            data: updatedAdmin
        };

    } catch (error) {
        logWithTime(`❌ Activate admin with request service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { activateAdminWithRequestService };
