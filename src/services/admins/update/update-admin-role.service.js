// UPDATE ADMIN ROLE SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes } = require("@configs/enums.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Update Admin Role Service
 * @param {Object} targetAdmin - The admin whose role will be updated
 * @param {Object} updaterAdmin - The admin performing the update
 * @param {string} newRole - New admin type/role
 * @param {string} updateReason - Reason for role change
 * @param {Object} device - Device object {deviceUUID, deviceType, deviceName}
 * @param {string} requestId - Request ID for tracking
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const updateAdminRoleService = async (targetAdmin, updaterAdmin, newRole, updateReason, device, requestId) => {
    try {
        const oldRole = targetAdmin.adminType;

        // Clone for audit before changes
        const oldAdminData = cloneForAudit(targetAdmin);

        // Check if same role
        if (oldRole === newRole) {
            return {
                success: false,
                type: AdminErrorTypes.INVALID_DATA,
                message: "New role is same as current role"
            };
        }

        // Atomic role update
        const updatedAdmin = await AdminModel.findOneAndUpdate(
            { _id: targetAdmin._id },
            {
                $set: {
                    adminType: newRole,
                    updatedBy: updaterAdmin.adminId
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
            return {
                success: false,
                type: AdminErrorTypes.NOT_FOUND,
                message: "Admin not found"
            };
        }

        logWithTime(`✅ Admin role updated in DB: ${updatedAdmin.adminId} from ${oldRole} to ${newRole}`);

        // Prepare audit data
        const { oldData, newData } = prepareAuditData(oldAdminData, updatedAdmin);

        // Log activity
        logActivityTrackerEvent(
            updaterAdmin,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.UPDATE_ADMIN_ROLE,
            `Updated role for ${updatedAdmin.adminId} from ${oldRole} to ${newRole}`,
            { 
                oldData,
                newData,
                adminActions: { 
                    targetId: updatedAdmin.adminId, 
                    reason: updateReason 
                } 
            }
        );

        return {
            success: true,
            data: {
                admin: updatedAdmin,
                oldRole,
                newRole
            }
        };

    } catch (error) {
        logWithTime(`❌ Update admin role service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { updateAdminRoleService };
