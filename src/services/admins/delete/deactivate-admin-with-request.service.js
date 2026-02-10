// DEACTIVATE ADMIN WITH REQUEST MANAGEMENT SERVICE

const { AdminModel } = require("@models/admin.model");
const { AdminStatusRequestModel } = require("@models/admin-status-request.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes, requestStatus, requestType, AdminType } = require("@configs/enums.config");
const { 
    notifyAdminDeactivated, 
    notifyDeactivationConfirmation, 
    notifyDeactivationToSupervisor 
} = require("@utils/admin-notifications.util");
const { fetchAdmin } = require("@/utils/fetch-admin.util");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Deactivate Admin with Request Management Service
 * @param {Object} targetAdmin - The admin to deactivate (from req with .lean())
 * @param {Object} deactivatorAdmin - The admin performing deactivation
 * @param {string} deactivationReason - Reason for deactivation
 * @param {Object} device - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const deactivateAdminWithRequestService = async (targetAdmin, deactivatorAdmin, deactivationReason, device, requestId) => {
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

        // Check if already inactive
        if (targetAdmin.isActive === false) {
            return {
                success: false,
                type: AdminErrorTypes.ALREADY_INACTIVE,
                message: "Admin is already inactive"
            };
        }

        // Handle existing pending requests
        const existingRequest = await AdminStatusRequestModel.findOne({
            targetAdminId: targetAdmin.adminId,
            status: requestStatus.PENDING,
            requestType: { $in: [requestType.DEACTIVATION, requestType.ACTIVATION] }
        }).lean();

        if (existingRequest) {
            const newStatus = existingRequest.requestType === requestType.DEACTIVATION 
                ? requestStatus.APPROVED 
                : requestStatus.REJECTED;

            await AdminStatusRequestModel.findOneAndUpdate(
                { _id: existingRequest._id },
                {
                    $set: {
                        status: newStatus,
                        reviewedBy: deactivatorAdmin.adminId,
                        reviewedAt: new Date(),
                        reviewNotes: `Auto-processed: Admin directly deactivated by Super Admin ${deactivatorAdmin.adminId}`
                    }
                },
                { new: true, runValidators: true }
            );
        }

        // Atomic deactivation - MUST use findOneAndUpdate because targetAdmin is .lean()
        const updatedAdmin = await AdminModel.findOneAndUpdate(
            { _id: targetAdmin._id, isActive: true },
            {
                $set: {
                    isActive: false,
                    deactivatedBy: deactivatorAdmin.adminId,
                    deactivatedReason: deactivationReason,
                    updatedBy: deactivatorAdmin.adminId
                }
            },
            { new: true }
        );

        if (!updatedAdmin) {
            return {
                success: false,
                type: AdminErrorTypes.ALREADY_INACTIVE,
                message: "Admin already deactivated by another process"
            };
        }

        logWithTime(`✅ Admin deactivated in DB: ${updatedAdmin.adminId} by ${deactivatorAdmin.adminId}`);

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldAdminData, updatedAdmin);

        // Send notifications
        await notifyAdminDeactivated(updatedAdmin, deactivatorAdmin, deactivationReason);
        await notifyDeactivationConfirmation(deactivatorAdmin, updatedAdmin);
        
        // Notify supervisor if exists
        const supervisor = await fetchAdmin(updatedAdmin.supervisorId);
        if (supervisor) {
            await notifyDeactivationToSupervisor(supervisor, updatedAdmin, deactivatorAdmin);
        }

        // Determine event type
        const eventType = updatedAdmin.adminType === AdminType.MID_ADMIN
            ? ACTIVITY_TRACKER_EVENTS.DEACTIVATE_MID_ADMIN
            : ACTIVITY_TRACKER_EVENTS.DEACTIVATE_ADMIN;

        // Log activity
        logActivityTrackerEvent(
            deactivatorAdmin,
            device,
            requestId,
            eventType,
            `Admin ${updatedAdmin.adminId} directly deactivated by Super Admin`,
            { 
                oldData,
                newData,
                adminActions: { 
                    targetId: updatedAdmin.adminId, 
                    reason: deactivationReason 
                } 
            }
        );

        return {
            success: true,
            data: updatedAdmin
        };

    } catch (error) {
        logWithTime(`❌ Deactivate admin with request service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { deactivateAdminWithRequestService };
