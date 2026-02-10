// DEACTIVATE ADMIN SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes } = require("@configs/enums.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Deactivate Admin Service
 * @param {Object} targetAdmin - The admin to deactivate
 * @param {Object} deactivatorAdmin - The admin performing deactivation
 * @param {string} deactivationReason - Reason for deactivation
 * @param {Object} device - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const deactivateAdminService = async (targetAdmin, deactivatorAdmin, deactivationReason, device, requestId) => {
    try {
        // Check if already inactive
        if (targetAdmin.isActive === false) {
            return {
                success: false,
                type: AdminErrorTypes.ALREADY_INACTIVE,
                message: "Admin is already deactivated"
            };
        }

        // Clone for audit before changes
        const oldAdminData = cloneForAudit(targetAdmin);

        // Atomic deactivation using findOneAndUpdate
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

        logWithTime(`✅ Admin deactivated in DB: ${updatedAdmin.adminId}`);

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldAdminData, updatedAdmin);

        // Log activity
        logActivityTrackerEvent(
            deactivatorAdmin,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.ADMIN_DEACTIVATED,
            `Deactivated admin ${updatedAdmin.adminId}`,
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
        logWithTime(`❌ Deactivate admin service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { deactivateAdminService };
