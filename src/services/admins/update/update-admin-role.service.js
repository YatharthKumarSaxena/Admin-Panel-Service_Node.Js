// UPDATE ADMIN ROLE SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * Update Admin Role Service
 * @param {Object} targetAdmin - The admin whose role will be updated
 * @param {Object} updaterAdmin - The admin performing the update
 * @param {string} newRole - New admin type/role
 * @param {string} updateReason - Reason for role change
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const updateAdminRoleService = async (targetAdmin, updaterAdmin, newRole, updateReason) => {
    try {
        const oldRole = targetAdmin.adminType;

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

        // Log activity
        logActivityTrackerEvent(
            updaterAdmin,
            ACTIVITY_TRACKER_EVENTS.UPDATE_ADMIN_ROLE,
            `Updated role for ${updatedAdmin.adminId}`,
            { 
                targetAdminId: updatedAdmin.adminId, 
                oldRole,
                newRole,
                reason: updateReason 
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
