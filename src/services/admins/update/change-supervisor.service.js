// CHANGE SUPERVISOR SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@utils/activity-tracker.util");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * Change Supervisor Service
 * @param {Object} targetAdmin - The admin whose supervisor will be changed
 * @param {Object} changerAdmin - The admin performing the change
 * @param {string} newSupervisorId - New supervisor ID
 * @param {string} changeReason - Reason for change
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const changeSupervisorService = async (targetAdmin, changerAdmin, newSupervisorId, changeReason) => {
    try {
        const oldSupervisorId = targetAdmin.supervisorId;

        // Check if same supervisor
        if (oldSupervisorId === newSupervisorId) {
            return {
                success: false,
                type: AdminErrorTypes.INVALID_DATA,
                message: "New supervisor is same as current supervisor"
            };
        }

        // Atomic supervisor change
        const updatedAdmin = await AdminModel.findOneAndUpdate(
            { _id: targetAdmin._id },
            {
                $set: {
                    supervisorId: newSupervisorId,
                    updatedBy: changerAdmin.adminId
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

        logWithTime(`✅ Supervisor changed in DB: ${updatedAdmin.adminId} from ${oldSupervisorId} to ${newSupervisorId}`);

        // Log activity
        logActivityTrackerEvent(
            changerAdmin,
            ACTIVITY_TRACKER_EVENTS.CHANGE_SUPERVISOR,
            `Changed supervisor for ${updatedAdmin.adminId}`,
            { 
                targetAdminId: updatedAdmin.adminId, 
                oldSupervisorId,
                newSupervisorId,
                reason: changeReason 
            }
        );

        return {
            success: true,
            data: {
                admin: updatedAdmin,
                oldSupervisorId,
                newSupervisorId
            }
        };

    } catch (error) {
        logWithTime(`❌ Change supervisor service error: ${error.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { changeSupervisorService };
